import uuid
import datetime
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    if db.query(models.Form).count() > 0:
        print("Database already seeded")
        db.close()
        return

    now = datetime.datetime.utcnow().isoformat()
    share_id = "share_" + uuid.uuid4().hex[:8]
    
    # 1. Customer Feedback Survey
    form1 = models.Form(
        id="form_cfs123",
        title="Customer Feedback Survey",
        status="published",
        share_id=share_id,
        thumbnail_color="#6BB6AA",
        created_at=now,
        updated_at=now,
        published_at=now
    )
    db.add(form1)
    db.commit()

    questions = [
        models.Question(
            id="q1", form_id=form1.id, type="yes_no", title="Did you enjoy your experience?", order_index=0,
            settings={"required": True, "description": "Please be honest!"}
        ),
        models.Question(
            id="q2", form_id=form1.id, type="short_text", title="What could we do better?", order_index=1,
            settings={"required": False}
        ),
        models.Question(
            id="q3", form_id=form1.id, type="rating", title="How would you rate our service out of 5?", order_index=2,
            settings={"required": True}, type_settings={"max": 5}
        )
    ]
    for q in questions:
        db.add(q)
    db.commit()

    # Create 3 submissions
    for i in range(3):
        sub = models.Submission(id=f"sub_{i}", form_id=form1.id, submitted_at=now)
        db.add(sub)
        db.commit()
        
        a1 = models.SubmissionAnswer(submission_id=sub.id, question_id="q1", value=True if i % 2 == 0 else False)
        a2 = models.SubmissionAnswer(submission_id=sub.id, question_id="q2", value="Faster response times")
        a3 = models.SubmissionAnswer(submission_id=sub.id, question_id="q3", value=4 if i % 2 == 0 else 5)
        
        db.add_all([a1, a2, a3])
        db.commit()
    
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed()
