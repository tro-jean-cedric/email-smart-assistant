from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID
from .database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    outlook_profile = Column(String)
    hashed_password = Column(String)
    preferences = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)

    emails = relationship("Email", back_populates="user")
    categories = relationship("Category", back_populates="user")

class Email(Base):
    __tablename__ = "emails"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    outlook_id = Column(String, unique=True, index=True)
    subject = Column(Text)
    sender = Column(String)
    recipients = Column(ARRAY(Text)) # Requires PostgreSQL
    cc = Column(ARRAY(Text))
    body_text = Column(Text)
    body_html = Column(Text)
    received_at = Column(DateTime)
    is_read = Column(Boolean, default=False)
    is_flagged = Column(Boolean, default=False)
    has_attachments = Column(Boolean, default=False)
    priority_score = Column(Integer)
    ai_confidence = Column(Float)
    processed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="emails")
    attachments = relationship("Attachment", back_populates="email")
    categories = relationship("EmailCategory", back_populates="email")
    actions = relationship("Action", back_populates="email")

class Attachment(Base):
    __tablename__ = "attachments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(UUID(as_uuid=True), ForeignKey("emails.id"))
    filename = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    storage_path = Column(String)
    extracted_text = Column(Text)
    file_metadata = Column(JSONB)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    email = relationship("Email", back_populates="attachments")

class Category(Base):
    __tablename__ = "categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String)
    color = Column(String)
    icon = Column(String)
    is_default = Column(Boolean, default=False)
    rules = Column(JSONB)
    order = Column(Integer)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="categories")

class EmailCategory(Base):
    __tablename__ = "email_categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(UUID(as_uuid=True), ForeignKey("emails.id"))
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"))
    confidence = Column(Float)
    is_manual = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    email = relationship("Email", back_populates="categories")
    category = relationship("Category")

class Action(Base):
    __tablename__ = "actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(UUID(as_uuid=True), ForeignKey("emails.id"))
    action_type = Column(String)
    description = Column(Text)
    urgency = Column(String)
    deadline = Column(DateTime)
    status = Column(String)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    email = relationship("Email", back_populates="actions")

class AIProvider(Base):
    __tablename__ = "ai_providers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    api_key = Column(String)
    priority = Column(Integer)
    is_active = Column(Boolean, default=True)
    last_success = Column(DateTime)
    last_failure = Column(DateTime)
    success_count = Column(Integer, default=0)
    failure_count = Column(Integer, default=0)
    avg_response_time = Column(Float)
    tokens_used = Column(Integer, default=0)

class LearningData(Base):
    __tablename__ = "learning_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    email_id = Column(UUID(as_uuid=True), ForeignKey("emails.id"))
    original_category = Column(UUID(as_uuid=True))
    corrected_category = Column(UUID(as_uuid=True))
    feedback_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
