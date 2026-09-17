from datetime import datetime, timezone
from app.extensions import db


class ReadinessScore(db.Model):
    __tablename__ = 'readiness_scores'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)

    overall_score = db.Column(db.Integer, default=92)
    resume_fit = db.Column(db.Integer, default=92)
    github_maturity = db.Column(db.Integer, default=88)
    product_storytelling = db.Column(db.Integer, default=84)
    system_design = db.Column(db.Integer, default=78)
    interview_confidence = db.Column(db.Integer, default=94)

    tier1_benchmark = db.Column(db.Integer, default=88)
    startup_benchmark = db.Column(db.Integer, default=94)
    enterprise_benchmark = db.Column(db.Integer, default=91)

    label = db.Column(db.String(50), default='Interview Ready')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'overall_score': self.overall_score,
            'label': self.label,
            'pillars': {
                'resume_fit': self.resume_fit,
                'github_maturity': self.github_maturity,
                'product_storytelling': self.product_storytelling,
                'system_design': self.system_design,
                'interview_confidence': self.interview_confidence,
            },
            'benchmarks': {
                'tier1_tech': self.tier1_benchmark,
                'startups': self.startup_benchmark,
                'enterprise': self.enterprise_benchmark,
            },
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
