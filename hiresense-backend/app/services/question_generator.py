from typing import List, Dict, Any
from app.services.ai_service import get_ai_service


class QuestionGenerator:
    """Generates personalized assessment questions based on user's resume and target role."""

    @staticmethod
    def generate_for_user(user_profile: Dict[str, Any], count: int = 10) -> List[Dict[str, Any]]:
        ai = get_ai_service()
        return ai.generate_assessment_questions(user_profile, count=count)
