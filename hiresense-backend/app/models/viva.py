from datetime import datetime, timezone
from app.extensions import db


class ProjectViva(db.Model):
    __tablename__ = 'project_vivas'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='SET NULL'), nullable=True)
    project_name = db.Column(db.String(150), nullable=False)

    overall_score = db.Column(db.Integer, default=88)
    architecture_score = db.Column(db.Integer, default=88)
    ownership_score = db.Column(db.Integer, default=92)
    technical_depth_score = db.Column(db.Integer, default=86)

    status = db.Column(db.String(50), default='completed')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    evaluations = db.relationship('VivaEvaluation', backref='viva', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'project_name': self.project_name,
            'overall_score': self.overall_score,
            'architecture': self.architecture_score,
            'ownership': self.ownership_score,
            'technical_depth': self.technical_depth_score,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class VivaEvaluation(db.Model):
    __tablename__ = 'viva_evaluations'

    id = db.Column(db.Integer, primary_key=True)
    viva_id = db.Column(db.Integer, db.ForeignKey('project_vivas.id', ondelete='CASCADE'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    score = db.Column(db.Integer, default=85)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer,
            'feedback': self.feedback,
            'score': self.score,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
