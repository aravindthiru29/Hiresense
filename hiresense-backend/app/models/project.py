from datetime import datetime, timezone
import json
from app.extensions import db


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='SET NULL'), nullable=True)

    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    technologies = db.Column(db.Text, nullable=True)  # Comma-separated or JSON list
    original_bullet = db.Column(db.Text, nullable=True)
    optimized_bullet = db.Column(db.Text, nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    impact_rating = db.Column(db.Integer, default=85)
    badge = db.Column(db.String(50), default='Featured Project')

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def get_tech_list(self):
        if not self.technologies:
            return []
        try:
            return json.loads(self.technologies)
        except Exception:
            return [t.strip() for t in self.technologies.split(',') if t.strip()]

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'technologies': self.get_tech_list(),
            'original_bullet': self.original_bullet,
            'optimized_bullet': self.optimized_bullet,
            'github_url': self.github_url,
            'impact_rating': self.impact_rating,
            'badge': self.badge,
        }
