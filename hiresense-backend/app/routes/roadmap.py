from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response
from app.services.roadmap_service import RoadmapService

roadmap_bp = Blueprint('roadmap', __name__, url_prefix='/api/roadmap')


@roadmap_bp.route('', methods=['GET'])
@jwt_required()
def get_roadmap():
    user_id = int(get_jwt_identity())
    roadmap = RoadmapService.get_or_create_roadmap(user_id)
    return success_response(data=roadmap)


@roadmap_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_roadmap():
    user_id = int(get_jwt_identity())
    roadmap = RoadmapService.get_or_create_roadmap(user_id)
    return success_response(data=roadmap, message="Roadmap generated successfully")


@roadmap_bp.route('/<int:task_id>/progress', methods=['PUT'])
@jwt_required()
def update_progress(task_id: int):
    user_id = int(get_jwt_identity())
    body = request.get_json() or {}
    is_completed = body.get('is_completed', True)

    updated = RoadmapService.update_task_progress(user_id, task_id, is_completed)
    return success_response(data=updated, message="Task progress updated")
