from fastapi import FastAPI
from .database import engine
from . import models
from .api.api import api_router
from fastapi.middleware.cors import CORSMiddleware

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Email Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Email Assistant API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

