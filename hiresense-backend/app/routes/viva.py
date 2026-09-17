from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.services.viva_service import VivaService
from app.models import ProjectViva

viva_bp = Blueprint('viva', __name__, url_prefix='/api/viva')


@viva_bp.route('/start', methods=['POST'])
@jwt_required()
def start():
    user_id = int(get_jwt_identity())
    body = request.get_json() or {}
    project_name = body.get('project_name', 'Smart Crop Monitoring System')
    result = VivaService.start_viva(user_id, project_name)
    return success_response(data=result, message="Viva session initialized", status_code=201)


@viva_bp.route('/<int:viva_id>/answer', methods=['POST'])
@jwt_required()
def answer(viva_id: int):
    user_id = int(get_jwt_identity())
    body = request.get_json() or {}
    question = body.get('question', '')
    ans_text = body.get('answer', '')

    if not ans_text.strip():
        return error_response(code="EMPTY_ANSWER", message="Answer text cannot be empty", status_code=400)

    result = VivaService.submit_viva_answer(user_id, viva_id, question, ans_text)
    return success_response(data=result, message="Viva answer evaluated")


@viva_bp.route('/<int:viva_id>/complete', methods=['POST'])
@jwt_required()
def complete(viva_id: int):
    user_id = int(get_jwt_identity())
    viva = ProjectViva.query.filter_by(id=viva_id, user_id=user_id).first()
    if not viva:
        return error_response(code="NOT_FOUND", message="Viva not found", status_code=404)
    viva.status = 'completed'
    from app.extensions import db
    db.session.commit()
    return success_response(data=viva.to_dict(), message="Viva completed")


@viva_bp.route('/<int:viva_id>/result', methods=['GET'])
@jwt_required()
def result(viva_id: int):
    user_id = int(get_jwt_identity())
    viva = ProjectViva.query.filter_by(id=viva_id, user_id=user_id).first()
    if not viva:
        return error_response(code="NOT_FOUND", message="Viva not found", status_code=404)

    evals = [e.to_dict() for e in viva.evaluations.all()]
    data = viva.to_dict()
    data['evaluations'] = evals
    return success_response(data=data)


@viva_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = int(get_jwt_identity())
    vivas = VivaService.get_viva_history(user_id)
    return success_response(data=vivas)
