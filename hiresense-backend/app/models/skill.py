from datetime import datetime, timezone
from app.extensions import db


class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(50), default='General', nullable=True)

    user_skills = db.relationship('UserSkill', backref='skill', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
        }


class UserSkill(db.Model):
    __tablename__ = 'user_skills'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='SET NULL'), nullable=True)

    resume_claim = db.Column(db.String(50), default='Intermediate')  # Beginner, Intermediate, Advanced
    demonstrated_level = db.Column(db.String(50), default='Developing')  # Needs Assessment, Developing, Strong, Verified
    status = db.Column(db.String(50), default='developing')  # verified, developing, needs_practice, pending
    score = db.Column(db.Integer, default=75)
    verified_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.skill.name if self.skill else 'Skill',
            'category': self.skill.category if self.skill else 'General',
            'resume_claim': self.resume_claim,
            'demonstrated_level': self.demonstrated_level,
            'status': self.status,
            'score': self.score,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
        }
