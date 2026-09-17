import os
import logging
from flask import Flask, jsonify
from app.config import config_by_name
from app.extensions import db, migrate, jwt, cors
from app.api.responses import error_response


def create_app(config_name: str = 'development') -> Flask:
    """Application factory for HireSense Flask REST API."""
    app = Flask(__name__)

    # Load configuration
    config_class = config_by_name.get(config_name, config_by_name['default'])
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False

    # Configure Logging
    logging.basicConfig(
        level=logging.INFO if not app.debug else logging.DEBUG,
        format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    )
    logger = logging.getLogger('hiresense')
    logger.info("Initializing HireSense Backend (%s mode)...", config_name)

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Configure CORS - allows frontend dev server and production domains
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS', ['http://localhost:5173'])}},
        supports_credentials=True
    )

    # Ensure Uploads Directory exists
    upload_folder = app.config.get('UPLOAD_FOLDER')
    if upload_folder:
        os.makedirs(upload_folder, exist_ok=True)

    # Register Blueprints
    from app.routes import (
        auth_bp,
        users_bp,
        resume_bp,
        dashboard_bp,
        assessment_bp,
        interview_bp,
        viva_bp,
        readiness_bp,
        roadmap_bp,
        reports_bp,
        github_bp,
        progress_bp,
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(assessment_bp)
    app.register_blueprint(interview_bp)
    app.register_blueprint(viva_bp)
    app.register_blueprint(readiness_bp)
    app.register_blueprint(roadmap_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(github_bp)
    app.register_blueprint(progress_bp)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'HireSense AI Backend',
            'version': '1.0.0',
            'database': 'connected',
        }), 200

    # JWT Error Handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return error_response(code="TOKEN_EXPIRED", message="Authentication token has expired", status_code=401)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return error_response(code="INVALID_TOKEN", message="Signature verification failed", status_code=401)

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return error_response(code="AUTHORIZATION_REQUIRED", message="Authorization header with Bearer token is required", status_code=401)

    # Centralized HTTP Error Handlers
    @app.errorhandler(400)
    def bad_request_error(e):
        return error_response(code="BAD_REQUEST", message=str(e.description if hasattr(e, 'description') else "Bad request"), status_code=400)

    @app.errorhandler(401)
    def unauthorized_error(e):
        return error_response(code="UNAUTHORIZED", message="Authentication required", status_code=401)

    @app.errorhandler(403)
    def forbidden_error(e):
        return error_response(code="FORBIDDEN", message="Permission denied", status_code=403)

    @app.errorhandler(404)
    def not_found_error(e):
        return error_response(code="NOT_FOUND", message="Requested resource was not found", status_code=404)

    @app.errorhandler(409)
    def conflict_error(e):
        return error_response(code="CONFLICT", message="Resource conflict", status_code=409)

    @app.errorhandler(413)
    def file_too_large_error(e):
        return error_response(code="FILE_TOO_LARGE", message="File exceeds maximum allowed upload size (10 MB)", status_code=413)

    @app.errorhandler(422)
    def unprocessable_entity_error(e):
        return error_response(code="VALIDATION_ERROR", message="Unprocessable request payload", status_code=422)

    @app.errorhandler(500)
    def internal_server_error(e):
        logger.error("Internal Server Error: %s", str(e), exc_info=True)
        return error_response(code="INTERNAL_SERVER_ERROR", message="An unexpected server error occurred", status_code=500)

    # Auto-create tables in development for instant zero-config startup
    with app.app_context():
        try:
            db.create_all()
        except Exception as ex:
            logger.warning("Auto db.create_all() skipped or failed: %s", str(ex))

    return app
