from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Service import registerService as register

# Create a blueprint instance for registration
register_controller = Blueprint('register_controller', __name__)
CORS(register_controller)

@register_controller.route('/register', methods=['POST'])
def register_user():
    """
    Handles POST requests for user registration.
    """
    data = request.json
    if not data or 'email' not in data or 'password' not in data or 'firstname' not in data or 'lastname' not in data:
        return jsonify({"message": "Invalid input data."}), 400  # Added input validation
    
    response, status = register.register_user_service(data)
    return jsonify(response), status