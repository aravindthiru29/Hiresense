from datetime import datetime, timezone
from app.extensions import db


class RoadmapSprint(db.Model):
    __tablename__ = 'roadmap_sprints'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    week_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(50), default='upcoming')  # completed, in_progress, upcoming, planned
    deliverable = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    tasks = db.relationship('RoadmapTask', backref='sprint', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'week': f"Week {self.week_number}" + (" (Active)" if self.status == 'in_progress' else ""),
            'week_number': self.week_number,
            'title': self.title,
            'status': 'In Progress' if self.status == 'in_progress' else self.status.capitalize(),
            'statusClass': 'accent' if self.status == 'in_progress' else 'green' if self.status == 'completed' else 'amber' if self.status == 'upcoming' else '',
            'deliverable': self.deliverable,
            'tasks': [t.to_dict() for t in self.tasks.all()],
        }


class RoadmapTask(db.Model):
    __tablename__ = 'roadmap_tasks'

    id = db.Column(db.Integer, primary_key=True)
    sprint_id = db.Column(db.Integer, db.ForeignKey('roadmap_sprints.id', ondelete='CASCADE'), nullable=False)
    task_key = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_completed = db.Column(db.Boolean, default=False)
    difficulty = db.Column(db.String(20), default='medium')
    estimated_hours = db.Column(db.Integer, default=6)

    def to_dict(self):
        return {
            'id': self.id,
            'task_key': self.task_key,
            'title': self.title,
            'text': self.title,
            'is_completed': self.is_completed,
            'difficulty': self.difficulty,
            'estimated_hours': self.estimated_hours,
        }
