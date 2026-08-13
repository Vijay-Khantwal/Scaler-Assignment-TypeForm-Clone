from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from typing import List, Optional, Any, Dict

class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

class QuestionOptionBase(BaseSchema):
    id: str
    label: str

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOption(QuestionOptionBase):
    question_id: str

class QuestionBase(BaseSchema):
    id: str
    type: str
    title: str = ""
    settings: Dict[str, Any] = Field(default_factory=dict)
    type_settings: Dict[str, Any] = Field(default_factory=dict)
    parent_id: Optional[str] = None
    options: Optional[List[QuestionOptionCreate]] = None

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    form_id: str
    order_index: int = Field(alias="index")
    
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

class FormBase(BaseSchema):
    id: str
    title: str = "Untitled form"
    status: str = "draft"
    share_id: Optional[str] = None
    thumbnail_color: str = "#6BB6AA"

class FormCreate(FormBase):
    questions: List[QuestionCreate] = []

class FormUpdate(FormBase):
    questions: List[QuestionCreate] = []

class Form(FormBase):
    created_at: str
    updated_at: str
    published_at: Optional[str] = None
    questions: List[Question] = []
    responseCount: int = 0
    completedCount: int = 0

# Submissions
class QuestionAnswerBase(BaseSchema):
    question_id: str
    value: Any

class FormSubmissionBase(BaseSchema):
    answers: List[QuestionAnswerBase]

class FormSubmissionCreate(FormSubmissionBase):
    form_id: str

class FormSubmission(FormSubmissionBase):
    id: str
    form_id: str
    submitted_at: str
