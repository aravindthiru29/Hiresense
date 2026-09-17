from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.services.interview_service import InterviewService
from app.models import InterviewSession

interview_bp = Blueprint('interview', __name__, url_prefix='/api/interview')


@interview_bp.route('/start', methods=['POST'])
@jwt_required()
def start():
    user_id = int(get_jwt_identity())
    body = request.get_json() or {}
    round_type = body.get('round_type', 'behavioral')
    company = body.get('company', 'Google')

    result = InterviewService.start_interview(user_id, round_type=round_type, company=company)
    return success_response(data=result, message="Interview session started", status_code=201)


@interview_bp.route('/<int:session_id>/answer', methods=['POST'])
@jwt_required()
def submit_answer(session_id: int):
    user_id = int(get_jwt_identity())
    body = request.get_json() or {}
    question = body.get('question', '')
    answer = body.get('answer', '')
    round_type = body.get('round_type', 'behavioral')

    if not answer.strip():
        return error_response(code="EMPTY_ANSWER", message="Answer text cannot be empty", status_code=400)

    result = InterviewService.evaluate_response(user_id, session_id, question, answer, round_type)
    return success_response(data=result, message="Interview answer evaluated")


@interview_bp.route('/<int:session_id>/complete', methods=['POST'])
@jwt_required()
def complete(session_id: int):
    user_id = int(get_jwt_identity())
    session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return error_response(code="NOT_FOUND", message="Session not found", status_code=404)
    session.status = 'completed'
    from app.extensions import db
    db.session.commit()
    return success_response(data=session.to_dict(), message="Session completed")


@interview_bp.route('/<int:session_id>/result', methods=['GET'])
@jwt_required()
def result(session_id: int):
    user_id = int(get_jwt_identity())
    session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return error_response(code="NOT_FOUND", message="Session not found", status_code=404)

    evals = [e.to_dict() for e in session.evaluations.all()]
    data = session.to_dict()
    data['evaluations'] = evals
    return success_response(data=data)


@interview_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = int(get_jwt_identity())
    sessions = InterviewService.get_history(user_id)
    return success_response(data=sessions)
