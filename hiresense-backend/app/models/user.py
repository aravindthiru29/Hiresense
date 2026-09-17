from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    college = db.Column(db.String(150), nullable=True)
    degree = db.Column(db.String(50), nullable=True)
    branch = db.Column(db.String(100), nullable=True)
    graduation_year = db.Column(db.Integer, nullable=True)
    target_role = db.Column(db.String(100), default='Software Developer', nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    profile = db.relationship('UserProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    resumes = db.relationship('Resume', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    assessments = db.relationship('Assessment', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    interviews = db.relationship('InterviewSession', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    vivas = db.relationship('ProjectViva', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    readiness_scores = db.relationship('ReadinessScore', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    user_skills = db.relationship('UserSkill', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    projects = db.relationship('Project', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    roadmap_sprints = db.relationship('RoadmapSprint', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    progress_logs = db.relationship('ProgressLog', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'college': self.college,
            'degree': self.degree,
            'branch': self.branch,
            'graduation_year': self.graduation_year,
            'target_role': self.target_role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
