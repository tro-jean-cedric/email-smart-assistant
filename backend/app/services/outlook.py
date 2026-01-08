import win32com.client
import pythoncom
from datetime import datetime
from .. import models
from ..database import SessionLocal
import logging

logger = logging.getLogger(__name__)

class OutlookService:
    def __init__(self):
        self.outlook = None
        self.namespace = None

    def connect(self):
        try:
            # CoInitialize is needed for multi-threading/FastAPI
            pythoncom.CoInitialize() 
            self.outlook = win32com.client.Dispatch("Outlook.Application")
            self.namespace = self.outlook.GetNamespace("MAPI")
            logger.info("Connected to Outlook successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to Outlook: {e}")
            raise

    def get_inbox(self):
        if not self.namespace:
            self.connect()
        return self.namespace.GetDefaultFolder(6) # 6 = Inbox

    def sync_emails(self, limit=50):
        if not self.namespace:
            self.connect()
        
        inbox = self.get_inbox()
        messages = inbox.Items
        messages.Sort("[ReceivedTime]", True) # Sort by latest first

        db = SessionLocal()
        count = 0
        try:
            # Simple sync: iterate and save if not exists
            for message in messages:
                if count >= limit:
                    break
                
                try:
                    # Skip if not an email (e.g., meeting invite might differ)
                    if message.Class != 43: # 43 = olMail
                        continue

                    outlook_id = message.EntryID
                    
                    # Check if exists
                    existing = db.query(models.Email).filter(models.Email.outlook_id == outlook_id).first()
                    if existing:
                        continue

                    email_obj = models.Email(
                        outlook_id=outlook_id,
                        subject=message.Subject,
                        sender=message.SenderName, # Or SenderEmailAddress
                        body_text=message.Body,
                        # body_html=message.HTMLBody, # Can be large
                        received_at=message.ReceivedTime.replace(tzinfo=None), # Naive for now
                        is_read=not message.UnRead
                    )
                    db.add(email_obj)
                    count += 1
                except Exception as e:
                    logger.error(f"Error processing message: {e}")
                    continue
            
            db.commit()
            return count
        except Exception as e:
            db.rollback()
            logger.error(f"Sync error: {e}")
            raise
        finally:
            db.close()

outlook_service = OutlookService()
