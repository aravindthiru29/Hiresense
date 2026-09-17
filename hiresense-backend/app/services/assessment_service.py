from typing import Dict, Any, Tuple, Optional, List
from datetime import datetime, timezone
from app.extensions import db
from app.models import User, Assessment, AssessmentQuestion, AssessmentAnswer, UserSkill, ReadinessScore, ProgressLog
from app.services.question_generator import QuestionGenerator
from app.services.ai_service import get_ai_service


class AssessmentService:

    @staticmethod
    def generate_assessment(user_id: int) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        user = db.session.get(User, user_id)
        if not user:
            return None, "User not found"

        # Create new Assessment
        assessment = Assessment(
            user_id=user_id,
            target_role=user.target_role or 'Software Developer',
            total_questions=10,
            status='in_progress'
        )
        db.session.add(assessment)
        db.session.flush()

        # Generate questions
        user_info = {
            'target_role': user.target_role,
            'degree': user.degree,
            'branch': user.branch,
        }
        raw_questions = QuestionGenerator.generate_for_user(user_info, count=10)

        categories_count = {
            'technical': 0,
            'problem_solving': 0,
            'project': 0,
            'communication': 0,
            'role_based': 0,
        }

        for q_data in raw_questions:
            cat = q_data.get('category', 'technical')
            categories_count[cat] = categories_count.get(cat, 0) + 1

            question_obj = AssessmentQuestion(
                assessment_id=assessment.id,
                question_index=q_data.get('question_index', 0),
                question_text=q_data['question_text'],
                category=cat,
                difficulty=q_data.get('difficulty', 'intermediate'),
                expected_concept=q_data.get('expected_concept', ''),
                associated_skill=q_data.get('associated_skill', '')
            )
            db.session.add(question_obj)

        db.session.commit()

        return {
            'assessment_id': assessment.id,
            'total_questions': len(raw_questions),
            'categories': categories_count,
            'questions': [q.to_dict() for q in assessment.questions.all()],
        }, None

    @staticmethod
    def get_current_or_create(user_id: int) -> Dict[str, Any]:
        assessment = Assessment.query.filter_by(user_id=user_id, status='in_progress').order_by(Assessment.created_at.desc()).first()
        if not assessment:
            data, _ = AssessmentService.generate_assessment(user_id)
            return data

        questions = assessment.questions.order_by(AssessmentQuestion.question_index).all()
        return {
            'assessment_id': assessment.id,
            'total_questions': assessment.total_questions,
            'status': assessment.status,
            'questions': [q.to_dict() for q in questions],
        }

    @staticmethod
    def submit_answer(
        user_id: int,
        assessment_id: int,
        question_id: int,
        answer_text: str
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:

        assessment = Assessment.query.filter_by(id=assessment_id, user_id=user_id).first()
        if not assessment:
            return None, "Assessment not found"

        question = AssessmentQuestion.query.filter_by(id=question_id, assessment_id=assessment_id).first()
        if not question:
            return None, "Question not found"

        # AI Evaluation
        ai = get_ai_service()
        eval_result = ai.evaluate_answer(
            question=question.question_text,
            expected_concept=question.expected_concept or '',
            user_answer=answer_text
        )

        # Upsert answer
        answer = AssessmentAnswer.query.filter_by(question_id=question.id, user_id=user_id).first()
        if not answer:
            answer = AssessmentAnswer(
                assessment_id=assessment.id,
                question_id=question.id,
                user_id=user_id,
                answer_text=answer_text
            )
            db.session.add(answer)
        else:
            answer.answer_text = answer_text

        answer.score = eval_result['score']
        answer.technical_accuracy = eval_result['technical_accuracy']
        answer.problem_solving = eval_result['problem_solving']
        answer.reasoning = eval_result['reasoning']
        answer.communication = eval_result['communication']
        answer.feedback = eval_result['feedback']
        answer.mistake_type = eval_result['mistake_type']

        # Update demonstrated level on skill if matched
        if question.associated_skill:
            user_skill = UserSkill.query.filter_by(user_id=user_id).join(UserSkill.skill).filter_by(name=question.associated_skill).first()
            if user_skill:
                user_skill.score = eval_result['score']
                if eval_result['score'] >= 80:
                    user_skill.demonstrated_level = 'Strong'
                    user_skill.status = 'verified'
                    user_skill.verified_at = datetime.now(timezone.utc)
                else:
                    user_skill.demonstrated_level = 'Intermediate'
                    user_skill.status = 'developing'

        db.session.commit()

        return eval_result, None

    @staticmethod
    def complete_assessment(user_id: int, assessment_id: int) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        assessment = Assessment.query.filter_by(id=assessment_id, user_id=user_id).first()
        if not assessment:
            return None, "Assessment not found"

        answers = assessment.answers.all()
        if not answers:
            return None, "No answers submitted for this assessment"

        avg_score = sum(a.score for a in answers) // len(answers)
        avg_tech = sum(a.technical_accuracy for a in answers) // len(answers)
        avg_ps = sum(a.problem_solving for a in answers) // len(answers)
        avg_reason = sum(a.reasoning for a in answers) // len(answers)
        avg_comm = sum(a.communication for a in answers) // len(answers)

        assessment.status = 'completed'
        assessment.overall_score = avg_score
        assessment.technical_accuracy = avg_tech
        assessment.problem_solving = avg_ps
        assessment.reasoning = avg_reason
        assessment.communication = avg_comm
        assessment.adaptability = 75
        assessment.completed_at = datetime.now(timezone.utc)

        # Update ReadinessScore
        readiness = ReadinessScore.query.filter_by(user_id=user_id).order_by(ReadinessScore.created_at.desc()).first()
        if readiness:
            readiness.overall_score = max(readiness.overall_score, avg_score)
            readiness.system_design = avg_tech
            readiness.interview_confidence = avg_comm

        # Log Progress
        progress = ProgressLog(
            user_id=user_id,
            week_label='Week 2',
            readiness_score=readiness.overall_score if readiness else 88,
            skills_score=avg_tech,
            interview_score=avg_comm,
            activity_type='assessment_completion'
        )
        db.session.add(progress)

        db.session.commit()

        return {
            'assessment_id': assessment.id,
            'status': 'completed',
            'overall_score': avg_score,
            'capabilities': {
                'technical': avg_tech,
                'problem_solving': avg_ps,
                'reasoning': avg_reason,
                'communication': avg_comm,
                'adaptability': 75,
            }
        }, None
