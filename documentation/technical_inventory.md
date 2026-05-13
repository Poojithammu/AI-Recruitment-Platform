# Technical Project Inventory: AI Agentic Hiring Intelligence System

This document provides a comprehensive technical audit and structured inventory of the **AI Agentic Hiring Intelligence & Recruitment Automation System**.

---

## 1. PROJECT OVERVIEW
- **Project Name**: AI Agentic Hiring Intelligence & Recruitment Automation System
- **Short Description**: A production-grade recruitment ecosystem using autonomous agents to crawl job data, AI to extract structured requirements, and predictive analytics to score leads and identify hiring trends.
- **Actual Implemented Features**:
    - Autonomous multi-source job scraping (LinkedIn, Indeed, etc.)
    - AI-powered Job Description (JD) requirement extraction (Gemini/Groq)
    - Real-time hiring trend analysis and skill demand tracking
    - Lead scoring system for company prioritization
    - Premium glassmorphism dashboards for multiple user roles
    - Role-based access control (RBAC)
    - Secure OTP-based email verification
    - Exportable reports (CSV/Excel/PDF)
- **Tech Stack**:
    - **Frontend**: React 18, Vite, Redux Toolkit, React Query, Tailwind CSS 4.0, Framer Motion, Recharts.
    - **Backend**: Node.js, Express.js, MongoDB (Mongoose), Redis (BullMQ), Playwright, Cheerio.
    - **AI**: Google Gemini AI, Groq API.
    - **Infrastructure**: JWT Auth, Brevo (Email/OTP), Multer (File Handling).
- **Architecture Style**: Modular Monolith with Service-Oriented Logic and Background Workers (BullMQ/Redis).

---

## 2. FOLDER STRUCTURE

### Backend Architecture (`/backend`)
```text
backend/
├── logs/                 # System & Scraper logs
├── src/
│   ├── app.js            # Express app configuration
│   ├── server.js         # Entry point & DB connection
│   ├── collectors/       # Scraping Agents (Base, LinkedIn, Indeed, etc.)
│   ├── config/           # DB, Redis, and Env configurations
│   ├── controllers/      # Route handlers (Auth, Hiring, AI, etc.)
│   ├── jobs/             # Scheduled tasks (Cron)
│   ├── middleware/       # Auth, Role, and Error middlewares
│   ├── models/           # 16+ Mongoose Schemas
│   ├── parsers/          # Data normalization and Skill extractors
│   ├── routes/           # REST API Route definitions
│   ├── services/         # Core Logic (AI, Analytics, Scoring, Outreach)
│   ├── utils/            # Shared utilities (Logger, Email, Seeders)
│   └── workers/          # Background processing (ScrapingWorker)
└── seedDashboard.js      # Initial system seeder
```

### Frontend Architecture (`/frontend`)
```text
frontend/
├── src/
│   ├── api/              # Axios instance & API interceptors
│   ├── app/              # Redux Store configuration
│   ├── assets/           # Global styles and static assets
│   ├── components/       # UI (stat cards, charts, protected routes)
│   ├── features/         # Auth & Data slices
│   ├── hooks/            # Custom hooks (useAuth)
│   ├── layouts/          # Dashboard & App layouts
│   ├── pages/            # Role-based workspace pages
│   ├── services/         # API wrappers & Mock data
│   ├── utils/            # Export and Redirect utilities
│   ├── App.jsx           # Routing & Providers
│   └── main.jsx          # Entry point
```

---

## 3. DATABASE MODELS (Mongoose)

