from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.utils.validators import ProfileUpdateSchema
from app.utils.decorators import validate_json
from app.services.auth_service import AuthService

users_bp = Blueprint('users', __name__, url_prefix='/api/profile')


@users_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    profile = AuthService.get_user_profile(user_id)
    if not profile:
        return error_response(code="USER_NOT_FOUND", message="Profile not found", status_code=404)
    return success_response(data=profile)


@users_bp.route('', methods=['PUT'])
@jwt_required()
@validate_json(ProfileUpdateSchema)
def update_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    updated = AuthService.update_user_profile(user_id, data)
    if not updated:
        return error_response(code="UPDATE_FAILED", message="Failed to update profile", status_code=400)
    return success_response(data=updated, message="Profile updated successfully")
