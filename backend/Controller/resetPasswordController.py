from flask import Blueprint, request, jsonify
from Service.resetPasswordService import ResetPasswordService

reset_password_controller = Blueprint('reset_password_controller', __name__)

@reset_password_controller.route('/request-reset-password', methods=['POST'])
def request_reset_password():
    """
    Endpoint to request a password reset by generating and sending an OTP.
    """
    try:
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({'message': 'Email is required'}), 400

        # Call the service to request a password reset
        response, status = ResetPasswordService.request_password_reset(email)
        return jsonify(response), status
    except Exception as e:
        print(f"Error in request-reset-password: {e}")
        return jsonify({'message': 'An error occurred while processing your request.'}), 500


@reset_password_controller.route('/verify-otp', methods=['POST'])
def verify_otp():
    """
    Endpoint to verify the OTP provided by the user.
    """
    try:
        data = request.json
        email = data.get('email')
        otp = data.get('otp')

        if not email or not otp:
            return jsonify({'message': 'Email and OTP are required.'}), 400

        # Call the service to verify OTP
        is_valid, status = ResetPasswordService.verify_otp(email, otp)
        return jsonify({'message': 'OTP verified successfully.' if is_valid else 'Invalid or expired OTP.'}), status
    except Exception as e:
        print(f"Error in verify-otp: {e}")
        return jsonify({'message': 'An error occurred while verifying OTP.'}), 500


@reset_password_controller.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Endpoint to reset the password after OTP verification.
    """
    try:
        data = request.json
        email = data.get('email')
        new_password = data.get('newPassword')

        if not email or not new_password:
            return jsonify({'message': 'Email and new password are required.'}), 400

        # Call the service to reset the password
        response, status = ResetPasswordService.reset_password(email, new_password)
        return jsonify(response), status
    except Exception as e:
        print(f"Error in reset-password: {e}")
        return jsonify({'message': 'An error occurred while resetting your password.'}), 500
