from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.responses import success_response, error_response
from app.utils.validators import RegisterSchema, LoginSchema
from app.utils.decorators import validate_json
from app.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
@validate_json(RegisterSchema)
def register():
    data = request.get_json()
    result, err = AuthService.register_user(data)
    if err:
        return error_response(code="REGISTRATION_FAILED", message=err, status_code=409)
    return success_response(data=result, message="Registration successful", status_code=201)


@auth_bp.route('/login', methods=['POST'])
@validate_json(LoginSchema)
def login():
    data = request.get_json()
    result, err = AuthService.authenticate_user(data['email'], data['password'])
    if err:
        return error_response(code="INVALID_CREDENTIALS", message=err, status_code=401)
    return success_response(data=result, message="Login successful")


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    from flask_jwt_extended import create_access_token
    identity = get_jwt_identity()
    new_token = create_access_token(identity=identity)
    return success_response(data={'access_token': new_token}, message="Token refreshed")


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    profile = AuthService.get_user_profile(user_id)
    if not profile:
        return error_response(code="USER_NOT_FOUND", message="User profile not found", status_code=404)
    return success_response(data=profile)


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In standard stateless JWT, client deletes token. Endpoint acknowledges.
    return success_response(message="Logged out successfully")
