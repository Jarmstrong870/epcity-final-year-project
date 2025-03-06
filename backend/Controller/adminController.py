from flask import Blueprint, jsonify, request
from Service.adminService import get_all_users, toggle_user_block, delete_user

admin_controller = Blueprint("admin_controller", __name__)

@admin_controller.route("/admin/get-users", methods=["GET"])
def fetch_users():
    users = get_all_users()
    return jsonify(users), 200

@admin_controller.route("/admin/toggle-block/<email>", methods=["PATCH"])
def block_user(email):
    success = toggle_user_block(email)
    if success:
        return jsonify({"message": "User block status updated"}), 200
    return jsonify({"error": "Failed to update user status"}), 400

@admin_controller.route("/admin/delete-user/<email>", methods=["DELETE", "OPTIONS"])
def delete_users(email):
    """ Endpoint to delete a user """
    success = delete_user(email)
    return jsonify({"message": "User deleted" if success else "Failed to delete user"}), 200 if success else 500

