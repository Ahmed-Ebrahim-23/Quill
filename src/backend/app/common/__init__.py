from .errors import (
    handle_generic_exception,
    handle_value_error,
    handle_http_exception

)
from werkzeug.exceptions import NotFound, BadRequest, InternalServerError

def register_error_handlers(app):
    """Registers all custom error handlers with the Flask app."""
    app.register_error_handler(NotFound, handle_http_exception)
    app.register_error_handler(BadRequest, handle_http_exception)
    app.register_error_handler(InternalServerError, handle_http_exception)
    app.register_error_handler(ValueError, handle_value_error)
    app.register_error_handler(Exception, handle_generic_exception)