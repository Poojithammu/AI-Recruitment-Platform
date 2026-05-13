# 🤖 AI Agentic Hiring Intelligence & Recruitment Automation System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20%26%20Groq-orange.svg)](https://deepmind.google/technologies/gemini/)
[![Enterprise Ready](https://img.shields.io/badge/Status-Enterprise--Ready-brightgreen.svg)](#)

A high-performance, enterprise-grade AI-powered recruitment ecosystem. This platform leverages **autonomous agents** for multi-source job crawling, **AI-driven requirement extraction**, **predictive hiring trend analysis**, and **intelligent lead scoring** to revolutionize the recruitment lifecycle.

---

## 📽️ Demo & Previews

> [!TIP]
> Check out the visual walkthroughs of the system in action.

- 📺 **Demo Video**: [View Walkthrough](./demo_video/)
- 📸 **Screenshots**: [View UI/UX Gallery](./screenshots/)
- 📄 **Technical Docs**: [View Documentation](./documentation/)

---

## 🌟 Key Features

### 1. Autonomous Agentic Crawling
- **Multi-Source Collection**: Real-time scrapers for LinkedIn, Indeed, Instahyre, and Company Career pages.
- **Resilience Engine**: Built-in retry logic and proxy support to handle anti-scraping measures.
- **Deduplication Service**: Intelligent hashing to prevent redundant job entries across sources.

### 2. AI-Powered Requirement Extraction
- **Gemini Integration**: Automatically parses unstructured Job Descriptions into 15+ structured data points (Skills, Salary, Experience, Tech Stack, etc.).
- **Normalization**: Standardizes job titles and skills for superior candidate matching.

### 3. Predictive Analytics & Trend Hub
- **Hiring Trends**: Time-series analysis of job postings across industries.
- **Tech Demand**: Real-time tracking of rising and falling technologies.
- **Skill Gap Analysis**: Helping recruiters identify talent shortages before they become critical.

### 4. Role-Based Workspaces
- **Recruiter Dashboard**: Glassmorphism UI with Hiring Analytics, AI Outreach, and Lead Scoring.
- **Candidate Portal**: Job Explorer, AI Resume Scrutinizer, and Company Intelligence Hub.
- **Admin Panel**: System Monitoring, Crawler Health, and Global Analytics.

---

## 🛠️ Technologies Used

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 (Vite), Redux Toolkit, Tailwind CSS 4.0, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js, JWT, HTTP-only Cookies |
| **Database** | MongoDB (Mongoose ODM), Redis (Caching & Queuing) |
| **AI Engine** | Google Gemini AI, Groq (Llama 3) |
| **Automation** | Playwright, Cheerio, BullMQ (Background Workers) |
| **Communication** | Brevo (SMTP/OTP), Nodemailer |

---

## 📂 Folder Structure

```text
AI Agentic Hiring Intelligence System/
├── frontend/             # React + Vite + Redux (Premium UI)
│   ├── src/
│   │   ├── api/          # Axios interceptors & API services
│   │   ├── components/   # UI Library (Glassmorphism design)
│   │   ├── features/     # State Management (Redux Slices)
│   │   ├── pages/        # Role-based Dashboards (Recruiter, Candidate, Admin)
│   │   └── services/     # Business logic & Hooks
├── backend/              # Node.js + Express + MongoDB (Robust API)
│   ├── src/
│   │   ├── collectors/   # Autonomous Scraping Agents
│   │   ├── controllers/  # API Controllers & Logic
│   │   ├── jobs/         # Scheduled Tasks (Cron Jobs)
│   │   ├── models/       # Mongoose Schemas (16+ models)
│   │   ├── services/     # AI Engines (Gemini/Groq) & Scoring Logic
│   │   └── workers/      # Background processing (BullMQ)
├── documentation/        # System Architecture & Technical Reports
├── database/             # MongoDB exports & Seed scripts
├── screenshots/          # High-resolution UI Previews
└── demo_video/           # Full System Walkthrough
```

---

## ⚙️ Installation Steps

### Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (v6.x or higher)
- **Redis** (v7.x or higher)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-hiring-system.git
cd ai-hiring-system

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hiring_intelligence
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secure_secret_here
BREVO_API_KEY=your_brevo_api_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

---

## 🚀 Execution Process

### Step 1: Initialize the Database
Before running the app, seed the database with administrative accounts and sample hiring data.
```bash
cd backend
npm run seed
```

### Step 2: Start the Backend Server
```bash
npm run dev
```
The API will be available at `http://localhost:5000`.

### Step 3: Start the Frontend Application
In a new terminal:
```bash
cd frontend
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

---

## 🛡️ Security & Performance
- **Rate Limiting**: Protected against brute-force attacks.
- **Secure Auth**: JWT with HTTP-only cookies to prevent XSS.
- **AI Optimization**: Response caching to minimize AI token usage.
- **Background Tasks**: Redis-backed BullMQ for non-blocking scraping and processing.

---

© 2026 AI Agentic Hiring Intelligence. Built for Excellence.
