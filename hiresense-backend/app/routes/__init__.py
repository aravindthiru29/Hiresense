from app.routes.auth import auth_bp
from app.routes.users import users_bp
from app.routes.resume import resume_bp
from app.routes.dashboard import dashboard_bp
from app.routes.assessment import assessment_bp
from app.routes.interview import interview_bp
from app.routes.viva import viva_bp
from app.routes.readiness import readiness_bp
from app.routes.roadmap import roadmap_bp
from app.routes.reports import reports_bp
from app.routes.github import github_bp
from app.routes.progress import progress_bp

__all__ = [
    'auth_bp',
    'users_bp',
    'resume_bp',
    'dashboard_bp',
    'assessment_bp',
    'interview_bp',
    'viva_bp',
    'readiness_bp',
    'roadmap_bp',
    'reports_bp',
    'github_bp',
    'progress_bp',
]
