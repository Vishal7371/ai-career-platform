# 🚀 AI-Powered Data Intelligence & Career Analytics Platform

> **A 90-Day Portfolio-Grade Project** | Built Step-by-Step from Zero to Production

---

## 👋 About This Project

This is a full-stack AI-powered platform that helps users:
- 📄 Parse and analyze resumes
- 💼 Match jobs based on skills using AI
- 📊 Visualize career analytics and skill gaps
- 🤖 Chat with an AI career assistant
- 📈 Track real-time job market trends

**Target**: 3rd-year CS student → Portfolio-grade system that impresses any recruiter.

---

## 🗺️ Full Tech Stack (What We Use & Why)

### 🧱 Phase 1: Foundation (Days 1–15)
| Tool | Purpose | Why We Use It |
|------|----------|---------------|
| **Python 3.11+** | Core language | Industry standard for AI/ML/Data |
| **FastAPI** | Backend API | Fast, modern, auto-docs, async |
| **PostgreSQL** | Main database | Reliable relational DB, industry standard |
| **React + Vite** | Frontend UI | Fast, component-based, widely used |
| **Docker** | Containerization | Run everything consistently anywhere |
| **Git + GitHub** | Version control | Track changes, collaborate, showcase |

### ⚙️ Phase 2: Data Engineering (Days 16–35)
| Tool | Purpose | Why We Use It |
|------|----------|---------------|
| **Apache Airflow** | Workflow orchestration | Schedule & automate data pipelines |
| **Apache Spark (PySpark)** | Big data processing | Handle millions of job records fast |
| **AWS S3** | Cloud object storage | Store raw data files cheaply |
| **dbt** | Data transformation | SQL-based, version-controlled transforms |
| **Pandas** | Data manipulation | Quick data cleaning & analysis |
| **Great Expectations** | Data validation | Ensure data quality automatically |

### 🤖 Phase 3: AI/ML (Days 36–55)
| Tool | Purpose | Why We Use It |
|------|----------|---------------|
| **spaCy** | NLP / text processing | Extract skills from resumes |
| **scikit-learn** | Traditional ML | Job matching, classification |
| **sentence-transformers** | Semantic similarity | Smart job-resume matching |
| **PyPDF2 / pdfplumber** | PDF parsing | Read resume files |
| **NLTK** | Text preprocessing | Clean and tokenize text |

### 🧠 Phase 4: GenAI (Days 56–70)
| Tool | Purpose | Why We Use It |
|------|----------|---------------|
| **OpenAI API / Gemini** | LLM backbone | Generate AI responses |
| **LangChain** | LLM framework | Chain prompts, manage context |
| **ChromaDB / Pinecone** | Vector database | Store embeddings for RAG |
| **RAG** | Smart AI answers | Answer questions using your own data |

### 🖥️ Phase 5: Backend + Frontend (Days 71–80)
| Tool | Purpose | Why We Use It |
|------|----------|---------------|
| **SQLAlchemy** | ORM | Python to PostgreSQL bridge |
| **Alembic** | DB migrations | Track database schema changes |
| **React + TypeScript** | Frontend | Type-safe, scalable UI |
| **Recharts / Chart.js** | Data visualization | Beautiful interactive charts |
| **Tailwind CSS** | Styling | Utility-first, fast styling |
| **JWT Auth** | Authentication | Secure user login/logout |

### 🚀 Phase 6: Deployment + MLOps (Days 81–90)
| Tool | Purpose | Why We Use It |
|------|----------|---------------|
| **Docker + Docker Compose** | Containerize everything | One command to run all services |
| **AWS EC2 / Render** | Cloud hosting | Deploy your app online |
| **MLflow** | ML experiment tracking | Track model versions & metrics |
| **GitHub Actions** | CI/CD pipeline | Auto-test & deploy on push |
| **Prometheus + Grafana** | Monitoring | Watch app health in real-time |
| **pytest** | Testing | Ensure code correctness |

---

## 📁 Project Folder Structure

