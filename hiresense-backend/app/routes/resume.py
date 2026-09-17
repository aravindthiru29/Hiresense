import os
import uuid
from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.utils.helpers import allowed_file, safe_filename
from app.services.resume_analyzer import ResumeAnalyzerService
from app.models import Resume
from app.extensions import db

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resume')


@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    user_id = int(get_jwt_identity())

    file = request.files.get('file') or request.files.get('resume')
    if not file:
        return error_response(code="NO_FILE", message="No file provided in request", status_code=400)
    if file.filename == '':
        return error_response(code="EMPTY_FILENAME", message="No file selected", status_code=400)

    allowed = current_app.config.get('ALLOWED_EXTENSIONS', {'pdf', 'docx', 'doc'})
    if not allowed_file(file.filename, allowed):
        return error_response(
            code="INVALID_FILE_TYPE",
            message=f"Invalid file extension. Allowed formats: {', '.join(allowed).upper()}",
            status_code=400
        )

    # Validate size
    file.seek(0, os.SEEK_END)
    size_bytes = file.tell()
    file.seek(0)

    max_size = current_app.config.get('MAX_CONTENT_LENGTH', 10 * 1024 * 1024)
    if size_bytes > max_size:
        return error_response(code="FILE_TOO_LARGE", message="File exceeds 10 MB maximum limit", status_code=413)

    # Save securely
    upload_dir = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_dir, exist_ok=True)

    orig_name = safe_filename(file.filename)
    unique_name = f"{user_id}_{uuid.uuid4().hex[:8]}_{orig_name}"
    target_path = os.path.join(upload_dir, unique_name)
    file.save(target_path)

    # Run analysis pipeline
    analysis, err = ResumeAnalyzerService.process_and_analyze_resume(
        user_id=user_id,
        file_path=target_path,
        filename=orig_name,
        file_size_bytes=size_bytes
    )

    if err:
        return error_response(code="ANALYSIS_FAILED", message=err, status_code=422)

    return success_response(data=analysis, message="Resume uploaded and analyzed successfully", status_code=201)


@resume_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current_resume():
    user_id = int(get_jwt_identity())
    resume = Resume.query.filter_by(user_id=user_id, is_active=True).first()
    if not resume:
        return success_response(data=None, message="No active resume found")
    return success_response(data=resume.to_dict())


@resume_bp.route('/analysis', methods=['GET'])
@jwt_required()
def get_resume_analysis():
    user_id = int(get_jwt_identity())
    analysis = ResumeAnalyzerService.get_current_analysis(user_id)
    if not analysis:
        return error_response(code="NOT_FOUND", message="No resume data available", status_code=404)
    return success_response(data=analysis)


@resume_bp.route('/analyze', methods=['POST'])
@jwt_required()
def reanalyze_resume():
    user_id = int(get_jwt_identity())
    resume = Resume.query.filter_by(user_id=user_id, is_active=True).first()
    if not resume:
        analysis = ResumeAnalyzerService.get_current_analysis(user_id)
        return success_response(data=analysis, message="Re-analysis complete")

    analysis, err = ResumeAnalyzerService.process_and_analyze_resume(
        user_id=user_id,
        file_path=resume.file_path,
        filename=resume.filename,
        file_size_bytes=resume.file_size_bytes
    )
    if err:
        return error_response(code="ANALYSIS_FAILED", message=err, status_code=422)

    return success_response(data=analysis, message="Re-analysis complete")


@resume_bp.route('', methods=['DELETE'])
@jwt_required()
def delete_resume():
    user_id = int(get_jwt_identity())
    resumes = Resume.query.filter_by(user_id=user_id).all()
    for r in resumes:
        if os.path.exists(r.file_path):
            try:
                os.remove(r.file_path)
            except Exception:
                pass
        db.session.delete(r)
    db.session.commit()
    return success_response(message="Resume removed successfully")
