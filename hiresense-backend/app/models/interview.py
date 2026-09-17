from datetime import datetime, timezone
import json
from app.extensions import db


class InterviewSession(db.Model):
    __tablename__ = 'interview_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    target_role = db.Column(db.String(100), default='Software Developer')
    round_type = db.Column(db.String(50), default='behavioral')  # behavioral, dsa, system, project, mixed
    company_name = db.Column(db.String(100), default='General')

    overall_score = db.Column(db.Integer, default=90)
    clarity_score = db.Column(db.Integer, default=90)
    technical_depth_score = db.Column(db.Integer, default=86)
    communication_score = db.Column(db.Integer, default=92)
    structure_score = db.Column(db.Integer, default=92)

    status = db.Column(db.String(50), default='completed')  # active, completed
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    evaluations = db.relationship('InterviewEvaluation', backref='session', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company_name,
            'role': self.target_role,
            'round_type': self.round_type,
            'overall_score': self.overall_score,
            'clarity': self.clarity_score,
            'technical_depth': self.technical_depth_score,
            'communication': self.communication_score,
            'structure': self.structure_score,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class InterviewEvaluation(db.Model):
    __tablename__ = 'interview_evaluations'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('interview_sessions.id', ondelete='CASCADE'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    answer_text = db.Column(db.Text, nullable=False)
    score = db.Column(db.Integer, default=85)
    feedback = db.Column(db.Text, nullable=True)
    rubric_json = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def get_rubric(self):
        if not self.rubric_json:
            return []
        try:
            return json.loads(self.rubric_json)
        except Exception:
            return []

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question_text,
            'answer': self.answer_text,
            'score': self.score,
            'feedback': self.feedback,
            'rubric': self.get_rubric(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
