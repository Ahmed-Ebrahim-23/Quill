from flask import Blueprint
from ..common.api_response import jsend_success

main_bp = Blueprint('main', __name__)

@main_bp.route("/")
def index():
    return jsend_success(data=None, message="Quill backend running", status_code=200)
