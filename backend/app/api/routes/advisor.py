import requests
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.resume import Resume
from app.models.job import Job
from app.api.routes.matching import calculate_match

router = APIRouter(prefix="/advisor", tags=["AI Advisor"])

OLLAMA_URL   = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:1b"

class ChatMessage(BaseModel):
    user_id: int
    message: str

def get_user_context(user_id: int, db: Session) -> str:
    """Build a context string from real user data"""
    resume = db.query(Resume)\
               .filter(Resume.user_id == user_id)\
               .order_by(Resume.created_at.desc()).first()
    jobs   = db.query(Job).all()

    if not resume:
        return "The user has not uploaded a resume yet."

    user_skills = resume.skills or "None detected"
    matches = []
    for job in jobs:
        m = calculate_match(resume.skills or "", job.skills or "")
        matches.append(f"- {job.title} at {job.company}: {m['score']}% match")

    matches.sort(reverse=True)
    top_matches = "\n".join(matches[:5])

    return f"""
User Resume Skills: {user_skills}

Top Job Matches:
{top_matches}

Total jobs in database: {len(jobs)}
"""

@router.post("/chat")
def chat(msg: ChatMessage, db: Session = Depends(get_db)):
    context = get_user_context(msg.user_id, db)

    system_prompt = f"""You are an expert AI Career Advisor for an AI-powered career platform.
You help users with job matching, skill development, interview prep, and career guidance.

Here is the user's current career data:
{context}

Instructions:
- Give personalized advice based ONLY on the user's actual data above
- Be concise, friendly, and motivating
- Use emojis to make responses engaging
- Format with bullet points when listing items
- Keep responses under 150 words
"""

    payload = {
        "model":  OLLAMA_MODEL,
        "prompt": f"{system_prompt}\n\nUser: {msg.message}\nAdvisor:",
        "stream": False,
        "options": {"temperature": 0.7, "num_predict": 200}
    }

    try:
        res = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response = res.json().get("response", "").strip()
        return {"response": response, "powered_by": "Ollama llama3.2:1b"}
    except Exception as e:
        return {"response": f"❌ Ollama error: {str(e)}\n\nMake sure Ollama is running!", "powered_by": "error"}
