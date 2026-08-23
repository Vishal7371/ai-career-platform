from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.resume import Resume
from app.models.job import Job
from app.api.routes.matching import calculate_match

router = APIRouter(prefix="/advisor", tags=["AI Advisor"])

class ChatMessage(BaseModel):
    user_id: int
    message: str

def get_user_context(user_id: int, db: Session) -> dict:
    """Gather all user data to generate smart responses"""
    resume = db.query(Resume)\
               .filter(Resume.user_id == user_id)\
               .order_by(Resume.created_at.desc())\
               .first()
    jobs = db.query(Job).all()

    user_skills = []
    matches = []

    if resume and resume.skills:
        user_skills = [s.strip() for s in resume.skills.split(",")]
        for job in jobs:
            match = calculate_match(resume.skills, job.skills or "")
            matches.append({**job.__dict__, "score": match["score"],
                           "missing": match["missing"]})
        matches.sort(key=lambda x: x["score"], reverse=True)

    return {
        "has_resume": resume is not None,
        "skills": user_skills,
        "skill_count": len(user_skills),
        "matches": matches,
        "top_match": matches[0] if matches else None,
        "high_matches": [m for m in matches if m["score"] >= 75],
        "total_jobs": len(jobs)
    }

def generate_response(message: str, ctx: dict) -> str:
    """Generate smart personalized response based on user data"""
    msg = message.lower().strip()

    # ── No resume uploaded ──
    if not ctx["has_resume"]:
        return ("📄 I don't see a resume in your profile yet!\n\n"
                "Please go to the **Resume** page and upload your PDF resume first. "
                "Once I can see your skills, I can give you personalized career advice!")

    skills     = ctx["skills"]
    top        = ctx["top_match"]
    high       = ctx["high_matches"]
    all_matches = ctx["matches"]

    # ── Greetings ──
    if any(w in msg for w in ["hi", "hello", "hey", "hii"]):
        return (f"👋 Hello! I'm your AI Career Advisor.\n\n"
                f"I can see you have **{ctx['skill_count']} skills** in your resume. "
                f"Ask me anything about your career, jobs, or skills!")

    # ── Best job match ──
    if any(w in msg for w in ["best job", "top job", "best match", "top match"]):
        if top:
            return (f"🏆 Your best job match is:\n\n"
                    f"**{top['title']}** at **{top['company']}**\n"
                    f"📍 {top['location']} | Match Score: **{top['score']}%**\n\n"
                    f"You already have the skills needed — apply now! 🚀")
        return "Upload your resume first to find your best job match!"

    # ── Jobs / matching ──
    if any(w in msg for w in ["job", "match", "position", "role", "opening"]):
        if high:
            jobs_text = "\n".join([f"• **{m['title']}** at {m['company']} — {m['score']}% match"
                                   for m in high[:3]])
            return (f"💼 You have **{len(high)}** high-match jobs (75%+):\n\n"
                    f"{jobs_text}\n\n"
                    f"Go to **My Matches** page to see all {ctx['total_jobs']} jobs!")
        elif all_matches:
            m = all_matches[0]
            return (f"📊 Your best match is **{m['title']}** at {m['score']}%.\n\n"
                    f"Build more skills to increase your match scores!")
        return "No matches found. Upload your resume to get job matches!"

    # ── Skills ──
    if any(w in msg for w in ["skill", "know", "have", "my skill"]):
        if skills:
            skill_list = ", ".join(skills[:8])
            return (f"🧠 From your resume, I detected **{len(skills)} skills**:\n\n"
                    f"{skill_list}\n\n"
                    f"{'Great skill set! 🔥' if len(skills) >= 5 else 'Consider adding more skills to your resume!'}")
        return "No skills detected. Make sure your resume clearly lists your technical skills."

    # ── Skill gap ──
    if any(w in msg for w in ["missing", "learn", "gap", "improve", "need"]):
        if all_matches:
            all_missing = []
            for m in all_matches[:5]:
                all_missing.extend(m.get("missing", []))
            unique_missing = list(set(all_missing))[:6]
            if unique_missing:
                skills_text = ", ".join(unique_missing)
                return (f"📚 To boost your job matches, learn these skills:\n\n"
                        f"**{skills_text}**\n\n"
                        f"These appear most in jobs you're close to matching!")
        return "Upload resume and check My Matches to discover your skill gaps!"

    # ── Salary ──
    if any(w in msg for w in ["salary", "pay", "money", "ctc", "package"]):
        if all_matches and all_matches[0].get("salary_min"):
            m = all_matches[0]
            return (f"💰 For your top match **{m['title']}**:\n\n"
                    f"Salary range: ₹{m['salary_min']/100000:.1f}L – ₹{m['salary_max']/100000:.1f}L per year\n\n"
                    f"With {ctx['skill_count']} skills, you're well positioned to negotiate!")
        return "💰 Salary depends on your skills and experience. Upload your resume for personalized salary insights!"

    # ── Interview tips ──
    if any(w in msg for w in ["interview", "prepare", "tips", "hr", "technical"]):
        skill_tip = skills[0] if skills else "your primary skill"
        return (f"🎯 Interview Tips for you:\n\n"
                f"1. **Review {skill_tip}** — it's in your resume, expect questions on it\n"
                f"2. **Build projects** — show real work on GitHub\n"
                f"3. **Practice DSA** — LeetCode easy/medium problems\n"
                f"4. **Research the company** — know their product & tech stack\n"
                f"5. **Prepare STAR stories** — Situation, Task, Action, Result\n\n"
                f"You've got this! 💪")

    # ── Resume tips ──
    if any(w in msg for w in ["resume", "cv", "improve resume", "resume tips"]):
        return ("📄 Resume Tips:\n\n"
                "1. **Quantify achievements** — 'Improved speed by 40%' not 'improved speed'\n"
                "2. **List skills clearly** — separate section for technical skills\n"
                "3. **Add GitHub link** — show your real projects\n"
                "4. **Keep it 1-2 pages** — recruiters spend 6 seconds\n"
                "5. **Use keywords** — match job description keywords\n\n"
                f"Your resume currently shows **{ctx['skill_count']} skills** — good start! 🎯")

    # ── Career advice ──
    if any(w in msg for w in ["career", "advice", "path", "grow", "future", "goal"]):
        if top:
            return (f"🚀 Career Advice for you:\n\n"
                    f"You're currently best matched for **{top['title']}** roles.\n\n"
                    f"**Short term (3 months):** Focus on missing skills in your top matches\n"
                    f"**Medium term (6 months):** Build 2-3 portfolio projects\n"
                    f"**Long term (1 year):** Target senior roles with 80%+ match scores\n\n"
                    f"You have {ctx['skill_count']} skills — keep building! 💪")
        return ("🚀 Start by:\n1. Upload your resume\n2. Check job matches\n3. Identify skill gaps\n4. Learn & apply!")

    # ── Default ──
    return (f"🤖 I'm your Career Advisor! Ask me about:\n\n"
            f"• 💼 **Jobs** — 'What jobs match me?'\n"
            f"• 🧠 **Skills** — 'What skills do I have?'\n"
            f"• 📚 **Skill gaps** — 'What should I learn?'\n"
            f"• 💰 **Salary** — 'What salary can I expect?'\n"
            f"• 🎯 **Interview** — 'Give me interview tips'\n"
            f"• 🚀 **Career** — 'What career path should I follow?'")


@router.post("/chat")
def chat(msg: ChatMessage, db: Session = Depends(get_db)):
    ctx      = get_user_context(msg.user_id, db)
    response = generate_response(msg.message, ctx)
    return {"response": response, "user_id": msg.user_id}
