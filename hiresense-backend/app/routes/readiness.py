from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response
from app.services.readiness_service import ReadinessService

readiness_bp = Blueprint('readiness', __name__, url_prefix='/api/readiness')


@readiness_bp.route('', methods=['GET'])
@jwt_required()
def get_readiness():
    user_id = int(get_jwt_identity())
    data = ReadinessService.get_user_readiness(user_id)
    return success_response(data=data)


@readiness_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    history_data = ReadinessService.get_readiness_history(user_id)
    return success_response(data=history_data)


@readiness_bp.route('/breakdown', methods=['GET'])
@jwt_required()
def get_breakdown():
    user_id = int(get_jwt_identity())
    data = ReadinessService.get_user_readiness(user_id)
    return success_response(data=data.get('pillars', []))


@readiness_bp.route('/skill-verification', methods=['GET'])
@jwt_required()
def get_skill_verification():
    user_id = int(get_jwt_identity())
    matrix = ReadinessService.get_skill_verification(user_id)
    return success_response(data=matrix)
