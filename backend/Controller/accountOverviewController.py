from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Service import accountOverviewService as account_service  # Import merged service file

# Create a blueprint instance for account overview
account_overview_controller = Blueprint('account_overview_controller', __name__)
CORS(account_overview_controller)

# Route to change password
@account_overview_controller.route('/change-password', methods=['PUT'])
def change_password():
    data = request.json
    if not data or 'email' not in data or 'current_password' not in data or 'new_password' not in data:
        return jsonify({"message": "Invalid input data."}), 400  # Validate inputs

    response, status = account_service.change_password_service(data)
    return jsonify(response), status

# Route to delete account
@account_overview_controller.route('/delete-account', methods=['DELETE'])
def delete_account():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"message": "Invalid input data."}), 400

    response, status = account_service.delete_account_service(data)
    return jsonify(response), status

# Route to edit details
@account_overview_controller.route('/edit-details', methods=['PUT'])
def edit_details():
    data = request.json
    if not data or 'email' not in data or not all(k in data for k in ('firstname', 'lastname')):
        return jsonify({"message": "Invalid input data. Ensure all fields are provided."}), 400

    response, status = account_service.edit_details_service(data)
    return jsonify(response), status


@account_overview_controller.route("/upload-profile-image", methods=["POST"])
def upload_profile_image():
    if "file" not in request.files:
        return jsonify({"message": "No file provided"}), 400

    user_id = request.form.get("user_id")  
    file = request.files["file"]

    if not user_id or not file:
        return jsonify({"message": "User ID and file are required"}), 400

    public_url = account_service.upload_profile_image(file, user_id)

    if public_url:
        return jsonify({"message": "Profile image uploaded successfully", "url": public_url}), 200
    else:
        return jsonify({"message": "Failed to upload profile image"}), 500
