from flask import Blueprint, jsonify, request
from Service.adminService import get_all_users, toggle_user_block, delete_user, get_active_users_count, get_total_properties_count,get_messages_last_24_hours

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

@admin_controller.route('/admin/active-users', methods=['GET'])
def get_active_users():
    """ Get count of users active in the last 10 minutes. """
    active_users_count = get_active_users_count()
    return jsonify({"active_users": active_users_count}), 200

@admin_controller.route('/admin/properties-count', methods=['GET'])
def get_properties_count():
    """ Get total count of properties. """
    total_properties = get_total_properties_count()
    return jsonify({"total_properties": total_properties}), 200

@admin_controller.route('/admin/messages-last-24-hours', methods=['GET'])
def get_messages_count():
    """ Get total count of messages sent in the last 24 hours. """
    total_messages = get_messages_last_24_hours()  
    return jsonify({"messages_last_24_hours": total_messages}), 200