| Model Name | Purpose | Key Fields | Relationships |
|------------|---------|------------|---------------|
| **User** | System access | fullName, email, password, role, isVerified | Profile (1:1) |
| **Company** | Organization intelligence | companyName, website, hiringScore, trend | Jobs, LeadScores (1:N) |
| **HiringJob** | Raw/Detailed scraped job | source, jobRole, rawDescription, hash | Company (N:1) |
| **Job** | Normalized job for analytics | role, skills, location, salary, postedDate | Company (N:1) |
| **Recruiter** | Discovered contact person | name, email, linkedin, source | Company (N:1) |
| **RequirementExtraction** | AI parsed JD data | extractedData (role, skills, exp, salary) | User, Job (N:1) |
| **LeadScore** | Company priority score | score, breakdown (AI insights) | Company (N:1) |
| **Trend** | Market movement data | trendType, score, analysis | Company (Optional) |
| **AnalystProfile** | Professional bio/specialization | userId, industriesCovered, experience | User (1:1) |
| **CandidateProfile** | Professional bio/skills | userId, skills, resumeUrl, salary | User (1:1) |
| **RecruiterProfile** | Professional bio/company | userId, companyName, designation | User (1:1) |
| **Notification** | Real-time system alerts | userId, title, message, read | User (N:1) |
| **OutreachLog** | Track communication | channel, status, sentAt | Recruiter, Company |
| **Resume** | Candidate documents | userId, fileUrl, parsedSkills | User (1:1) |
| **SavedSearch** | Personal filters | userId, filters | User (N:1) |

---

## 4. DATABASE RELATIONSHIP MAP (ER-Style)

- **One-to-One (1:1)**:
    - `User` ↔ `RecruiterProfile` / `CandidateProfile` / `AnalystProfile`
    - `User` ↔ `Resume`
- **One-to-Many (1:N)**:
    - `Company` → `HiringJob` / `Job`
    - `Company` → `Recruiter` (contact persons)
    - `Company` → `LeadScore` / `Trend`
    - `User` → `RequirementExtraction` / `SavedSearch` / `Notification`
- **Many-to-Many (N:M)**:
    - `HiringJob` ↔ `Skills` (Stored as array of strings)

---

## 5. AUTHENTICATION SYSTEM

- **Registration Flow**: 2-Step (Form Submit → OTP Email via Brevo → Account Activation).
- **Login Flow**: Credentials check → JWT Generation → HttpOnly Cookie + Access Token response.
- **JWT Implementation**: `jsonwebtoken` library. Access Tokens (short-lived) + Refresh Tokens (stored in DB/Session).
- **Password Hashing**: `bcryptjs` with salt rounds = 12.
- **Security Middlewares**:
    - `protect`: Verifies JWT validity and user existence.
    - `authorize`: Enforces role-based permissions (`admin`, `recruiter`, etc.).
- **Logout Flow**: Clear cookies and invalidate session tokens.

---

## 6. USER ROLES & ACCESS CONTROL

| Role | Permissions | Restricted Actions |
|------|-------------|-------------------|
| **Admin** | Full system control, scraper management, user management. | None. |
| **Recruiter** | Job posting, AI extraction, lead scoring, candidate viewing. | Admin panel access. |
| **Analyst** | Market trend analysis, report generation, system logs view. | User management. |
| **User (Candidate)**| Job search, resume analysis, profile setup. | Recruitment & System tools. |

---

## 7. API INVENTORY (Selected)

### Auth & User Module
- `POST /api/auth/register` - Create account
- `POST /api/auth/verify-email` - OTP verification
- `POST /api/auth/login` - Authenticate
- `GET /api/auth/me` - Fetch profile

### Recruitment Intelligence
- `POST /api/hiring/collect` - Trigger autonomous scrapers (Admin/Recruiter)
- `GET /api/hiring/jobs` - Search/Filter collected jobs
- `POST /api/hiring/jobs` - Manual job entry
- `GET /api/recruiter/dashboard/stats` - Fetch aggregate analytics

### AI & Analysis
- `POST /api/requirement/extract` - Single JD extraction
- `POST /api/requirement/extract-batch` - Bulk JD processing
- `POST /api/lead-score/calculate` - Trigger AI company scoring
- `POST /api/user-dashboard/scrutinize-resume` - AI Resume analysis