```
ai-career-platform/
│
├── 📂 backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── auth.py            # Login/register endpoints
│   │   │   ├── resume.py          # Resume upload & parsing
│   │   │   ├── jobs.py            # Job search & matching
│   │   │   └── analytics.py       # Dashboard data
│   │   ├── core/
│   │   │   ├── config.py          # App configuration
│   │   │   ├── database.py        # DB connection
│   │   │   └── security.py        # JWT auth logic
│   │   ├── models/                # SQLAlchemy DB models
│   │   ├── schemas/               # Pydantic request/response
│   │   ├── services/              # Business logic
│   │   │   ├── resume_parser.py   # PDF to structured data
│   │   │   ├── job_matcher.py     # AI job matching
│   │   │   └── ai_assistant.py    # GenAI chat
│   │   └── main.py                # FastAPI entry point
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📂 frontend/                   # React frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Resume.tsx
│   │   │   ├── Jobs.tsx
│   │   │   └── AIChat.tsx
│   │   ├── hooks/
│   │   ├── services/              # API call functions
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
│
├── 📂 data-pipeline/              # Airflow + Spark ETL
│   ├── dags/                      # Airflow DAGs
│   ├── spark_jobs/                # PySpark scripts
│   └── dbt/                       # dbt models
│
├── 📂 ml/                         # Machine Learning
│   ├── notebooks/                 # Jupyter exploration
│   ├── models/                    # Saved ML models
│   ├── training/                  # Training scripts
│   └── mlflow/                    # Experiment tracking
│
├── 📂 infrastructure/             # DevOps
│   ├── docker-compose.yml
│   └── .github/workflows/
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗓️ Day-by-Day Roadmap

### 📅 Week 1 (Days 1–7): Setup & Architecture
```
Day 1  → Install all tools: Python, Node.js, Docker, PostgreSQL, VS Code
Day 2  → Create project folder structure, initialize Git + GitHub repo
Day 3  → Setup FastAPI backend with a "Hello World" endpoint
Day 4  → Connect FastAPI to PostgreSQL with SQLAlchemy
Day 5  → Setup React frontend with Vite, basic UI layout
Day 6  → Connect frontend to backend (first API call from React)
Day 7  → Docker Compose to run everything with one command
```

### 📅 Week 2 (Days 8–15): Core Features
```
Day 8  → User registration & login (JWT Auth)
Day 9  → Resume upload endpoint (accept PDF files)
Day 10 → Parse PDF resume and extract text
Day 11 → Job listings API + PostgreSQL schema
Day 12 → Basic job search with filters
Day 13 → Simple dashboard UI in React
Day 14 → Push to GitHub + update README
Day 15 → Review and polish Phase 1
```

### 📅 Week 3–4 (Days 16–35): Data Engineering
```
Days 16-20 → Setup Airflow, create first DAG
Days 21-25 → PySpark data processing pipeline
Days 26-30 → AWS S3 integration, data lake setup
Days 31-35 → dbt models, data warehouse design
```

### 📅 Week 5–7 (Days 36–55): AI/ML
```
Days 36-40 → spaCy NLP for skill extraction from resumes
Days 41-45 → Job-resume matching algorithm
Days 46-50 → Recommendation engine
Days 51-55 → Skill gap analysis model
```

### 📅 Week 8–9 (Days 56–70): GenAI
```
Days 56-60 → LangChain + OpenAI/Gemini integration
Days 61-65 → Vector database + RAG pipeline
Days 66-70 → AI career assistant chat interface
```

### 📅 Week 10 (Days 71–80): Polish
```
Days 71-75 → Full React dashboard with charts
Days 76-80 → Authentication flow, error handling
```

### 📅 Week 11–13 (Days 81–90): Deploy
```
Days 81-85 → Docker production setup + MLflow
Days 86-88 → AWS/Render deployment
Days 89-90 → CI/CD, monitoring, final documentation
```

---

## 🛠️ Prerequisites — Install Before Day 1

### Software to Install
- [ ] **Python 3.11+** → https://python.org
- [ ] **Node.js 18+** → https://nodejs.org
- [ ] **Docker Desktop** → https://docker.com
- [ ] **PostgreSQL 15** → https://postgresql.org
- [ ] **VS Code** → https://code.visualstudio.com
- [ ] **Git** → https://git-scm.com

### VS Code Extensions (Install These)
- [ ] Python (Microsoft)
- [ ] Pylance
- [ ] ESLint
- [ ] Prettier
- [ ] Docker
- [ ] GitLens
- [ ] REST Client (for testing APIs)

### Free Accounts to Create
- [ ] **GitHub** → https://github.com
- [ ] **AWS Free Tier** → https://aws.amazon.com/free
- [ ] **OpenAI API** → https://platform.openai.com (or use Gemini — free)
- [ ] **Render** → https://render.com (free deployment)

---

## 🔑 Key Concepts You'll Learn

```
✅ REST API design              ✅ Database modeling
✅ JWT Authentication           ✅ File upload handling
✅ ETL pipelines                ✅ Data warehousing
✅ NLP & text processing        ✅ ML model training
✅ Vector databases             ✅ RAG architecture
✅ LLM integration              ✅ Docker containers
✅ CI/CD pipelines              ✅ Cloud deployment
✅ Monitoring                   ✅ MLOps practices
```

---

## 📐 Architecture Overview

```
┌──────────────────────────────────────────────┐
│               USER (Browser)                 │
└──────────────────┬───────────────────────────┘
                   │ HTTP/HTTPS
