from datetime import datetime, timezone
from app.extensions import db


class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    bio = db.Column(db.Text, nullable=True)
    github_handle = db.Column(db.String(120), nullable=True)
    linkedin_url = db.Column(db.String(255), nullable=True)
    avatar_initials = db.Column(db.String(10), default='AT', nullable=True)
    profile_completeness = db.Column(db.Integer, default=70)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'bio': self.bio,
            'github_handle': self.github_handle,
            'linkedin_url': self.linkedin_url,
            'avatar_initials': self.avatar_initials,
            'profile_completeness': self.profile_completeness,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
