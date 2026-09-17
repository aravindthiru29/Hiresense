from functools import wraps
from flask import request, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from pydantic import ValidationError
from app.api.responses import error_response


def validate_json(schema_class):
    """Decorator to validate incoming JSON request payload against a Pydantic schema."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return error_response(
                    code="INVALID_CONTENT_TYPE",
                    message="Request payload must be JSON",
                    status_code=400
                )
            try:
                data = request.get_json() or {}
                validated_data = schema_class(**data)
                g.validated_data = validated_data
            except ValidationError as e:
                errors = []
                for err in e.errors():
                    field = " -> ".join(str(loc) for loc in err["loc"])
                    errors.append(f"{field}: {err['msg']}")
                return error_response(
                    code="VALIDATION_ERROR",
                    message="Invalid input data",
                    status_code=422,
                    details=errors
                )
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def authenticated_user_required():
    """Verify JWT and attach user_id to flask g."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            try:
                g.user_id = int(user_id)
            except (ValueError, TypeError):
                g.user_id = user_id
            return fn(*args, **kwargs)
        return wrapper
    return decorator
