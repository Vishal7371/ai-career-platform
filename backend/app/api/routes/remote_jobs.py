import requests
from fastapi import APIRouter
import time

router = APIRouter(prefix="/remote-jobs", tags=["Remote Jobs"])

REMOTEOK_URL = "https://remoteok.com/api"
HEADERS      = {"User-Agent": "CareerAI-Platform/1.0"}

_cache = {"data": [], "timestamp": 0}
CACHE_TTL = 600  # 10 minutes

def fetch_jobs(search: str = ""):
    now = time.time()
    if _cache["data"] and (now - _cache["timestamp"]) < CACHE_TTL:
        jobs = _cache["data"]
    else:
        try:
            res  = requests.get(REMOTEOK_URL, headers=HEADERS, timeout=15)
            data = res.json()
            jobs = [j for j in data if isinstance(j, dict) and j.get("id")]
            _cache["data"]      = jobs
            _cache["timestamp"] = now
        except Exception as e:
            return {"jobs": [], "total": 0, "error": str(e)}

    if search:
        s = search.lower()
        jobs = [j for j in jobs if s in (
            j.get("position", "") + " " +
            j.get("company", "") + " " +
            " ".join(j.get("tags", []))
        ).lower()]

    formatted = []
    for j in jobs[:50]:
        salary_raw = j.get("salary", "") or ""
        salary_min = j.get("salary_min") or None
        salary_max = j.get("salary_max") or None

        if salary_min and salary_max:
            salary = f"${int(salary_min):,} – ${int(salary_max):,} / yr"
        elif salary_raw:
            salary = salary_raw
        else:
            salary = "Competitive"

        slug = j.get("slug", j.get("id", ""))
        formatted.append({
            "id":          str(j.get("id", "")),
            "title":       j.get("position", "Unknown Role"),
            "company":     j.get("company",  "Unknown Company"),
            "location":    j.get("location") or "🌍 Remote Worldwide",
            "description": (j.get("description") or "")[:300].strip(),
            "skills":      ", ".join(j.get("tags", [])[:8]),
            "salary":      salary,
            "apply_url":   j.get("url") or f"https://remoteok.com/l/{slug}",
            "logo":        j.get("logo", ""),
            "date":        j.get("date", ""),
            "job_type":    "Remote",
            "source":      "RemoteOK",
        })

    return {"jobs": formatted, "total": len(formatted)}


@router.get("")
def get_remote_jobs(search: str = ""):
    return fetch_jobs(search)
