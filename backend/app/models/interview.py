from datetime import datetime
from app.extensions import db

class JobRole(db.Model):
    __tablename__ = "job_roles"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(50), default="Code")
    primary_skills = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    questions = db.relationship("Question", backref="role", lazy=True, cascade="all, delete-orphan")
    sessions = db.relationship("InterviewSession", backref="role", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "role_name": self.role_name,
            "slug": self.slug,
            "description": self.description,
            "icon": self.icon,
            "primary_skills": self.primary_skills.split(", ") if self.primary_skills else [],
            "is_active": self.is_active,
        }

class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer, db.ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.Enum("technical", "coding", "hr"), default="technical", nullable=False)
    difficulty = db.Column(db.Enum("beginner", "intermediate", "advanced"), default="beginner", nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    expected_concepts = db.Column(db.Text, nullable=True)
    sample_answer = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    answers = db.relationship("UserAnswer", backref="question", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "role_id": self.role_id,
            "question_text": self.question_text,
            "question_type": self.question_type,
            "difficulty": self.difficulty,
            "topic": self.topic,
            "expected_concepts": self.expected_concepts,
            "sample_answer": self.sample_answer,
        }

class InterviewSession(db.Model):
    __tablename__ = "interview_sessions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("job_roles.id", ondelete="RESTRICT"), nullable=False)
    session_type = db.Column(db.Enum("practice", "mock"), default="mock")
    difficulty = db.Column(db.Enum("beginner", "intermediate", "advanced"), default="beginner")
    total_questions = db.Column(db.Integer, default=5)
    completed_questions = db.Column(db.Integer, default=0)
    status = db.Column(db.Enum("in_progress", "completed", "abandoned"), default="in_progress")
    overall_score = db.Column(db.Numeric(4, 2), nullable=True)
    feedback_summary = db.Column(db.Text, nullable=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    answers = db.relationship("UserAnswer", backref="session", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "role_id": self.role_id,
            "role_name": self.role.role_name if self.role else None,
            "session_type": self.session_type,
            "difficulty": self.difficulty,
            "total_questions": self.total_questions,
            "completed_questions": self.completed_questions,
            "status": self.status,
            "overall_score": float(self.overall_score) if self.overall_score is not None else None,
            "feedback_summary": self.feedback_summary,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }

class UserAnswer(db.Model):
    __tablename__ = "user_answers"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(db.Integer, db.ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    user_answer_text = db.Column(db.Text, nullable=False)
    time_spent_seconds = db.Column(db.Integer, default=0)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    evaluation = db.relationship("EvaluationResult", backref="user_answer", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "question_id": self.question_id,
            "user_answer_text": self.user_answer_text,
            "time_spent_seconds": self.time_spent_seconds,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "evaluation": self.evaluation.to_dict() if self.evaluation else None,
        }

class EvaluationResult(db.Model):
    __tablename__ = "evaluation_results"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    answer_id = db.Column(db.Integer, db.ForeignKey("user_answers.id", ondelete="CASCADE"), unique=True, nullable=False)
    score = db.Column(db.Numeric(4, 2), nullable=False)
    conceptual_accuracy_score = db.Column(db.Numeric(4, 2), nullable=True)
    clarity_score = db.Column(db.Numeric(4, 2), nullable=True)
    missing_concepts = db.Column(db.Text, nullable=True)
    strengths = db.Column(db.Text, nullable=True)
    weaknesses = db.Column(db.Text, nullable=True)
    feedback = db.Column(db.Text, nullable=False)
    improved_answer = db.Column(db.Text, nullable=False)
    evaluated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "answer_id": self.answer_id,
            "score": float(self.score),
            "conceptual_accuracy_score": float(self.conceptual_accuracy_score) if self.conceptual_accuracy_score is not None else None,
            "clarity_score": float(self.clarity_score) if self.clarity_score is not None else None,
            "missing_concepts": self.missing_concepts,
            "strengths": self.strengths,
            "weaknesses": self.weaknesses,
            "feedback": self.feedback,
            "improved_answer": self.improved_answer,
            "evaluated_at": self.evaluated_at.isoformat() if self.evaluated_at else None,
        }