┌──────────────────▼───────────────────────────┐
│          React Frontend (Vite + TS)          │
│    Dashboard | Resume | Jobs | AI Chat        │
└──────────────────┬───────────────────────────┘
                   │ REST API calls
┌──────────────────▼───────────────────────────┐
│          FastAPI Backend (Python)             │
│   Auth | Resume Parser | Matcher | AI Chat   │
└──────┬────────────────────────┬──────────────┘
       │                        │
┌──────▼──────────┐    ┌────────▼────────────┐
│  PostgreSQL DB  │    │   AI/ML Services    │
│ Users/Jobs/     │    │ spaCy, OpenAI,      │
│ Resumes         │    │ ChromaDB            │
└─────────────────┘    └─────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│      Data Pipeline (Airflow + Spark)        │
│  Job Scraping → S3 → Transform → Warehouse  │
└─────────────────────────────────────────────┘
```

---

## 📊 Progress Tracker

| Phase | Status | Days | Completion |
|-------|--------|------|------------|
| 🏗️ Foundation | 🟡 Starting | 1–15 | 0% |
| ⚙️ Data Engineering | ⬜ Not Started | 16–35 | 0% |
| 🤖 AI/ML | ⬜ Not Started | 36–55 | 0% |
| 🧠 GenAI | ⬜ Not Started | 56–70 | 0% |
| 🖥️ Backend + Frontend | ⬜ Not Started | 71–80 | 0% |
| 🚀 Deployment | ⬜ Not Started | 81–90 | 0% |

---

## ⏰ Daily Habit (2–3 Hours/Day)

```
30 min  → Plan what you'll build today
90 min  → Code (focused, no distractions)
30 min  → Debug / fix issues
20 min  → Git commit + write what you learned
10 min  → Review tomorrow's task
```

---

## 🏆 End Goal — What You'll Have by Day 90

- ✅ A **live deployed web app** accessible via URL
- ✅ A **GitHub repo** with clean commits showing your journey
- ✅ **AI features** — resume parsing, job matching, career chat
- ✅ **Data pipeline** processing real job market data
- ✅ **ML models** trained and tracked with MLflow
- ✅ **CI/CD pipeline** that auto-deploys on every push
- ✅ A project that **stands out in any interview**

---

*🗓️ Started: August 20, 2026 | 🎯 Target: November 18, 2026*  
*Built with 💪 by Vishal — One commit at a time.*
