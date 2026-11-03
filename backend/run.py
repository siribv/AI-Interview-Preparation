import os
from app import create_app
from app.extensions import db
from app.models.interview import JobRole

app = create_app(os.getenv("FLASK_ENV", "development"))

def seed_default_roles():
    """Seeds the 8 default job roles if the database is newly initialized."""
    default_roles = [
        {"id": 1, "role_name": "Java Developer", "slug": "java-developer", "description": "Core Java, OOP, Collections, Multithreading, Spring Boot, Microservices, Hibernate, and SQL.", "icon": "Coffee", "primary_skills": "Java, OOPs, Spring Boot, Microservices, Hibernate, REST APIs, SQL"},
        {"id": 2, "role_name": "Python Developer", "slug": "python-developer", "description": "Python fundamentals, Data Structures, OOP, Django/Flask, RESTful APIs, and Database query design.", "icon": "Terminal", "primary_skills": "Python, OOPs, Django, Flask, FastAPI, Data Structures, PostgreSQL"},
        {"id": 3, "role_name": "Frontend Developer", "slug": "frontend-developer", "description": "HTML5, CSS3, JavaScript (ES6+), React.js, Responsive Design, State Management, and Web Performance.", "icon": "Layout", "primary_skills": "HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Redux, Web APIs"},
        {"id": 4, "role_name": "Backend Developer", "slug": "backend-developer", "description": "System design, REST & GraphQL APIs, Database normalization, Caching, Authentication, and Scalability.", "icon": "Server", "primary_skills": "Node.js, Express, Python/Flask, PostgreSQL, Redis, Docker, System Design"},
        {"id": 5, "role_name": "Full Stack Developer", "slug": "full-stack-developer", "description": "End-to-end web architecture, Frontend UI, Backend APIs, Database integration, and Deployment pipelines.", "icon": "Layers", "primary_skills": "React.js, Node.js, Python, REST APIs, MySQL/MongoDB, Git, CI/CD"},
        {"id": 6, "role_name": "Data Analyst", "slug": "data-analyst", "description": "SQL querying, Pandas, NumPy, Data Cleaning, Exploratory Data Analysis (EDA), Tableau/PowerBI, and Statistics.", "icon": "BarChart3", "primary_skills": "SQL, Python, Pandas, NumPy, Data Visualization, Excel, Statistics"},
        {"id": 7, "role_name": "Machine Learning Engineer", "slug": "machine-learning-engineer", "description": "Supervised/Unsupervised ML algorithms, Scikit-Learn, Feature Engineering, Model Evaluation, and Deployment.", "icon": "Cpu", "primary_skills": "Linear Algebra, Scikit-Learn, TensorFlow, PyTorch, Feature Engineering, MLOps"},
        {"id": 8, "role_name": "AI Engineer", "slug": "ai-engineer", "description": "Deep Learning, NLP, Large Language Models (LLMs), Prompt Engineering, Vector Databases, and Retrieval-Augmented Generation (RAG).", "icon": "Sparkles", "primary_skills": "LLMs, PyTorch, LangChain, RAG, Embeddings, Prompt Engineering, Transformers"}
    ]

    with app.app_context():
        try:
            # Create tables if not created
            db.create_all()
            for r in default_roles:
                existing = JobRole.query.filter_by(slug=r["slug"]).first()
                if not existing:
                    new_role = JobRole(
                        role_name=r["role_name"],
                        slug=r["slug"],
                        description=r["description"],
                        icon=r["icon"],
                        primary_skills=r["primary_skills"],
                    )
                    db.session.add(new_role)
            db.session.commit()
            print(">> [Database] Verified schema and default job roles.")
        except Exception as err:
            print(f">> [Database Notice] Could not auto-seed yet: {err}")
            print(">> Ensure MySQL service is running and credentials in .env are correct.")

if __name__ == "__main__":
    seed_default_roles()
    port = int(os.getenv("PORT", 5000))
    print(f">> Starting AI Interview Backend on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
