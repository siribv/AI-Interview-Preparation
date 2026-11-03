-- =====================================================================
-- AI-Powered Smart Interview Preparation Platform
-- Database Schema: MySQL 8.x / 26.x compatible
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `ai_interview_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `ai_interview_db`;

-- Drop existing tables in reverse dependency order (if resetting)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `performance_history`;
DROP TABLE IF EXISTS `evaluation_results`;
DROP TABLE IF EXISTS `user_answers`;
DROP TABLE IF EXISTS `interview_sessions`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `job_roles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
    `id` INT AUTO-INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `college` VARCHAR(180) DEFAULT NULL,
    `degree` VARCHAR(100) DEFAULT 'B.Tech CSE-AI',
    `target_role` VARCHAR(100) DEFAULT 'Full Stack Developer',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Job Roles Table
CREATE TABLE `job_roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `icon` VARCHAR(50) DEFAULT 'Code',
    `primary_skills` TEXT, -- JSON or comma separated skills
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Questions Pool (Cached / Generated / Default Questions)
CREATE TABLE `questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_id` INT NOT NULL,
    `question_text` TEXT NOT NULL,
    `question_type` ENUM('technical', 'coding', 'hr') NOT NULL DEFAULT 'technical',
    `difficulty` ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
    `topic` VARCHAR(100) NOT NULL,
    `expected_concepts` TEXT, -- Comma-separated or bullet points
    `sample_answer` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_questions_role` FOREIGN KEY (`role_id`) 
        REFERENCES `job_roles`(`id`) ON DELETE CASCADE,
    INDEX `idx_questions_role_diff` (`role_id`, `difficulty`),
    INDEX `idx_questions_topic` (`topic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Interview Sessions Table
CREATE TABLE `interview_sessions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL,
    `session_type` ENUM('practice', 'mock') DEFAULT 'mock',
    `difficulty` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    `total_questions` INT DEFAULT 5,
    `completed_questions` INT DEFAULT 0,
    `status` ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    `overall_score` DECIMAL(4, 2) DEFAULT NULL, -- Score out of 10.00
    `feedback_summary` TEXT DEFAULT NULL,
    `started_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `completed_at` DATETIME DEFAULT NULL,
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sessions_role` FOREIGN KEY (`role_id`) 
        REFERENCES `job_roles`(`id`) ON DELETE RESTRICT,
    INDEX `idx_sessions_user` (`user_id`),
    INDEX `idx_sessions_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Answers Table
CREATE TABLE `user_answers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `session_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `user_answer_text` TEXT NOT NULL,
    `time_spent_seconds` INT DEFAULT 0,
    `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_answers_session` FOREIGN KEY (`session_id`) 
        REFERENCES `interview_sessions`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_answers_question` FOREIGN KEY (`question_id`) 
        REFERENCES `questions`(`id`) ON DELETE CASCADE,
    INDEX `idx_answers_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Evaluation Results Table
CREATE TABLE `evaluation_results` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `answer_id` INT NOT NULL UNIQUE,
    `score` DECIMAL(4, 2) NOT NULL, -- Out of 10
    `conceptual_accuracy_score` DECIMAL(4, 2) DEFAULT NULL,
    `clarity_score` DECIMAL(4, 2) DEFAULT NULL,
    `missing_concepts` TEXT, -- Bullet points or JSON of missing concepts
    `strengths` TEXT,
    `weaknesses` TEXT,
    `feedback` TEXT NOT NULL,
    `improved_answer` TEXT NOT NULL,
    `evaluated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_eval_answer` FOREIGN KEY (`answer_id`) 
        REFERENCES `user_answers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Performance History / Analytics Table
CREATE TABLE `performance_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `session_id` INT NOT NULL,
    `role_id` INT NOT NULL,
    `score` DECIMAL(4, 2) NOT NULL,
    `strong_topics` TEXT,
    `weak_topics` TEXT,
    `recommended_topics` TEXT,
    `recorded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_perf_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_perf_session` FOREIGN KEY (`session_id`) 
        REFERENCES `interview_sessions`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_perf_role` FOREIGN KEY (`role_id`) 
        REFERENCES `job_roles`(`id`) ON DELETE CASCADE,
    INDEX `idx_perf_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Seed Data: Required 8 Job Roles
-- =====================================================================
INSERT INTO `job_roles` (`id`, `role_name`, `slug`, `description`, `icon`, `primary_skills`) VALUES
(1, 'Java Developer', 'java-developer', 'Core Java, OOP, Collections, Multithreading, Spring Boot, Microservices, Hibernate, and SQL.', 'Coffee', 'Java, OOPs, Spring Boot, Microservices, Hibernate, REST APIs, SQL'),
(2, 'Python Developer', 'python-developer', 'Python fundamentals, Data Structures, OOP, Django/Flask, RESTful APIs, and Database query design.', 'Terminal', 'Python, OOPs, Django, Flask, FastAPI, Data Structures, PostgreSQL'),
(3, 'Frontend Developer', 'frontend-developer', 'HTML5, CSS3, JavaScript (ES6+), React.js, Responsive Design, State Management, and Web Performance.', 'Layout', 'HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Redux, Web APIs'),
(4, 'Backend Developer', 'backend-developer', 'System design, REST & GraphQL APIs, Database normalization, Caching, Authentication, and Scalability.', 'Server', 'Node.js, Express, Python/Flask, PostgreSQL, Redis, Docker, System Design'),
(5, 'Full Stack Developer', 'full-stack-developer', 'End-to-end web architecture, Frontend UI, Backend APIs, Database integration, and Deployment pipelines.', 'Layers', 'React.js, Node.js, Python, REST APIs, MySQL/MongoDB, Git, CI/CD'),
(6, 'Data Analyst', 'data-analyst', 'SQL querying, Pandas, NumPy, Data Cleaning, Exploratory Data Analysis (EDA), Tableau/PowerBI, and Statistics.', 'BarChart3', 'SQL, Python, Pandas, NumPy, Data Visualization, Excel, Statistics'),
(7, 'Machine Learning Engineer', 'machine-learning-engineer', 'Supervised/Unsupervised ML algorithms, Scikit-Learn, Feature Engineering, Model Evaluation, and Deployment.', 'Cpu', 'Linear Algebra, Scikit-Learn, TensorFlow, PyTorch, Feature Engineering, MLOps'),
(8, 'AI Engineer', 'ai-engineer', 'Deep Learning, NLP, Large Language Models (LLMs), Prompt Engineering, Vector Databases, and Retrieval-Augmented Generation (RAG).', 'Sparkles', 'LLMs, PyTorch, LangChain, RAG, Embeddings, Prompt Engineering, Transformers')
ON DUPLICATE KEY UPDATE `role_name` = VALUES(`role_name`);
