from flask import Blueprint
from .api_response import jsend_error, jsend_fail
from werkzeug.exceptions import HTTPException

errors_bp = Blueprint('errors', __name__)


@errors_bp.errorhandler(HTTPException)
def handle_http_exception(e):
    payload = {
        "name": e.name,
        "description": e.description,
    }
    if 400 <= e.code < 500:
        return jsend_fail(payload, status_code=e.code)
    else:
        return jsend_error(e.description or e.name, code=e.code, data=payload, status_code=e.code)


@errors_bp.errorhandler(ValueError)
def handle_value_error(e):
    payload = {
        "name": "Bad Request",
        "description": str(e)
    }
    return jsend_fail(payload, status_code=400)


@errors_bp.errorhandler(Exception)
def handle_generic_exception(e):
    return jsend_error("Internal Server Error", code=500, data={
        "description": str(e)
    }, status_code=500)

