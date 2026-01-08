from fastapi import APIRouter
from .endpoints import emails, auth, config

api_router = APIRouter()

api_router.include_router(auth.router, tags=["authentication"])
api_router.include_router(emails.router, tags=["emails"]) # We need to move existing email routes to a file
api_router.include_router(config.router, tags=["configuration"])
