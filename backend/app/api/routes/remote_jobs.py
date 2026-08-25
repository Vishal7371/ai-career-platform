import requests
from fastapi import APIRouter
import time

router = APIRouter(prefix="/live-jobs", tags=["Live Jobs"])

ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api"
_cache        = {"data": [], "timestamp": 0}
CACHE_TTL     = 600  # 10 min

def fetch(search: str = "", tag: str = ""):
    now = time.time()
    if _cache["data"] and (now - _cache["timestamp"]) < CACHE_TTL:
        jobs = _cache["data"]
    else:
        try:
            res  = requests.get(ARBEITNOW_URL, timeout=12)
            data = res.json().get("data", [])
            _cache["data"]      = data
            _cache["timestamp"] = now
            jobs = data
        except Exception as e:
            return {"jobs": [], "total": 0, "error": str(e)}

    # Filter
    if search:
        s = search.lower()
        jobs = [j for j in jobs if s in (
            j.get("title","") + " " + j.get("company_name","") + " " +
            " ".join(j.get("tags", []))
        ).lower()]
    if tag:
        jobs = [j for j in jobs if tag.lower() in [t.lower() for t in j.get("tags", [])]]

    formatted = []
    for j in jobs[:60]:
        tags   = j.get("tags", [])
        salary = j.get("salary", "") or "Competitive"
        formatted.append({
            "id":          str(j.get("slug", "")),
            "title":       j.get("title", "Unknown Role"),
            "company":     j.get("company_name", "Unknown Company"),
            "location":    j.get("location") or "Remote",
            "description": (j.get("description") or "")[:300].strip(),
            "skills":      ", ".join(tags[:8]),
            "salary":      salary,
            "apply_url":   j.get("url", ""),
            "logo":        j.get("company_logo", ""),
            "remote":      j.get("remote", False),
            "job_type":    "Remote" if j.get("remote") else "On-site",
            "source":      "Arbeitnow",
            "created_at":  j.get("created_at", ""),
        })

    return {"jobs": formatted, "total": len(formatted)}


@router.get("")
def get_live_jobs(search: str = "", tag: str = ""):
    return fetch(search, tag)

@router.get("/tags")
def get_popular_tags():
    data = fetch()
    tag_count = {}
    for j in data.get("jobs", []):
        for t in j["skills"].split(", ") if j["skills"] else []:
            tag_count[t] = tag_count.get(t, 0) + 1
    sorted_tags = sorted(tag_count.items(), key=lambda x: -x[1])[:20]
    return {"tags": [t[0] for t in sorted_tags]}
