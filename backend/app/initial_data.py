import logging
import sys
import os

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal, engine, Base
from app import models
from app.core.security import get_password_hash
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        admin_email = "admin@example.com"
        user = db.query(models.User).filter(models.User.email == admin_email).first()
        
        if not user:
            logger.info("Creating default admin user...")
            admin_user = models.User(
                email=admin_email,
                name="System Admin",
                hashed_password=get_password_hash("admin"), # Default password
                preferences={"theme": "light"}
            )
            db.add(admin_user)
            db.commit()
            logger.info("Default admin user created. (Email: admin@example.com, Pass: admin)")
        else:
            logger.info("Admin user already exists.")
            
    except Exception as e:
        logger.error(f"Error initializing DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
