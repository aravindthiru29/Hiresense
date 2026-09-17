from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.services.assessment_service import AssessmentService
from app.models import Assessment
from app.utils.validators import AssessmentAnswerSchema
from app.utils.decorators import validate_json

assessment_bp = Blueprint('assessment', __name__, url_prefix='/api/assessment')


@assessment_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate():
    user_id = int(get_jwt_identity())
    result, err = AssessmentService.generate_assessment(user_id)
    if err:
        return error_response(code="GENERATION_FAILED", message=err, status_code=400)
    return success_response(data=result, message="Assessment generated successfully", status_code=201)


@assessment_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current():
    user_id = int(get_jwt_identity())
    data = AssessmentService.get_current_or_create(user_id)
    return success_response(data=data)


@assessment_bp.route('/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_by_id(assessment_id: int):
    user_id = int(get_jwt_identity())
    assessment = Assessment.query.filter_by(id=assessment_id, user_id=user_id).first()
    if not assessment:
        return error_response(code="NOT_FOUND", message="Assessment not found", status_code=404)

    questions = [q.to_dict() for q in assessment.questions.all()]
    data = assessment.to_dict()
    data['questions'] = questions
    return success_response(data=data)


@assessment_bp.route('/<int:assessment_id>/answer', methods=['POST'])
@jwt_required()
@validate_json(AssessmentAnswerSchema)
def submit_answer(assessment_id: int):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    result, err = AssessmentService.submit_answer(
        user_id=user_id,
        assessment_id=assessment_id,
        question_id=data['question_id'],
        answer_text=data['answer_text']
    )
    if err:
        return error_response(code="EVALUATION_FAILED", message=err, status_code=400)
    return success_response(data=result, message="Answer evaluated successfully")


@assessment_bp.route('/<int:assessment_id>/submit', methods=['POST'])
@jwt_required()
def complete_assessment(assessment_id: int):
    user_id = int(get_jwt_identity())
    result, err = AssessmentService.complete_assessment(user_id, assessment_id)
    if err:
        return error_response(code="COMPLETION_FAILED", message=err, status_code=400)
    return success_response(data=result, message="Assessment completed successfully")


@assessment_bp.route('/<int:assessment_id>/result', methods=['GET'])
@jwt_required()
def get_result(assessment_id: int):
    user_id = int(get_jwt_identity())
    assessment = Assessment.query.filter_by(id=assessment_id, user_id=user_id).first()
    if not assessment:
        return error_response(code="NOT_FOUND", message="Assessment not found", status_code=404)

    answers = [a.to_dict() for a in assessment.answers.all()]
    data = assessment.to_dict()
    data['answers'] = answers
    return success_response(data=data)


@assessment_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    assessments = Assessment.query.filter_by(user_id=user_id).order_by(Assessment.created_at.desc()).all()
    return success_response(data=[a.to_dict() for a in assessments])
