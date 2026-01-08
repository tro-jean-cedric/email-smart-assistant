from fastapi import FastAPI, Depends
from .database import engine, Base
from . import models

# Create tables
models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Email Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Email Assistant API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

from .services.outlook import outlook_service
from . import models
from .database import get_db
from sqlalchemy.orm import Session

@app.post("/api/emails/sync")
def sync_emails():
    count = outlook_service.sync_emails()
    return {"message": f"Synced {count} emails"}

@app.get("/api/emails")
def get_emails(db: Session = Depends(get_db)):
    emails = db.query(models.Email).order_by(models.Email.received_at.desc()).limit(100).all()
    return emails

@app.get("/api/emails/{email_id}")
def get_email(email_id: str, db: Session = Depends(get_db)):
    email = db.query(models.Email).filter(models.Email.id == email_id).first()
    return email
