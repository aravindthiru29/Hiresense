from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response
from app.services.readiness_service import ReadinessService
from app.models import ProgressLog

progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')


@progress_bp.route('', methods=['GET'])
@jwt_required()
def get_progress():
    user_id = int(get_jwt_identity())
    logs = ProgressLog.query.filter_by(user_id=user_id).order_by(ProgressLog.log_date.asc()).all()
    history = [l.to_dict() for l in logs] if logs else ReadinessService.get_readiness_history(user_id)
    return success_response(data=history)


@progress_bp.route('/skills', methods=['GET'])
@jwt_required()
def get_skills_progress():
    user_id = int(get_jwt_identity())
    matrix = ReadinessService.get_skill_verification(user_id)
    return success_response(data=matrix)


@progress_bp.route('/readiness', methods=['GET'])
@jwt_required()
def get_readiness_progress():
    user_id = int(get_jwt_identity())
    history = ReadinessService.get_readiness_history(user_id)
    return success_response(data=history)
