# AI-Powered Smart Interview Preparation Platform
## System Architecture & Technical Specifications

### 1. High-Level Architecture Overview
The platform is designed around a decoupled, 3-tier client-server architecture adhering to industry-standard REST API principles.

```
       [ React.js + Tailwind CSS Client (Port 5173) ]
                             │
                      HTTPS / JSON REST
                             │
                             ▼
             [ Flask Application Server (Port 5000) ]
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
[ Auth & Routes ]     [ AI Services ]      [ NLP Evaluator ]
  - JWT Tokens          - Gemini API         - Semantic Similarity
  - Blueprints          - Role Prompts       - Concept Extractor
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             ▼
                [ MySQL Database (Port 3306) ]
               Tables: users, job_roles, questions,
               interview_sessions, answers, evaluations
```

---

### 2. Tier Breakdown

#### Tier 1: Frontend Client (Presentation Layer)
- **Framework:** React 18 with Vite for ultra-fast HMR and build performance.
- **Styling:** Tailwind CSS with a cohesive, accessible palette.
- **Routing:** React Router v6 with `ProtectedRoute` guards verifying JWT tokens.
- **State Management:** React Context API (`AuthContext`) for lightweight, predictable global state.
- **Network Layer:** Axios with centralized interceptors automatically attaching `Bearer <token>` headers and handling 401 session expiries.

#### Tier 2: Backend Application (Application & Intelligence Layer)
- **Framework:** Python Flask using the Application Factory pattern (`create_app()`).
- **ORM:** SQLAlchemy with PyMySQL driver for thread-safe database pooling and migrations.
- **Security:**
  - Password hashing using `Flask-Bcrypt` (salted Blowfish cipher).
  - Stateless authentication via `PyJWT` tokens (24-hour expiration).
  - Zero hardcoded secrets; loaded securely via `python-dotenv`.
- **AI Core:**
  - `ai_service.py`: Generative AI orchestration (Gemini API) with structured JSON prompting.
  - `nlp_evaluator.py`: Hybrid semantic matching (calculates concept coverage, clarity, and scoring).

#### Tier 3: Database (Persistence Layer)
- **Engine:** MySQL 8.x / 26.x with InnoDB storage engine.
- **Character Set:** `utf8mb4` with `utf8mb4_unicode_ci` for full Unicode and emoji compatibility.
- **Integrity:** Strict Foreign Key constraints (`ON DELETE CASCADE` / `ON DELETE RESTRICT`) ensuring zero orphaned records.
- **Indexes:** Strategic B-tree indexes on emails, foreign keys, role types, and session status for sub-millisecond lookups.

---

### 3. Core Data Flow & Request Lifecycles

#### Flow A: Authentication Lifecycle
1. Student enters registration/login details on React client.
2. Frontend sends JSON payload to `POST /api/auth/register` or `POST /api/auth/login`.
3. Flask verifies email regex, checks duplicate accounts, and verifies password using Bcrypt.
4. On success, backend returns a signed JWT containing user claims (`sub: user_id`, `iat`, `exp`).
5. Client stores token in `localStorage` and updates `AuthContext`.

#### Flow B: Mock Interview & AI Evaluation Flow
1. Student selects a job role (e.g. Python Developer) and difficulty (Intermediate).
2. Backend generates a 5-question mock interview sequence.
3. User submits answer for each question.
4. AI service analyzes answer against `expected_concepts` for semantic similarity, coverage, and clarity.
5. System records score, strengths, missing concepts, and improved answer in `evaluation_results` table.
6. Aggregated analytics update student's `performance_history`.
