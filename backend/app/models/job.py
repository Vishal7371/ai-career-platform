from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String, nullable=False, index=True)
    company      = Column(String, nullable=False)
    location     = Column(String)
    job_type     = Column(String, default="Full-time")   # Full-time, Part-time, Remote
    salary_min   = Column(Float)
    salary_max   = Column(Float)
    description  = Column(Text)
    skills       = Column(Text)    # Comma-separated: "Python,FastAPI,SQL"
    experience   = Column(String)  # "0-2 years", "3-5 years"
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Job {self.title} at {self.company}>"
