from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resume import Resume
from app.models.job import Job

router = APIRouter(prefix="/match", tags=["Job Matching"])

def calculate_match(resume_skills: str, job_skills: str) -> dict:
    """Calculate match % between resume skills and job skills"""
    if not resume_skills or not job_skills:
        return {"score": 0, "matched": [], "missing": []}

    resume_set = set(s.strip().lower() for s in resume_skills.split(","))
    job_set    = set(s.strip().lower() for s in job_skills.split(","))

    matched = job_set & resume_set          # skills you HAVE
    missing = job_set - resume_set          # skills you NEED

    score = int((len(matched) / len(job_set)) * 100) if job_set else 0

    return {
        "score":   score,
        "matched": list(matched),
        "missing": list(missing)
    }

@router.get("/user/{user_id}")
def match_jobs_for_user(user_id: int, db: Session = Depends(get_db)):
    """Match all jobs against the user's latest resume"""

    # Get user's latest resume
    resume = db.query(Resume)\
               .filter(Resume.user_id == user_id)\
               .order_by(Resume.created_at.desc())\
               .first()

    if not resume:
        raise HTTPException(status_code=404, detail="No resume found. Please upload your resume first.")

    # Get all jobs
    jobs = db.query(Job).all()

    results = []
    for job in jobs:
        match = calculate_match(resume.skills, job.skills)
        results.append({
            "job_id":      job.id,
            "title":       job.title,
            "company":     job.company,
            "location":    job.location,
            "job_type":    job.job_type,
            "salary_min":  job.salary_min,
            "salary_max":  job.salary_max,
            "skills":      job.skills,
            "experience":  job.experience,
            "match_score": match["score"],
            "matched_skills": match["matched"],
            "missing_skills": match["missing"],
        })

    # Sort by best match first
    results.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "resume_skills": resume.skills,
        "total_jobs":    len(results),
        "matches":       results
    }
