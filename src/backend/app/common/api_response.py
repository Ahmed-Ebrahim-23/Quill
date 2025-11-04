from flask import jsonify, make_response

def jsend_success(data=None, message=None, status_code=200):
    response_data = {"status": "success", "data": data}
    if message:
        response_data["message"] = message
    return make_response(jsonify(response_data), status_code)

def jsend_fail(data, message=None, status_code=400):
    response_data = {"status": "fail", "data": data}
    if message:
        response_data["message"] = message
    return make_response(jsonify(response_data), status_code)

def jsend_error(message, code=None, data=None, status_code=500):
    response_data = {"status": "error", "message": message}
    if code:
        response_data["code"] = code
    if data:
        response_data["data"] = data
    return make_response(jsonify(response_data), status_code)