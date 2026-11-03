from datetime import datetime
from app.extensions import db

class PerformanceHistory(db.Model):
    __tablename__ = "performance_history"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=False)
    score = db.Column(db.Numeric(4, 2), nullable=False)
    strong_topics = db.Column(db.Text, nullable=True)
    weak_topics = db.Column(db.Text, nullable=True)
    recommended_topics = db.Column(db.Text, nullable=True)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)

    session = db.relationship("InterviewSession", backref="performance_record")
    role = db.relationship("JobRole", backref="performance_records")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "session_id": self.session_id,
            "role_id": self.role_id,
            "role_name": self.role.role_name if self.role else None,
            "score": float(self.score),
            "strong_topics": self.strong_topics.split(", ") if self.strong_topics else [],
            "weak_topics": self.weak_topics.split(", ") if self.weak_topics else [],
            "recommended_topics": self.recommended_topics.split(", ") if self.recommended_topics else [],
            "recorded_at": self.recorded_at.isoformat() if self.recorded_at else None,
        }
