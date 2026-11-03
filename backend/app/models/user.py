from datetime import datetime
from app.extensions import db, bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    college = db.Column(db.String(180), nullable=True)
    degree = db.Column(db.String(100), default="B.Tech CSE-AI")
    target_role = db.Column(db.String(100), default="Full Stack Developer")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sessions = db.relationship("InterviewSession", backref="user", lazy=True, cascade="all, delete-orphan")
    analytics = db.relationship("PerformanceHistory", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password: str):
        """Hashes password using bcrypt."""
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password: str) -> bool:
        """Verifies password hash."""
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Serializes user object for API responses (excluding password hash)."""
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "college": self.college,
            "degree": self.degree,
            "target_role": self.target_role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
