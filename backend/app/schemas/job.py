from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class JobCreate(BaseModel):
    title:       str
    company:     str
    location:    Optional[str] = None
    job_type:    Optional[str] = "Full-time"
    salary_min:  Optional[float] = None
    salary_max:  Optional[float] = None
    description: Optional[str] = None
    skills:      Optional[str] = None   # "Python,FastAPI,SQL"
    experience:  Optional[str] = None

class JobResponse(BaseModel):
    id:          int
    title:       str
    company:     str
    location:    Optional[str]
    job_type:    Optional[str]
    salary_min:  Optional[float]
    salary_max:  Optional[float]
    description: Optional[str]
    skills:      Optional[str]
    experience:  Optional[str]
    created_at:  datetime

    class Config:
        from_attributes = True

class JobList(BaseModel):
    jobs:  List[JobResponse]
    total: int
