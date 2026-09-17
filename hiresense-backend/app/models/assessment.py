from datetime import datetime, timezone
from app.extensions import db


class Assessment(db.Model):
    __tablename__ = 'assessments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    target_role = db.Column(db.String(100), default='Software Developer')
    total_questions = db.Column(db.Integer, default=10)
    status = db.Column(db.String(50), default='in_progress')  # in_progress, completed

    # Aggregate evaluation scores
    overall_score = db.Column(db.Integer, default=0)
    technical_accuracy = db.Column(db.Integer, default=0)
    problem_solving = db.Column(db.Integer, default=0)
    reasoning = db.Column(db.Integer, default=0)
    communication = db.Column(db.Integer, default=0)
    adaptability = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    questions = db.relationship('AssessmentQuestion', backref='assessment', lazy='dynamic', cascade='all, delete-orphan')
    answers = db.relationship('AssessmentAnswer', backref='assessment', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'target_role': self.target_role,
            'total_questions': self.total_questions,
            'status': self.status,
            'overall_score': self.overall_score,
            'capabilities': {
                'technical': self.technical_accuracy,
                'problem_solving': self.problem_solving,
                'reasoning': self.reasoning,
                'communication': self.communication,
                'adaptability': self.adaptability,
            },
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }
