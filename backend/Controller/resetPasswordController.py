from flask import Blueprint, request, jsonify
from Service.resetPasswordService import ResetPasswordService

reset_password_controller = Blueprint('reset_password_controller', __name__)
reset_password_service = ResetPasswordService()

@reset_password_controller.route('/request-reset-password', methods=['POST'])
@reset_password_controller.route('/request-reset-password', methods=['POST'])
def request_reset_password():
    """
    Endpoint to request a password reset by generating and sending an OTP.
    """
    try:
        data = request.json
        email = data.get('email')

        # Validate email
        if not email:
            return jsonify({'message': 'Email is required'}), 400

        # Delegate the process to the service class
        response = reset_password_service.request_password_reset(email)
        return jsonify(response[0]), response[1]
    except Exception as e:
        print(f"Error in request-reset-password: {e}")
        return jsonify({'message': 'An error occurred while processing your request.'}), 500

@reset_password_controller.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Endpoint to reset the password directly after OTP verification.
    """
    try:
        data = request.json
        email = data.get('email')
        new_password = data.get('newPassword')

        # Validate input
        if not email or not new_password:
            return jsonify({'message': 'Email and new password are required.'}), 400

        # Delegate to the service to update the password
        response, status_code = reset_password_service.update_password(email, new_password)
        return jsonify(response), status_code
    except Exception as e:
        print(f"Error in reset-password: {e}")
        return jsonify({'message': 'An error occurred while resetting your password.'}), 500

@reset_password_controller.route('/verify-otp', methods=['POST'])
def verify_otp():
    """
    Endpoint to verify the OTP provided by the user.
    """
    try:
        data = request.json
        email = data.get('email')
        otp = data.get('otp')

        # Validate inputs
        if not email or not otp:
            return jsonify({'message': 'Email and OTP are required.'}), 400

        # Verify OTP
        is_valid = reset_password_service.verify_reset_otp(email, otp)
        if is_valid:
            return jsonify({'message': 'OTP verified successfully.'}), 200
        else:
            return jsonify({'message': 'Invalid or expired OTP.'}), 400
    except Exception as e:
        print(f"Error in verify-otp: {e}")
        return jsonify({'message': 'An error occurred while verifying OTP.'}), 500