---

## 8. AI MODULES (Intelligence Hub)

- **Requirement Extraction**:
    - **Provider**: Google Gemini / Groq.
    - **Function**: Parses unstructured text into JSON (Role, Skills, Exp, Salary).
    - **Strategy**: JSON-Mode prompting with validation schemas.
- **Hiring Trend Analysis**:
    - **Provider**: Custom Node.js logic + AI summarization.
    - **Goal**: Identify industry-wide technology demand shifts.
- **Lead Scoring**:
    - **Algorithm**: Weighted combination of hiring frequency, tech stack freshness, and company growth signals.
- **Resume Scrutinizer**:
    - **Input**: PDF/Text.
    - **Output**: Skill match score, gap analysis, and role recommendations.

---

## 9. SCRAPING / DATA COLLECTION

- **Supported Sources**: LinkedIn, Indeed, Instahyre, Startup Platforms, Career Pages.
- **Tools**: Playwright (Headless Browser), Cheerio (HTML Parsing), Axios.
- **Workflow**:
    1. **Orchestration**: `CrawlerOrchestrator` initiates batch collection.
    2. **Collection**: Individual Collectors extract raw HTML/JSON.
    3. **Cleaning**: `NormalizationService` formats dates, locations, and salaries.
    4. **Enrichment**: `SkillExtractor` identifies tech keywords.
    5. **Deduplication**: SHA-256 Hashing of job properties to prevent duplicates.
    6. **Storage**: Dual storage in `HiringJob` (Raw) and `Job` (Analytics).

---

## 10. FRONTEND PAGE INVENTORY

- **Public**: Login, Register, Forgot Password, Reset Password.
- **Recruiter**: Dashboard, Job Management, Company Intelligence, Lead Scoring, Requirement AI, Outreach Hub, Reports.
- **Candidate**: User Dashboard, Job Explorer, Company Explorer, Resume Scrutinizer.
- **Admin**: Admin Dashboard, Scraper Monitor, User Management, Job Management.
- **Shared**: Settings, Notifications, Profile Setup.

---

## 11. DASHBOARD FEATURES (Widgets)

- **Stats Widget**: Total Jobs, Active Scrapers, AI Extractions, Lead Scores.
- **Charts**: Hiring Trends (Area Chart), Tech Demand (Bar/Pie Chart).
- **Activity**: Recent Job Alerts, Lead score updates.
- **Quick Actions**: "Start Scrape", "Export Report", "New Outreach".

---

## 12. ENVIRONMENT VARIABLES (Inventory)

- `MONGO_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `BREVO_API_KEY` (Email/OTP)
- `GEMINI_API_KEY` (AI Engine)
- `GROQ_API_KEY` (Fast AI Inference)
- `PORT` (Server Port)
- `NODE_ENV` (development/production)

---

## 13. SECURITY IMPLEMENTATION

- **Encryption**: Bcrypt for passwords.
- **Headers**: `helmet` for secure HTTP headers.
- **Rate Limiting**: `express-rate-limit` to prevent brute force.
- **CORS**: Strict origin whitelist.
- **Validation**: `express-validator` for API input sanitization.
- **RBAC**: Multi-layered middleware checks (`protect` + `authorize`).

---

## 14. SYSTEM WORKFLOW (End-to-End)

1. **Discovery**: Scheduled Cron or Admin triggers `CrawlerOrchestrator`.
2. **Collection**: Agents scrape target sources using Playwright/Cheerio.
3. **Refining**: Data is cleaned, normalized, and skills are extracted via regex/parsers.
4. **Intelligence**: AI Extractors structure the JD; Lead Scoring evaluates the company.
5. **Persistence**: Structured data is saved to MongoDB; unique hashes prevent duplicates.
6. **Visualization**: Frontend fetches data via protected APIs; Recharts renders market trends.
7. **Action**: Recruiter uses insights to initiate Outreach via email/LinkedIn.
