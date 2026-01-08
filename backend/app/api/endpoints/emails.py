from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ... import models
from ...database import get_db
from ...services.outlook import outlook_service
from .auth import get_current_user

router = APIRouter()

@router.post("/api/emails/sync") # Keep legacy path or move to /emails/sync? Let's use standardized paths in api.py
def sync_emails(current_user: models.User = Depends(get_current_user)):
    count = outlook_service.sync_emails()
    return {"message": f"Synced {count} emails"}

@router.get("/api/emails")
def get_emails(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    emails = db.query(models.Email).order_by(models.Email.received_at.desc()).limit(100).all()
    return emails

@router.get("/api/emails/{email_id}")
def get_email(
    email_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    email = db.query(models.Email).filter(models.Email.id == email_id).first()
    return email
