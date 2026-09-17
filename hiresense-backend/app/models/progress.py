from datetime import datetime, timezone
from app.extensions import db


class ProgressLog(db.Model):
    __tablename__ = 'progress_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)

    log_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    week_label = db.Column(db.String(50), nullable=False)  # Week 1, Week 2, etc.
    readiness_score = db.Column(db.Integer, default=70)
    skills_score = db.Column(db.Integer, default=70)
    interview_score = db.Column(db.Integer, default=70)

    activity_type = db.Column(db.String(100), default='assessment')
    details = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'w': self.week_label,
            'v': self.readiness_score,
            'label': f"{self.readiness_score}%",
            'readiness_score': self.readiness_score,
            'skills_score': self.skills_score,
            'interview_score': self.interview_score,
            'activity_type': self.activity_type,
            'date': self.log_date.isoformat() if self.log_date else None,
        }
