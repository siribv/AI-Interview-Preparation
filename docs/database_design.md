# AI-Powered Smart Interview Preparation Platform
## Database Design & Entity-Relationship Schema

### 1. Database Overview
- **Database Name:** `ai_interview_db`
- **Engine:** InnoDB
- **Charset:** `utf8mb4`

---

### 2. Entity Descriptions & Field Specifications

#### 1. `users` Table
Stores student credentials and profile data.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `full_name` | VARCHAR(120) | NOT NULL | Student's full name |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE, INDEX | College / personal email |
| `password_hash` | VARCHAR(255) | NOT NULL | Salted Bcrypt password hash |
| `college` | VARCHAR(180) | NULL | Institution / University |
| `degree` | VARCHAR(100) | DEFAULT 'B.Tech CSE-AI' | Academic degree & branch |
| `target_role` | VARCHAR(100) | DEFAULT 'Full Stack Developer' | Desired career specialization |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP | Last profile update timestamp |

---

#### 2. `job_roles` Table
Stores supported technical careers with descriptions and skills.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Role identifier |
| `role_name` | VARCHAR(100) | NOT NULL, UNIQUE | Role title (e.g. Java Developer) |
| `slug` | VARCHAR(100) | NOT NULL, UNIQUE | URL-friendly slug (e.g. java-developer) |
| `description` | TEXT | NULL | Role overview and scope |
| `icon` | VARCHAR(50) | DEFAULT 'Code' | Lucide icon name |
| `primary_skills` | TEXT | NULL | Comma-separated list of core technologies |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status flag |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

---

#### 3. `questions` Table
Stores AI-generated and curated interview questions.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Question identifier |
| `role_id` | INT | FK -> `job_roles(id)` ON DELETE CASCADE | Associated job role |
| `question_text` | TEXT | NOT NULL | Full question prompt |
| `question_type` | ENUM | 'technical', 'coding', 'hr' | Question classification |
| `difficulty` | ENUM | 'beginner', 'intermediate', 'advanced' | Complexity level |
| `topic` | VARCHAR(100) | NOT NULL | Subject topic (e.g. Multithreading, OOP) |
| `expected_concepts` | TEXT | NULL | Key concepts expected in good answers |
| `sample_answer` | TEXT | NULL | Benchmark / model answer |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Generation timestamp |

---

#### 4. `interview_sessions` Table
Tracks student practice sessions and full simulated mock rounds.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Session identifier |
| `user_id` | INT | FK -> `users(id)` ON DELETE CASCADE | Participating student |
| `role_id` | INT | FK -> `job_roles(id)` ON DELETE RESTRICT | Target job role |
| `session_type` | ENUM | 'practice', 'mock' | Session format |
| `difficulty` | ENUM | 'beginner', 'intermediate', 'advanced' | Selected difficulty |
| `total_questions` | INT | DEFAULT 5 | Planned number of questions |
| `completed_questions` | INT | DEFAULT 0 | Successfully submitted answers |
| `status` | ENUM | 'in_progress', 'completed', 'abandoned' | Current session state |
| `overall_score` | DECIMAL(4, 2) | NULL | Aggregated final score (0.00 to 10.00) |
| `feedback_summary` | TEXT | NULL | Comprehensive interview evaluation |
| `started_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Start timestamp |
| `completed_at` | DATETIME | NULL | Completion timestamp |

---

#### 5. `user_answers` Table
Records answers submitted by students.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Answer identifier |
| `session_id` | INT | FK -> `interview_sessions(id)` ON DELETE CASCADE | Parent interview session |
| `question_id` | INT | FK -> `questions(id)` ON DELETE CASCADE | Target question |
| `user_answer_text` | TEXT | NOT NULL | Student's written answer |
| `time_spent_seconds` | INT | DEFAULT 0 | Seconds spent drafting the answer |
| `submitted_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |

---

#### 6. `evaluation_results` Table
Stores granular AI analysis of each submitted answer.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Evaluation identifier |
| `answer_id` | INT | FK -> `user_answers(id)` ON DELETE CASCADE, UNIQUE | Evaluated answer |
| `score` | DECIMAL(4, 2) | NOT NULL | Individual question score (0.00 - 10.00) |
| `conceptual_accuracy_score` | DECIMAL(4, 2) | NULL | Accuracy score |
| `clarity_score` | DECIMAL(4, 2) | NULL | Articulation / communication score |
| `missing_concepts` | TEXT | NULL | Concepts omitted in answer |
| `strengths` | TEXT | NULL | Highlights in user's response |
| `weaknesses` | TEXT | NULL | Areas needing revision |
| `feedback` | TEXT | NOT NULL | Actionable diagnostic feedback |
| `improved_answer` | TEXT | NOT NULL | Recommended model answer |
| `evaluated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Evaluation timestamp |

---

#### 7. `performance_history` Table
Powers analytics dashboard, trends, and weak topic recommendations.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Record identifier |
| `user_id` | INT | FK -> `users(id)` ON DELETE CASCADE | Student identifier |
| `session_id` | INT | FK -> `interview_sessions(id)` ON DELETE CASCADE | Session identifier |
| `role_id` | INT | FK -> `job_roles(id)` ON DELETE CASCADE | Role identifier |
| `score` | DECIMAL(4, 2) | NOT NULL | Final score |
| `strong_topics` | TEXT | NULL | Comma-separated topics mastered |
| `weak_topics` | TEXT | NULL | Comma-separated topics needing work |
| `recommended_topics` | TEXT | NULL | Suggested syllabus review items |
| `recorded_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Log timestamp |
