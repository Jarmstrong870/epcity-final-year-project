from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Service import loginService as login

# Create a blueprint instance for login
login_controller = Blueprint('login_controller', __name__)
CORS(login_controller)

# Route to login
@login_controller.route('/login', methods=['POST'])
def login_user():
    print("Login endpoint called")  # Debug statement
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Invalid input data."}), 400  # Added input validation
   
    response, status = login.login_user_service(data)
    return jsonify(response), status
