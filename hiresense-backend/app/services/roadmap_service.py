from typing import Dict, Any, List
from app.extensions import db
from app.models import User, RoadmapSprint, RoadmapTask


class RoadmapService:

    @staticmethod
    def get_or_create_roadmap(user_id: int) -> Dict[str, Any]:
        sprints = RoadmapSprint.query.filter_by(user_id=user_id).order_by(RoadmapSprint.week_number.asc()).all()

        if not sprints:
            RoadmapService._seed_default_roadmap(user_id)
            sprints = RoadmapSprint.query.filter_by(user_id=user_id).order_by(RoadmapSprint.week_number.asc()).all()

        sprint_dicts = [s.to_dict() for s in sprints]
        total_tasks = sum(len(s['tasks']) for s in sprint_dicts)
        completed_tasks = sum(len([t for t in s['tasks'] if t['is_completed']]) for s in sprint_dicts)
        progress_pct = round((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 0

        return {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'progress_pct': progress_pct,
            'drive_days_remaining': 24,
            'sprints': sprint_dicts,
        }

    @staticmethod
    def update_task_progress(user_id: int, task_id: int, is_completed: bool) -> Dict[str, Any]:
        task = RoadmapTask.query.join(RoadmapSprint).filter(
            RoadmapTask.id == task_id,
            RoadmapSprint.user_id == user_id
        ).first()

        if task:
            task.is_completed = is_completed
            db.session.commit()

        return RoadmapService.get_or_create_roadmap(user_id)

    @staticmethod
    def _seed_default_roadmap(user_id: int):
        sprint_defs = [
            {
                'week': 1,
                'title': 'Resume ATS & Project Architecture Polish',
                'status': 'completed',
                'deliverable': 'Delivered: 87/100 ATS resume ready for campus drives',
                'tasks': [
                    ('w1-1', 'Run ATS audit on Aravind_T_Resume.pdf for Software Developer role', True),
                    ('w1-2', 'Quantify Smart Crop Monitoring metrics (92.4% accuracy, sub-250ms latency)', True),
                    ('w1-3', 'Add collaborative-filtering and indexing bullets to recommendation project', True),
                ]
            },
            {
                'week': 2,
                'title': 'Core DSA & Algorithmic Problem Solving Sprint',
                'status': 'in_progress',
                'deliverable': 'Target: 88%+ Technical Problem-Solving readiness score',
                'tasks': [
                    ('w2-1', 'Solve 15 Tree & Graph traversal problems in Python/Java', True),
                    ('w2-2', 'Master Dynamic Programming state transitions (Knapsack & Subsequence patterns)', False),
                    ('w2-3', 'Complete timed 45-min coding round simulation in Mock Interview coach', False),
                ]
            },
            {
                'week': 3,
                'title': 'System Design & Scalable Backend Architecture',
                'status': 'upcoming',
                'deliverable': 'Target: Pass Tier-1 SDE system architecture rounds',
                'tasks': [
                    ('w3-1', 'Design Distributed Rate Limiter with Redis token bucket algorithm', False),
                    ('w3-2', 'Review database indexing B-Tree mechanics and SQL query execution plans', False),
                    ('w3-3', 'Document Architecture Decision Record (ADR) in GitHub recsys repo', False),
                ]
            },
            {
                'week': 4,
                'title': 'Mock Interview Marathon & High-Priority Applications',
                'status': 'planned',
                'deliverable': 'Target: Secure initial technical screen invitations',
                'tasks': [
                    ('w4-1', 'Conduct 3 full-length FAANG/Tier-1 behavioral STAR mock interviews', False),
                    ('w4-2', 'Submit 10 tailored applications to Microsoft, Amazon, and top AI unicorns', False),
                    ('w4-3', 'Export finalized Placement Readiness Dossier & verified skills sheet', False),
                ]
            },
        ]

        for s_def in sprint_defs:
            sprint = RoadmapSprint(
                user_id=user_id,
                week_number=s_def['week'],
                title=s_def['title'],
                status=s_def['status'],
                deliverable=s_def['deliverable']
            )
            db.session.add(sprint)
            db.session.flush()

            for key, text, is_done in s_def['tasks']:
                task = RoadmapTask(
                    sprint_id=sprint.id,
                    task_key=key,
                    title=text,
                    is_completed=is_done
                )
                db.session.add(task)

        db.session.commit()


def Math_round(val: float) -> int:
    return int(round(val))
