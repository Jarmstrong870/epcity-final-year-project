from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Service.accountOverviewService import AccountOverviewService  # Import service layer

# Define a Blueprint for the account overview controller
account_overview_controller = Blueprint('account_overview_controller', __name__)
CORS(account_overview_controller)  # Enable Cross-Origin Resource Sharing

# Endpoint to handle password change requests
@account_overview_controller.route('/change-password', methods=['PUT'])
def change_password():
    """
    Handles requests to change the user's password.
    Expects 'email', 'current_password', and 'new_password' in the JSON body.
    """
    data = request.json
    if not data or 'email' not in data or 'current_password' not in data or 'new_password' not in data:
        return jsonify({"message": "Invalid input data."}), 400

    response, status = AccountOverviewService.change_password(data)
    return jsonify(response), status

# Endpoint to handle account deletion requests
@account_overview_controller.route('/delete-account', methods=['DELETE'])
def delete_account():
    """
    Handles requests to delete the user's account.
    Expects 'email' in the JSON body.
    """
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"message": "Invalid input data."}), 400

    response, status = AccountOverviewService.delete_account(data)
    return jsonify(response), status

# Endpoint to edit user details
@account_overview_controller.route('/edit-details', methods=['PUT'])
def edit_details():
    """
    Handles requests to edit the user's details.
    Expects 'email', 'firstname', and 'lastname' in the JSON body.
    """
    data = request.json
    if not data or 'email' not in data or not all(k in data for k in ('firstname', 'lastname')):
        return jsonify({"message": "Invalid input data. Ensure all fields are provided."}), 400

    response, status = AccountOverviewService.edit_details(data)
    return jsonify(response), status

# Endpoint to upload a profile image
@account_overview_controller.route("/upload-profile-image", methods=["POST"])
def upload_profile_image():
    """
    Handles requests to upload the user's profile image.
    Expects 'email' as a form field and 'file' as the uploaded file.
    """
    if "file" not in request.files:
        return jsonify({"message": "No file provided"}), 400

    email = request.form.get("email")
    file = request.files["file"]

    if not email or not file:
        return jsonify({"message": "Email and file are required"}), 400

    public_url = AccountOverviewService.upload_profile_image(file, email)

    if public_url:
        AccountOverviewService.update_profile_image(email, public_url)
        return jsonify({"message": "Profile image uploaded successfully", "url": public_url}), 200
    else:
        return jsonify({"message": "Failed to upload profile image"}), 500

# Endpoint to retrieve user details
@account_overview_controller.route("/get-user/<email>", methods=["GET"])
def get_user(email):
    """
    Handles requests to fetch user details.
    Expects the user's email as a URL parameter.
    """
    response, status = AccountOverviewService.get_user(email)
    return jsonify(response), status
