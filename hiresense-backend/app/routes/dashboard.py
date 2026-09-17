from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.services.dashboard_service import DashboardService

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_id = int(get_jwt_identity())
    data = DashboardService.get_dashboard_data(user_id)
    if not data:
        return error_response(code="NOT_FOUND", message="Dashboard data not available", status_code=404)
    return success_response(data=data)
