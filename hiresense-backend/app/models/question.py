from app.extensions import db


class AssessmentQuestion(db.Model):
    __tablename__ = 'assessment_questions'

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False, index=True)
    question_index = db.Column(db.Integer, nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='technical')  # technical, problem_solving, project, communication, role_based
    difficulty = db.Column(db.String(20), default='intermediate')  # beginner, intermediate, advanced
    expected_concept = db.Column(db.Text, nullable=True)
    associated_skill = db.Column(db.String(100), nullable=True)

    answer = db.relationship('AssessmentAnswer', backref='question', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'question_index': self.question_index,
            'question_text': self.question_text,
            'category': self.category,
            'difficulty': self.difficulty,
            'associated_skill': self.associated_skill,
            'is_answered': self.answer is not None,
        }
