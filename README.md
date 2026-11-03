# AI-Powered Smart Interview Preparation Platform

An industry-standard, AI-driven web application designed to help engineering and computer science students prepare for technical and HR interviews with real-time semantic evaluation, role-tailored mock rounds, and personalized analytics.

---

## 🛠 Tech Stack
- **Frontend:** React.js 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6
- **Backend:** Python 3.x, Flask, Flask-SQLAlchemy, Flask-Bcrypt, PyJWT, PyMySQL
- **Database:** MySQL 8.x / 26.x
- **AI / NLP:** Google Generative AI (Gemini API), Scikit-Learn NLP Semantic Similarity

---

## 📁 Repository Structure
```
ai-interview-platform/
├── backend/
│   ├── app/
│   │   ├── models/           # SQLAlchemy Data Models (User, Roles, Questions, Sessions, Evals)
│   │   ├── routes/           # REST API Blueprints (Auth, Roles, Questions, Mock, Analytics)
│   │   ├── services/         # Generative AI Prompting & Semantic Evaluation
│   │   ├── utils/            # JWT Middleware & Authentication Guards
│   │   ├── config.py         # Config Loader (.env, MySQL connection strings)
│   │   ├── extensions.py     # SQLAlchemy & Bcrypt Instances
│   │   └── __init__.py       # Flask Application Factory
│   ├── database/
│   │   └── schema.sql        # Full MySQL DDL & Initial Job Roles Seeds
│   ├── .env.example          # Backend Environment Template
│   ├── requirements.txt      # Python Dependencies
│   └── run.py                # Server Entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ProtectedRoute, LoadingSpinner, AlertMessage
│   │   ├── context/          # AuthContext (JWT Authentication state)
│   │   ├── pages/            # 10 Pages (Home, Login, Register, Dashboard, Roles, Practice, Mock, Analytics, Profile)
│   │   ├── services/         # Axios API Client with JWT Interceptors
│   │   ├── App.jsx           # App Router
│   │   ├── main.jsx          # Vite React Root
│   │   └── index.css         # Tailwind Directives
│   ├── package.json          # Node Dependencies & Scripts
│   ├── tailwind.config.js    # Tailwind Design System Configuration
│   └── vite.config.js        # Vite Build Configuration
│
└── docs/
    ├── architecture.md       # High-Level Architecture & Sequences
    └── database_design.md    # Complete DB Schema & Data Dictionary
```

---

## 🚀 Getting Started Guide
Follow the step-by-step instructions in the terminal to set up the MySQL database, configure `.env`, start the Flask backend, and run the Vite frontend.
