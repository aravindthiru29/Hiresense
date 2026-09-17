from datetime import datetime, timezone
from app.extensions import db


class Resume(db.Model):
    __tablename__ = 'resumes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size_bytes = db.Column(db.Integer, default=0)
    extracted_text = db.Column(db.Text, nullable=True)

    # Scores
    resume_score = db.Column(db.Integer, default=82)
    ats_score = db.Column(db.Integer, default=87)
    technical_profile_score = db.Column(db.Integer, default=86)
    project_strength_score = db.Column(db.Integer, default=88)

    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    education = db.relationship('Education', backref='resume', lazy='dynamic', cascade='all, delete-orphan')
    experience = db.relationship('Experience', backref='resume', lazy='dynamic', cascade='all, delete-orphan')
    projects = db.relationship('Project', backref='resume', lazy='dynamic')
    skills = db.relationship('UserSkill', backref='resume', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'file_size_formatted': f"{(self.file_size_bytes / (1024 * 1024)):.1f} MB" if self.file_size_bytes else "2.4 MB",
            'resume_score': self.resume_score,
            'ats_score': self.ats_score,
            'technical_profile': self.technical_profile_score,
            'project_strength': self.project_strength_score,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Education(db.Model):
    __tablename__ = 'educations'

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False)
    degree = db.Column(db.String(100), nullable=True)
    institution = db.Column(db.String(150), nullable=True)
    field_of_study = db.Column(db.String(100), nullable=True)
    start_year = db.Column(db.Integer, nullable=True)
    end_year = db.Column(db.Integer, nullable=True)
    grade = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'degree': self.degree,
            'institution': self.institution,
            'field_of_study': self.field_of_study,
            'graduation_year': self.end_year,
            'grade': self.grade,
        }


class Experience(db.Model):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False)
    company = db.Column(db.String(150), nullable=True)
    role = db.Column(db.String(100), nullable=True)
    duration = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'role': self.role,
            'duration': self.duration,
            'description': self.description,
        }
