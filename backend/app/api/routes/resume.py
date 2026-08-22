import os
import pdfplumber
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resume import Resume

router = APIRouter(prefix="/resume", tags=["Resume"])

UPLOAD_DIR = "uploads"

def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF file"""
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

def extract_skills(text: str) -> str:
    """Simple keyword-based skill extraction"""
    common_skills = [
        "Python", "JavaScript", "React", "Node.js", "FastAPI", "Django",
        "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis",
        "Docker", "Kubernetes", "AWS", "GCP", "Azure",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
        "Pandas", "NumPy", "scikit-learn", "Spark", "Airflow",
        "Git", "Linux", "REST API", "GraphQL", "TypeScript",
        "Java", "C++", "Go", "Rust", "Kotlin", "Swift",
        "HTML", "CSS", "Vue", "Angular", "Next.js",
        "Data Engineering", "MLOps", "CI/CD", "Terraform"
    ]
    text_lower = text.lower()
    found = [skill for skill in common_skills if skill.lower() in text_lower]
    return ", ".join(found)

@router.post("/upload")
async def upload_resume(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a PDF resume and extract text + skills"""

    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save file to disk
    file_path = os.path.join(UPLOAD_DIR, f"user_{user_id}_{file.filename}")
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Extract text from PDF
    try:
        extracted_text = extract_text_from_pdf(file_path)
        skills = extract_skills(extracted_text)
    except Exception as e:
        extracted_text = ""
        skills = ""

    # Save to database
    resume = Resume(
        user_id=user_id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        skills=skills,
        status="parsed"
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "id": resume.id,
        "filename": resume.filename,
        "skills": skills,
        "text_length": len(extracted_text),
        "status": "parsed",
        "message": "Resume uploaded and parsed successfully! ✅"
    }

@router.get("/{user_id}")
def get_user_resumes(user_id: int, db: Session = Depends(get_db)):
    """Get all resumes for a user"""
    resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
    return [{
        "id": r.id,
        "filename": r.filename,
        "skills": r.skills,
        "status": r.status,
        "created_at": r.created_at
    } for r in resumes]
