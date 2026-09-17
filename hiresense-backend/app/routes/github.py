from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.services.github_service import GitHubService
from app.models import User
from app.extensions import db

github_bp = Blueprint('github', __name__, url_prefix='/api/github')


@github_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    username = user.profile.github_handle if user and user.profile and user.profile.github_handle else 'aravind-t'
    result = GitHubService.analyze_profile(username)
    return success_response(data=result)


@github_bp.route('/repositories', methods=['GET'])
@jwt_required()
def get_repositories():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    username = user.profile.github_handle if user and user.profile and user.profile.github_handle else 'aravind-t'
    result = GitHubService.analyze_profile(username)
    return success_response(data=result.get('audited_repositories', []))


@github_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze():
    body = request.get_json() or {}
    username = body.get('username', 'aravind-t')
    if not username.strip():
        return error_response(code="EMPTY_USERNAME", message="GitHub username cannot be empty", status_code=400)
    result = GitHubService.analyze_profile(username)
    return success_response(data=result, message="GitHub profile analyzed")
