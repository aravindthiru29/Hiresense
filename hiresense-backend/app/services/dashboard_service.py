from typing import Dict, Any
from app.models import User, ReadinessScore, Assessment, ProgressLog, Resume
from app.services.readiness_service import ReadinessService


class DashboardService:

    @staticmethod
    def get_dashboard_data(user_id: int) -> Dict[str, Any]:
        from app.extensions import db
        user = db.session.get(User, user_id)
        if not user:
            return {}

        readiness_data = ReadinessService.get_user_readiness(user_id)
        readiness_score = readiness_data.get('overall_score', 92)

        # Retrieve active resume
        resume = Resume.query.filter_by(user_id=user_id, is_active=True).first()
        ats_score = resume.ats_score if resume else 87

        # Latest assessment
        latest_assessment = Assessment.query.filter_by(user_id=user_id).order_by(Assessment.created_at.desc()).first()
        interview_score = 94

        capabilities = {
            'technical': latest_assessment.technical_accuracy if latest_assessment and latest_assessment.technical_accuracy else 86,
            'problem_solving': latest_assessment.problem_solving if latest_assessment and latest_assessment.problem_solving else 84,
            'communication': latest_assessment.communication if latest_assessment and latest_assessment.communication else 92,
            'project': 88,
        }

        # Next Best Action determination
        next_best_action = {
            'title': 'Sharpen Smart Crop Monitoring project metrics',
            'reason': 'Resume Analyzer identified 2 bullet points ready for quantified impact stats (+4 ATS pts).',
            'action': 'Review recommendation',
            'target': 'resume',
        }

        # Skill gaps
        skill_gaps = [
            'System Design & Distributed Caching',
            'Dynamic Programming State Transitions',
            'Docker & Containerized Microservices'
        ]

        # Upcoming interviews
        upcoming_interviews = [
            {
                'company': 'Microsoft On-Campus Drive',
                'role': 'Software Development Engineer (SDE I)',
                'badge': 'Mock Today',
                'badge_color': 'green',
            },
            {
                'company': 'Amazon SDE Internship Round',
                'role': 'DSA & Leadership Principles',
                'badge': 'Tomorrow',
                'badge_color': 'amber',
            },
            {
                'company': 'Flipkart / Swiggy Backend Evaluation',
                'role': 'Python, Flask & Database Architecture',
                'badge': 'In 4 days',
                'badge_color': '',
            },
        ]

        # Focus lane
        focus_lane = [
            {'title': 'Resume ATS Metrics', 'desc': 'Quantify 2 project bullet points', 'status': 'Ready to apply', 'color': 'green'},
            {'title': 'System Design Fundamentals', 'desc': 'Complete Redis caching scenario', 'status': 'Needs polish', 'color': 'amber'},
            {'title': 'GitHub Portfolio READMEs', 'desc': 'Add demo GIF & architecture diagram', 'status': 'Next priority', 'color': ''},
        ]

        # Historical weekly progress
        progress = ReadinessService.get_readiness_history(user_id)

        return {
            'user': {
                'id': user.id,
                'name': user.full_name,
                'email': user.email,
                'college': user.college,
                'branch': user.branch,
                'graduation_year': user.graduation_year,
                'target_role': user.target_role or 'Software Developer',
                'initials': user.profile.avatar_initials if user.profile else 'AT',
            },
            'readiness': {
                'score': readiness_score,
                'label': readiness_data.get('label', 'Interview Ready'),
                'change': readiness_data.get('change', '+8% this month'),
            },
            'stats': [
                {'label': 'Placement readiness', 'value': f"{readiness_score}%", 'delta': '+8% this month', 'good': True, 'to': 'readiness'},
                {'label': 'ATS resume score', 'value': f"{ats_score}/100", 'delta': 'Strong keyword fit', 'good': True, 'to': 'resume'},
                {'label': 'Mock interview score', 'value': f"{interview_score}%", 'delta': 'Behavioral & STAR ready', 'good': True, 'to': 'interview'},
            ],
            'capability': capabilities,
            'skill_gaps': skill_gaps,
            'next_best_action': next_best_action,
            'upcoming_interviews': upcoming_interviews,
            'focus_lane': focus_lane,
            'progress': progress,
        }
