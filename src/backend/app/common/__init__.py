from .errors import (
    handle_generic_exception,
    handle_value_error,
    handle_http_exception

)
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    """Registers all custom error handlers with the Flask app."""
    app.register_error_handler(HTTPException, handle_http_exception)
    app.register_error_handler(ValueError, handle_value_error)
    app.register_error_handler(Exception, handle_generic_exception)