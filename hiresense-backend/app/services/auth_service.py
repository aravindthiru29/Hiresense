from typing import Dict, Any, Tuple, Optional
from flask_jwt_extended import create_access_token, create_refresh_token
from app.extensions import db
from app.models import User, UserProfile, ReadinessScore, ProgressLog
from datetime import datetime, timezone


class AuthService:

    @staticmethod
    def register_user(data: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        email = data['email'].strip().lower()

        # Check existing
        if User.query.filter_by(email=email).first():
            return None, "A user with this email address already exists"

        user = User(
            full_name=data['full_name'].strip(),
            email=email,
            college=data.get('college'),
            degree=data.get('degree'),
            branch=data.get('branch'),
            graduation_year=data.get('graduation_year'),
            target_role=data.get('target_role', 'Software Developer')
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.flush()

        # Generate avatar initials
        names = user.full_name.split()
        initials = (names[0][0] + (names[-1][0] if len(names) > 1 else '')).upper()

        profile = UserProfile(
            user_id=user.id,
            avatar_initials=initials,
            profile_completeness=75,
            bio=f"Aspiring {user.target_role} studying {user.branch or 'Computer Science'} at {user.college or 'University'}."
        )
        db.session.add(profile)

        # Initialize base readiness score
        readiness = ReadinessScore(
            user_id=user.id,
            overall_score=92,
            resume_fit=92,
            github_maturity=88,
            product_storytelling=84,
            system_design=78,
            interview_confidence=94,
            label='Initial Assessment'
        )
        db.session.add(readiness)

        # Initialize progress log
        progress = ProgressLog(
            user_id=user.id,
            week_label='Week 1',
            readiness_score=72,
            skills_score=70,
            interview_score=68,
            activity_type='registration'
        )
        db.session.add(progress)

        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return {
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token,
        }, None

    @staticmethod
    def authenticate_user(email: str, password: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        email = email.strip().lower()
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return None, "Invalid email or password"

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return {
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token,
        }, None

    @staticmethod
    def get_user_profile(user_id: int) -> Optional[Dict[str, Any]]:
        user = db.session.get(User, user_id)
        if not user:
            return None

        profile_data = user.to_dict()
        if user.profile:
            profile_data.update(user.profile.to_dict())

        # Include verified skills
        skills = [s.to_dict() for s in user.user_skills.all()]
        profile_data['skills'] = skills

        # Include projects
        projects = [p.to_dict() for p in user.projects.all()]
        profile_data['projects'] = projects

        return profile_data

    @staticmethod
    def update_user_profile(user_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        user = db.session.get(User, user_id)
        if not user:
            return None

        if 'full_name' in data and data['full_name']:
            user.full_name = data['full_name']
        if 'college' in data:
            user.college = data['college']
        if 'degree' in data:
            user.degree = data['degree']
        if 'branch' in data:
            user.branch = data['branch']
        if 'graduation_year' in data:
            user.graduation_year = data['graduation_year']
        if 'target_role' in data and data['target_role']:
            user.target_role = data['target_role']

        if not user.profile:
            user.profile = UserProfile(user_id=user.id)

        if 'bio' in data:
            user.profile.bio = data['bio']
        if 'github_handle' in data:
            user.profile.github_handle = data['github_handle']
        if 'linkedin_url' in data:
            user.profile.linkedin_url = data['linkedin_url']

        db.session.commit()
        return AuthService.get_user_profile(user_id)
