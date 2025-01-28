from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Service import registerService as register
from Service.registerService import check_email_exists_service

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

@register_controller.route('/request-registration-otp', methods=['POST'])
def request_registration_otp():
    """
    Handles POST requests for generating and sending an OTP for user registration.
    """
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required."}), 400

    response, status = register.request_registration_otp_service(email)
    return jsonify(response), status


@register_controller.route('/verify-registration-otp', methods=['POST'])
def verify_registration_otp():
    """
    Handles POST requests for verifying the OTP during user registration.
    """
    data = request.json
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify({"message": "Email and OTP are required."}), 400

    response, status = register.verify_registration_otp_service(email, otp)
    return jsonify(response), status

@register_controller.route('/check-email', methods=['POST'])
def check_email():
    """
    Endpoint to check if an email already exists in the database.
    """
    try:
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({'message': 'Email is required'}), 400

        email_exists = check_email_exists_service(email)
        return jsonify({'exists': email_exists}), 200
    except Exception as e:
        print(f"Error in check-email: {e}")
        return jsonify({'message': 'An error occurred while checking the email.'}), 500
