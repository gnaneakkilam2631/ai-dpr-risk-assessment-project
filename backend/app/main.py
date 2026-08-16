from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import auth

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(
    title="AI DPR Risk Assessment API",
    version="1.0.0"
)

# CORS - allows your frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication routes
app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "message": "AI DPR Risk Assessment API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }