from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Create the FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Career Analytics Platform API",
    version="1.0.0",
    docs_url="/docs",       # Auto-generated API docs at /docs
    redoc_url="/redoc"      # Alternative docs at /redoc
)

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint — your first API!
@app.get("/")
def root():
    return {
        "message": "Welcome to AI Career Platform 🚀",
        "status": "running",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}
