from flask import jsonify
from typing import Any, Optional


def success_response(
    data: Any = None,
    message: str = "Operation successful",
    status_code: int = 200,
    meta: Optional[dict] = None
):
    """
    Standardized success response wrapper.
    """
    payload = {
        "success": True,
        "data": data if data is not None else {},
        "message": message,
    }
    if meta is not None:
        payload["meta"] = meta
    return jsonify(payload), status_code


def error_response(
    code: str = "ERROR",
    message: str = "An error occurred",
    status_code: int = 400,
    details: Any = None
):
    """
    Standardized error response wrapper.
    """
    error_body = {
        "code": code,
        "message": message,
    }
    if details is not None:
        error_body["details"] = details

    return jsonify({
        "success": False,
        "error": error_body
    }), status_code
