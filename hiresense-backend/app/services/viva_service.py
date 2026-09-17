from typing import Dict, Any, List
from app.extensions import db
from app.models import User, ProjectViva, VivaEvaluation, Project
from app.services.ai_service import get_ai_service


class VivaService:

    @staticmethod
    def start_viva(user_id: int, project_name: str = 'Smart Crop Monitoring System') -> Dict[str, Any]:
        project = Project.query.filter_by(user_id=user_id, name=project_name).first()
        tech_stack = project.technologies if project else 'Python, Flask, OpenCV'
        description = project.description if project else 'Edge AI agricultural diagnostic system'

        viva = ProjectViva(
            user_id=user_id,
            project_id=project.id if project else None,
            project_name=project_name,
            status='in_progress'
        )
        db.session.add(viva)
        db.session.commit()

        ai = get_ai_service()
        questions = ai.generate_viva_questions(project_name, str(tech_stack), str(description))

        return {
            'viva_id': viva.id,
            'project_name': project_name,
            'tech_stack': tech_stack,
            'questions': questions,
        }

    @staticmethod
    def submit_viva_answer(user_id: int, viva_id: int, question: str, answer: str) -> Dict[str, Any]:
        viva = ProjectViva.query.filter_by(id=viva_id, user_id=user_id).first()
        if not viva:
            viva = ProjectViva(user_id=user_id, project_name='Project Defense')
            db.session.add(viva)
            db.session.flush()

        ai = get_ai_service()
        eval_result = ai.evaluate_viva_answer(viva.project_name, question, answer)

        evaluation = VivaEvaluation(
            viva_id=viva.id,
            question=question,
            answer=answer,
            feedback=eval_result.get('feedback', 'Good technical explanation.'),
            score=eval_result.get('score', 88)
        )
        db.session.add(evaluation)

        viva.overall_score = eval_result.get('score', 88)
        viva.architecture_score = eval_result.get('architecture', 88)
        viva.ownership_score = eval_result.get('ownership', 94)
        viva.technical_depth_score = eval_result.get('technical_depth', 88)
        viva.status = 'completed'

        db.session.commit()

        return {
            'viva_id': viva.id,
            'score': eval_result.get('score', 88),
            'feedback': eval_result.get('feedback'),
            'architecture': eval_result.get('architecture', 88),
            'ownership': eval_result.get('ownership', 94),
        }

    @staticmethod
    def get_viva_history(user_id: int) -> List[Dict[str, Any]]:
        vivas = ProjectViva.query.filter_by(user_id=user_id).order_by(ProjectViva.created_at.desc()).all()
        return [v.to_dict() for v in vivas]
