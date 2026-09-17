from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response
from app.services.reports_service import ReportsService

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')


@reports_bp.route('', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = int(get_jwt_identity())
    report_data = ReportsService.get_full_report(user_id)
    return success_response(data=report_data)


@reports_bp.route('/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report_by_id(report_id: int):
    user_id = int(get_jwt_identity())
    report_data = ReportsService.get_full_report(user_id)
    report_data['report_id'] = report_id
    return success_response(data=report_data)
