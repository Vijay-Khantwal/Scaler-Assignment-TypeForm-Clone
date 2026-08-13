from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Form(Base):
    __tablename__ = "forms"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, default="Untitled form")
    status = Column(String, default="draft")
    share_id = Column(String, unique=True, index=True, nullable=True)
    thumbnail_color = Column(String, default="#6BB6AA")
    created_at = Column(String, default=lambda: datetime.datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.datetime.utcnow().isoformat())
    published_at = Column(String, nullable=True)

    questions = relationship("Question", back_populates="form", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="form", cascade="all, delete-orphan")

    @property
    def responseCount(self):
        return len(self.submissions)

    @property
    def completedCount(self):
        return len(self.submissions)

class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, index=True)
    form_id = Column(String, ForeignKey("forms.id"))
    parent_id = Column(String, ForeignKey("questions.id"), nullable=True)
    type = Column(String, nullable=False)
    title = Column(String, default="")
    order_index = Column(Integer, default=0)
    
    settings = Column(JSON, default=dict)
    type_settings = Column(JSON, default=dict)

    form = relationship("Form", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
    # For sub-questions if needed
    sub_questions = relationship("Question", backref="parent", remote_side=[id])

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String, primary_key=True, index=True)
    question_id = Column(String, ForeignKey("questions.id"))
    label = Column(String, nullable=False)
    order_index = Column(Integer, default=0)

    question = relationship("Question", back_populates="options")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String, primary_key=True, index=True)
    form_id = Column(String, ForeignKey("forms.id"))
    submitted_at = Column(String, default=lambda: datetime.datetime.utcnow().isoformat())

    form = relationship("Form", back_populates="submissions")
    answers = relationship("SubmissionAnswer", back_populates="submission", cascade="all, delete-orphan")

class SubmissionAnswer(Base):
    __tablename__ = "submission_answers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    submission_id = Column(String, ForeignKey("submissions.id"))
    question_id = Column(String, ForeignKey("questions.id"))
    value = Column(JSON, nullable=True)

    submission = relationship("Submission", back_populates="answers")
