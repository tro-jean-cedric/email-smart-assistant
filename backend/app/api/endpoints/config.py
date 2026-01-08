from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import models
from ...database import get_db
from .auth import get_current_user
from pydantic import BaseModel
import uuid
from typing import List, Optional

router = APIRouter()

# Schema
class AIProviderCreate(BaseModel):
    name: str # 'groq', 'openai', 'gemini'
    api_key: str
    priority: int = 1
    is_active: bool = True

class AIProviderOut(BaseModel):
    id: uuid.UUID
    name: str
    priority: int
    is_active: bool
    # Do not return API key
    
    class Config:
        orm_mode = True

# Endpoints
@router.get("/config/ai-providers", response_model=List[AIProviderOut])
def get_ai_providers(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.AIProvider).order_by(models.AIProvider.priority).all()

@router.post("/config/ai-providers")
def create_or_update_ai_provider(
    provider_in: AIProviderCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if exists
    existing = db.query(models.AIProvider).filter(models.AIProvider.name == provider_in.name).first()
    if existing:
        existing.api_key = provider_in.api_key
        existing.priority = provider_in.priority
        existing.is_active = provider_in.is_active
        db.commit()
        return {"message": "Provider updated"}
    else:
        new_provider = models.AIProvider(
            name=provider_in.name,
            api_key=provider_in.api_key,
            priority=provider_in.priority,
            is_active=provider_in.is_active
        )
        db.add(new_provider)
        db.commit()
        return {"message": "Provider created"}

@router.get("/config/users")
def get_users(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Admin only check (omitted for MVP simplicity, assume all auth users are admins for now)
    users = db.query(models.User).all()
    return [{"id": str(u.id), "email": u.email, "name": u.name} for u in users]
