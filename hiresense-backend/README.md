# HireSense AI - Flask REST API Backend

A production-grade, modular Flask REST API backend designed for the HireSense AI Career Command Center.

## 1. Features
- **JWT Authentication**: Secure stateless token issuance, refresh, and profile management.
- **Resume Parsing Pipeline**: Multi-format extraction (PDF via PyMuPDF / fitz, DOCX via python-docx) with secure uploads.
- **Pluggable AI Architecture**: Abstract `AIService` supporting zero-configuration development via `MockAIService` and production LLMs via `RealAIService`.
- **Claimed vs. Demonstrated Skill Verification**: Continuous alignment of resume claims against assessment and mock interview performance.
- **Diagnostic Readiness Engine**: Real-time 5-pillar scoring and company-specific benchmarks (Tier-1 Tech, AI Startups, Enterprise).
- **Consolidated Dashboard API**: Single-trip payload for high performance and low frontend complexity.
- **Mock Interview & Project Viva**: Real-time evaluation of behavioral (STAR), technical DSA, system design, and resume project defense.
- **Interactive Roadmap**: 4-week placement sprint planner with task progression tracking.
- **GitHub Intelligence**: Code hygiene, test coverage, and architecture decision record (ADR) audits.

---

## 2. Directory Structure

```text
hiresense-backend/
├── app/
│   ├── __init__.py          # Flask app factory, error handlers, and extension registration
│   ├── config.py            # Environment configurations (Dev, Prod, Test)
│   ├── extensions.py        # SQLAlchemy, Migrate, JWTManager, CORS
│   │
│   ├── models/              # Relational models linked to user_id
│   │   ├── user.py          # User authentication & core profile fields
│   │   ├── profile.py       # Bio, socials, and preferences
│   │   ├── resume.py        # Resume, Education, Experience
│   │   ├── skill.py         # Skill taxonomy & UserSkill (claimed vs demonstrated)
│   │   ├── project.py       # Project definitions & bullet optimizations
│   │   ├── assessment.py    # Assessment sessions & multi-metric scores
│   │   ├── question.py      # Category-tagged assessment questions
│   │   ├── answer.py        # Answer evaluation, feedback & mistake classification
│   │   ├── interview.py     # Mock interview sessions & speech rubrics
│   │   ├── viva.py          # Project viva interrogation & architecture scoring
│   │   ├── readiness.py     # 5-pillar readiness score & company benchmarks
│   │   ├── roadmap.py       # 4-week placement sprint & milestone tasks
│   │   └── progress.py      # Historical time-series progress telemetry
│   │
│   ├── routes/              # Flask Blueprints for all REST endpoints
│   │   ├── auth.py          # /api/auth (register, login, refresh, me, logout)
│   │   ├── users.py         # /api/profile (GET, PUT)
│   │   ├── resume.py        # /api/resume (upload, current, analyze, analysis, DELETE)
│   │   ├── dashboard.py     # /api/dashboard (consolidated dashboard payload)
│   │   ├── assessment.py    # /api/assessment (generate, current, submit, result)
│   │   ├── interview.py     # /api/interview (start, answer, complete, history)
│   │   ├── viva.py          # /api/viva (start, answer, complete, history)
│   │   ├── readiness.py     # /api/readiness (score, breakdown, skill-verification)
│   │   ├── roadmap.py       # /api/roadmap (get, progress toggle)
│   │   ├── reports.py       # /api/reports (placement dossier)
│   │   ├── github.py        # /api/github (profile, repositories, analyze)
│   │   └── progress.py      # /api/progress (telemetry charts)
│   │
│   ├── services/            # Pure business logic, parsers, and AI interfaces
│   │   ├── ai_service.py    # Abstract AIService, MockAIService, RealAIService
│   │   ├── auth_service.py  # User lifecycle & JWT management
│   │   ├── resume_parser.py # PDF / DOCX extraction
│   │   ├── resume_analyzer.py # Scoring, entity extraction & bullet rewrites
│   │   ├── skill_extractor.py # Taxonomy matching & gap analysis
│   │   ├── assessment_service.py
│   │   ├── interview_service.py
│   │   ├── viva_service.py
│   │   ├── readiness_service.py
│   │   ├── roadmap_service.py
│   │   └── github_service.py
│   │
│   ├── utils/               # Pydantic validators, decorators, and file helpers
│   └── api/                 # Standardized JSON response helpers
│
├── uploads/resumes/         # Secure local resume storage
├── tests/                   # Pytest test suite
├── .env.example             # Environment variable template
├── requirements.txt         # Dependencies
└── run.py                   # Server startup script
```

---

## 3. Quick Start

### 1. Install Dependencies
```bash
cd hiresense-backend
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration uses SQLite (`sqlite:///hiresense.db`) for immediate zero-config testing. To switch to PostgreSQL:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/hiresense
```

### 3. Run Server
```bash
python run.py
```
Backend will start at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

### 4. Run Tests
```bash
python -m pytest tests/ -v
```

---

## 4. API Endpoints Overview

| Domain | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Create candidate account |
| | `POST` | `/api/auth/login` | Obtain JWT access & refresh tokens |
| | `GET` | `/api/auth/me` | Fetch authenticated user info |
| | `POST` | `/api/auth/refresh` | Renew expired access token |
| | `POST` | `/api/auth/logout` | Revoke session |
| **Profile** | `GET` | `/api/profile` | Retrieve user profile & verified skills |
| | `PUT` | `/api/profile` | Update profile bio, college, links |
| **Resume** | `POST` | `/api/resume/upload` | Upload PDF/DOCX (max 10MB) & auto-analyze |
| | `GET` | `/api/resume/current` | Active resume metadata |
| | `GET` | `/api/resume/analysis` | Full ATS breakdown & bullet rewrites |
| | `POST` | `/api/resume/analyze` | Trigger re-analysis |
| | `DELETE` | `/api/resume` | Remove active resume |
| **Dashboard** | `GET` | `/api/dashboard` | Consolidated dashboard payload |
| **Assessment** | `POST` | `/api/assessment/generate` | Generate 10 resume-based questions |
| | `GET` | `/api/assessment/current` | Current in-progress assessment |
| | `POST` | `/api/assessment/<id>/answer` | Submit answer for instant AI rubric score |
| | `POST` | `/api/assessment/<id>/submit` | Finalize assessment |
| | `GET` | `/api/assessment/<id>/result` | Retrieve evaluated results |
| **Readiness** | `GET` | `/api/readiness` | 5-pillar scores & company benchmarks |
| | `GET` | `/api/readiness/skill-verification` | Claimed vs. Demonstrated skills matrix |
| | `GET` | `/api/readiness/history` | Historical progression curve |
| **Interview** | `POST` | `/api/interview/start` | Start Behavioral, DSA, or System round |
| | `POST` | `/api/interview/<id>/answer` | Evaluate response & speech pace |
| | `GET` | `/api/interview/history` | Historical session logs |
| **Project Viva** | `POST` | `/api/viva/start` | Interrogate resume project architecture |
| | `POST` | `/api/viva/<id>/answer` | Evaluate technical ownership & bottlenecks |
| **Roadmap** | `GET` | `/api/roadmap` | 4-week placement sprint roadmap |
| | `PUT` | `/api/roadmap/<id>/progress` | Toggle milestone task completion |
| **Reports** | `GET` | `/api/reports` | Placement readiness dossier for export |
| **GitHub** | `GET` | `/api/github/profile` | Synchronize `@username` repository health |
| | `POST` | `/api/github/analyze` | Audit repo code quality & ADRs |
