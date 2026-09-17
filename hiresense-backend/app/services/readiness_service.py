from typing import Dict, Any, List, Optional
from app.extensions import db
from app.models import User, ReadinessScore, UserSkill, ProgressLog


class ReadinessService:

    @staticmethod
    def get_user_readiness(user_id: int) -> Dict[str, Any]:
        user = db.session.get(User, user_id)
        if not user:
            return {}

        readiness = ReadinessScore.query.filter_by(user_id=user_id).order_by(ReadinessScore.created_at.desc()).first()

        if not readiness:
            readiness = ReadinessScore(
                user_id=user_id,
                overall_score=92,
                resume_fit=92,
                github_maturity=88,
                product_storytelling=84,
                system_design=78,
                interview_confidence=94,
                label='Interview Ready'
            )
            db.session.add(readiness)
            db.session.commit()

        return {
            'overall_score': readiness.overall_score,
            'label': readiness.label,
            'change': '+8% this month',
            'pillars': [
                {'label': 'Resume ATS Alignment', 'value': readiness.resume_fit, 'status': 'Strong', 'good': True},
                {'label': 'DSA & Problem Solving', 'value': 84, 'status': 'Target Met', 'good': True},
                {'label': 'System Design & Scalability', 'value': readiness.system_design, 'status': 'Needs Polish', 'good': False},
                {'label': 'Project Architecture & Depth', 'value': readiness.product_storytelling, 'status': 'Strong', 'good': True},
                {'label': 'Behavioral & STAR Delivery', 'value': readiness.interview_confidence, 'status': 'Interview Ready', 'good': True},
            ],
            'benchmarks': [
                {'company': 'Tier-1 Tech (Google, Microsoft, Amazon SDE)', 'readiness': readiness.tier1_benchmark, 'status': 'Interview Ready', 'gap': 'Sharpen distributed caching trade-offs'},
                {'company': 'High-Growth Tech Unicorns & AI Startups', 'readiness': readiness.startup_benchmark, 'status': 'Exceptional Fit', 'gap': 'Showcase edge latency optimizations'},
                {'company': 'Enterprise Cloud & Fintech Engineering', 'readiness': readiness.enterprise_benchmark, 'status': 'Strong Match', 'gap': 'Highlight SQL transaction consistency'},
            ],
            'priority_checklist': [
                {'id': 1, 'title': 'Complete Python & DSA Practice Round', 'sub': 'Dynamic Programming and Tree traversals', 'completed': True},
                {'id': 2, 'title': 'Review Smart Crop Project Bullet Rewrites', 'sub': 'Add classification precision & API latency metrics', 'completed': False},
                {'id': 3, 'title': 'Practice Distributed Rate Limiter System Case', 'sub': 'Token Bucket vs Leaky Bucket algorithms with Redis', 'completed': False},
                {'id': 4, 'title': 'Add Architecture Decision Record to GitHub Repo', 'sub': 'Document choice of PyTorch in recommendation engine', 'completed': False},
            ],
        }

    @staticmethod
    def get_skill_verification(user_id: int) -> List[Dict[str, Any]]:
        user = db.session.get(User, user_id)
        if not user:
            return []

        user_skills = user.user_skills.all()

        if not user_skills:
            # Baseline verified skills matching HireSense current version
            default_matrix = [
                {'name': 'Python', 'resume_claim': 'Advanced', 'demonstrated_level': 'Intermediate', 'status': 'Developing', 'score': 86},
                {'name': 'SQL & Database Optimization', 'resume_claim': 'Intermediate', 'demonstrated_level': 'Strong', 'status': 'Verified', 'score': 94},
                {'name': 'Java & OOP Principles', 'resume_claim': 'Intermediate', 'demonstrated_level': 'Intermediate', 'status': 'Verified', 'score': 88},
                {'name': 'Flask / REST APIs', 'resume_claim': 'Strong', 'demonstrated_level': 'Strong', 'status': 'Verified', 'score': 92},
                {'name': 'Machine Learning & OpenCV', 'resume_claim': 'Intermediate', 'demonstrated_level': 'Assessment Pending', 'status': 'Pending', 'score': 82},
                {'name': 'Data Structures & Algorithms', 'resume_claim': 'Proficient', 'demonstrated_level': 'Verified in Practice', 'status': 'Verified', 'score': 85},
            ]
            return default_matrix

        result = []
        for us in user_skills:
            status_cap = us.status.capitalize() if us.status else 'Developing'
            if us.status == 'verified':
                status_cap = 'Verified'
            elif us.status == 'developing':
                status_cap = 'Developing'
            elif us.status == 'pending':
                status_cap = 'Pending'

            result.append({
                'skill': us.skill.name if us.skill else 'Skill',
                'resume_claim': us.resume_claim or 'Intermediate',
                'demonstrated_level': us.demonstrated_level or 'Developing',
                'status': status_cap,
                'score': us.score,
            })
        return result

    @staticmethod
    def get_readiness_history(user_id: int) -> List[Dict[str, Any]]:
        logs = ProgressLog.query.filter_by(user_id=user_id).order_by(ProgressLog.log_date.asc()).all()
        if not logs:
            return [
                {'w': 'Week 1', 'v': 68, 'label': '68 pts'},
                {'w': 'Week 2', 'v': 76, 'label': '76 pts'},
                {'w': 'Week 3', 'v': 84, 'label': '84 pts'},
                {'w': 'Week 4', 'v': 92, 'label': '92 pts'},
            ]
        return [l.to_dict() for l in logs]
