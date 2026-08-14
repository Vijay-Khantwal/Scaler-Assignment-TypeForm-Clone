from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid
import datetime
import secrets

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

# Safely add published_schema column if it doesn't exist for older SQLite DBs
try:
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE forms ADD COLUMN published_schema JSON"))
        conn.commit()
except Exception:
    pass

app = FastAPI(title="Typeform Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_id(prefix: str):
    if prefix == "share":
        return f"{prefix}_{secrets.token_urlsafe(12)}"
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

@app.get("/api/forms", response_model=list[schemas.Form])
def list_forms(db: Session = Depends(get_db)):
    forms = db.query(models.Form).order_by(models.Form.created_at.desc()).all()
    return forms

@app.post("/api/forms", response_model=schemas.Form)
def create_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    db_form = models.Form(
        id=form.id,
        title=form.title,
        status=form.status,
        share_id=form.share_id,
        thumbnail_color=form.thumbnail_color
    )
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form

@app.get("/api/forms/{form_id}", response_model=schemas.Form)
def get_form(form_id: str, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    form.questions.sort(key=lambda q: q.order_index)
    for q in form.questions:
        if q.options:
            q.options.sort(key=lambda o: o.order_index)
    return form

@app.put("/api/forms/{form_id}", response_model=schemas.Form)
def update_form(form_id: str, form_data: schemas.FormUpdate, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        db_form = models.Form(
            id=form_id,
            title=form_data.title,
            status=form_data.status,
            share_id=form_data.share_id,
            thumbnail_color=form_data.thumbnail_color,
            created_at=datetime.datetime.utcnow().isoformat(),
            updated_at=datetime.datetime.utcnow().isoformat()
        )
        db.add(db_form)
    else:
        db_form.title = form_data.title
        db_form.status = form_data.status
        db_form.thumbnail_color = form_data.thumbnail_color
        db_form.updated_at = datetime.datetime.utcnow().isoformat()
    
    # Explicitly delete question options to avoid orphaned rows and unique constraint errors
    question_ids = [q.id for q in db.query(models.Question.id).filter(models.Question.form_id == form_id)]
    if question_ids:
        db.query(models.QuestionOption).filter(models.QuestionOption.question_id.in_(question_ids)).delete(synchronize_session=False)
        
    db.query(models.Question).filter(models.Question.form_id == form_id).delete(synchronize_session=False)
    
    for idx, q in enumerate(form_data.questions):
        db_q = models.Question(
            id=q.id,
            form_id=form_id,
            parent_id=q.parent_id,
            type=q.type,
            title=q.title,
            order_index=idx,
            settings=q.settings,
            type_settings=q.type_settings
        )
        db.add(db_q)
        if q.options:
            for opt_idx, opt in enumerate(q.options):
                db_opt = models.QuestionOption(
                    id=opt.id,
                    question_id=q.id,
                    label=opt.label,
                    order_index=opt_idx
                )
                db.add(db_opt)

    db.commit()
    db.refresh(db_form)
    db_form.questions.sort(key=lambda q: q.order_index)
    for q in db_form.questions:
        if q.options:
            q.options.sort(key=lambda o: o.order_index)
    return db_form

@app.delete("/api/forms/{form_id}")
def delete_form(form_id: str, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    db.delete(db_form)
    db.commit()
    return {"ok": True}

@app.delete("/api/forms/{form_id}/submissions/{submission_id}")
def delete_submission(form_id: str, submission_id: str, db: Session = Depends(get_db)):
    db_sub = db.query(models.Submission).filter(
        models.Submission.id == submission_id,
        models.Submission.form_id == form_id
    ).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    db.delete(db_sub)
    db.commit()
    return {"message": "Submission deleted"}

@app.post("/api/seed")
def seed_database():
    import seed
    seed.seed()
    return {"message": "Database seeded successfully"}

@app.post("/api/forms/{form_id}/publish", response_model=schemas.Form)
def publish_form(form_id: str, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    now = datetime.datetime.utcnow().isoformat()
    db_form.status = "published"
    db_form.published_at = now
    db_form.updated_at = now
    if not db_form.share_id:
        db_form.share_id = generate_id("share")
    
    db.commit()
    db.refresh(db_form)
    db_form.questions.sort(key=lambda q: q.order_index)
    for q in db_form.questions:
        if q.options:
            q.options.sort(key=lambda o: o.order_index)
            
    # Serialize the current questions to save as a snapshot
    questions_data = [schemas.Question.model_validate(q).model_dump(by_alias=True) for q in db_form.questions]
    db_form.published_schema = questions_data
    db.commit()
    db.refresh(db_form)
    
    return db_form

@app.get("/api/public/forms/{share_id}", response_model=schemas.Form)
def get_public_form(share_id: str, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(
        (models.Form.share_id == share_id) | (models.Form.id == share_id),
        models.Form.status == "published"
    ).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    # Construct response dictionary overriding live questions with the published snapshot
    form_data = schemas.Form.model_validate(form).model_dump(by_alias=True)
    if form.published_schema:
        form_data["questions"] = form.published_schema
    return form_data

@app.post("/api/public/forms/{share_id}/submissions")
def submit_form(share_id: str, submission: schemas.FormSubmissionCreate, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.share_id == share_id, models.Form.status == "published").first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    # Server-side validation against the published snapshot
    import re
    answers_by_q_id = {ans.question_id: ans.value for ans in submission.answers}
    
    questions_to_validate = form.published_schema if form.published_schema else [schemas.Question.model_validate(q).model_dump(by_alias=True) for q in form.questions]
    
    for q_dict in questions_to_validate:
        q_id = q_dict.get("id")
        q_title = q_dict.get("title", "")
        q_type = q_dict.get("type", "")
        val = answers_by_q_id.get(q_id)
        
        is_empty = val is None or val == "" or (isinstance(val, list) and len(val) == 0)
        
        settings = q_dict.get("settings", {})
        if settings.get("required") and is_empty:
            raise HTTPException(status_code=400, detail=f"Question '{q_title}' is required.")
            
        if not is_empty:
            type_settings = q_dict.get("typeSettings", {})
            
            if q_type in ["short_text", "long_text"]:
                max_len = type_settings.get("maxLength")
                if max_len and len(str(val)) > max_len:
                    raise HTTPException(status_code=400, detail=f"Answer for '{q_title}' exceeds max length of {max_len}.")
                    
            elif q_type == "email":
                if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", str(val)):
                    raise HTTPException(status_code=400, detail=f"Invalid email format for '{q_title}'.")
                    
            elif q_type == "number":
                try:
                    num_val = float(val)
                except ValueError:
                    raise HTTPException(status_code=400, detail=f"Answer for '{q_title}' must be a number.")
                
                min_val = type_settings.get("minValue")
                if min_val is not None and num_val < min_val:
                    raise HTTPException(status_code=400, detail=f"Answer for '{q_title}' must be at least {min_val}.")
                    
                max_val = type_settings.get("maxValue")
                if max_val is not None and num_val > max_val:
                    raise HTTPException(status_code=400, detail=f"Answer for '{q_title}' must be at most {max_val}.")
    
    db_sub = models.Submission(
        id=generate_id("sub"),
        form_id=form.id,
        submitted_at=datetime.datetime.utcnow().isoformat()
    )
    db.add(db_sub)
    db.commit()

    for ans in submission.answers:
        db_ans = models.SubmissionAnswer(
            submission_id=db_sub.id,
            question_id=ans.question_id,
            value=ans.value
        )
        db.add(db_ans)
    
    db.commit()
    return {"ok": True, "id": db_sub.id}

@app.get("/api/forms/{form_id}/submissions", response_model=list[schemas.FormSubmission])
def list_submissions(form_id: str, db: Session = Depends(get_db)):
    subs = db.query(models.Submission).filter(models.Submission.form_id == form_id).order_by(models.Submission.submitted_at.desc()).all()
    
    result = []
    for sub in subs:
        result.append({
            "id": sub.id,
            "form_id": sub.form_id,
            "submitted_at": sub.submitted_at,
            "answers": [
                {"question_id": a.question_id, "value": a.value} for a in sub.answers
            ]
        })
    return result
