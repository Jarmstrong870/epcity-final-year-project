from flask import Blueprint, request, jsonify
from flask_cors import CORS
from psycopg2 import connect
from Service import accountOverviewService as account_service  # Import merged service file
import os

account_overview_controller = Blueprint('account_overview_controller', __name__)
CORS(account_overview_controller)

db_config = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

@account_overview_controller.route('/change-password', methods=['PUT'])
def change_password():
    data = request.json
    if not data or 'email' not in data or 'current_password' not in data or 'new_password' not in data:
        return jsonify({"message": "Invalid input data."}), 400  # Validate inputs

    response, status = account_service.change_password_service(data)
    return jsonify(response), status

@account_overview_controller.route('/delete-account', methods=['DELETE'])
def delete_account():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"message": "Invalid input data."}), 400

    response, status = account_service.delete_account_service(data)
    return jsonify(response), status

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

    email = request.form.get("email")
    file = request.files["file"]

    if not email or not file:
        return jsonify({"message": "Email and file are required"}), 400

    public_url = account_service.upload_profile_image(file, email)

    if public_url:
        # Update the user's profile image URL in the database
        account_service.update_user_profile_image(email, public_url)
        return jsonify({"message": "Profile image uploaded successfully", "url": public_url}), 200
    else:
        return jsonify({"message": "Failed to upload profile image"}), 500

@account_overview_controller.route("/get-user/<email>", methods=["GET"])
def get_user(email):
    try:
        connection = connect(**db_config)
        cursor = connection.cursor()

        cursor.execute(
            "SELECT firstname, lastname, email_address, profile_image_url FROM users WHERE email_address = %s;",
            (email,)
        )
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            return jsonify({
                "firstname": user[0],
                "lastname": user[1],
                "email": user[2],
                "profile_image_url": user[3]
            }), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return jsonify({"message": "An error occurred while fetching user data"}), 500



