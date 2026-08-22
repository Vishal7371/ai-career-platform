from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth
from app.api.routes import jobs
from app.api.routes import resume


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Career Analytics Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
app.include_router(resume.router)

# Register route modules
app.include_router(auth.router)                    # ← ADD THIS

@app.get("/")
def root():
    return {
        "message": "Welcome to AI Career Platform 🚀",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
