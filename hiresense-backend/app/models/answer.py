from datetime import datetime, timezone
from app.extensions import db


class AssessmentAnswer(db.Model):
    __tablename__ = 'assessment_answers'

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False, index=True)
    question_id = db.Column(db.Integer, db.ForeignKey('assessment_questions.id', ondelete='CASCADE'), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    answer_text = db.Column(db.Text, nullable=False)

    # Evaluation breakdown
    score = db.Column(db.Integer, default=75)
    technical_accuracy = db.Column(db.Integer, default=75)
    problem_solving = db.Column(db.Integer, default=70)
    reasoning = db.Column(db.Integer, default=75)
    communication = db.Column(db.Integer, default=80)
    feedback = db.Column(db.Text, nullable=True)
    mistake_type = db.Column(db.String(50), default='None')  # Concept Gap, Logical Error, Knowledge Gap, Misinterpretation, Communication Issue, None

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'answer_text': self.answer_text,
            'score': self.score,
            'technical_accuracy': self.technical_accuracy,
            'problem_solving': self.problem_solving,
            'reasoning': self.reasoning,
            'communication': self.communication,
            'feedback': self.feedback,
            'mistake_type': self.mistake_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
