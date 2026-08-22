from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename     = Column(String, nullable=False)       # original file name
    file_path    = Column(String, nullable=False)       # where it's saved on disk
    extracted_text = Column(Text)                       # raw text from PDF
    skills       = Column(Text)                         # extracted skills
    status       = Column(String, default="uploaded")   # uploaded, parsed, analyzed
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Resume {self.filename} by user {self.user_id}>"
