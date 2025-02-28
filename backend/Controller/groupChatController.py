from flask import Blueprint, request, jsonify
from Service.groupChatService import GroupChatService

# Create a Blueprint for group chat routes
group_chat_blueprint = Blueprint("group_chat", __name__)

@group_chat_blueprint.route("/get-groups", methods=["GET"])
def get_groups():
    """ Retrieve groups for the logged-in user. """
    user_email = request.headers.get("User-Email")

    if not user_email:
        print("❌ Error: User email not provided in headers")
        return jsonify({"message": "Unauthorized. User email not provided."}), 401

    try:
        print(f"✅ Fetching groups for: {user_email}")  # Debugging Log
        groups = GroupChatService.get_groups(user_email)
        return jsonify(groups), 200
    except Exception as e:
        print(f"❌ Error fetching groups: {e}")
        return jsonify({"message": "Internal server error"}), 500

@group_chat_blueprint.route("/create-group", methods=["POST"])
def create_group():
    """ Create a new group chat. """
    user_email = request.headers.get("User-Email")

    if not user_email:
        return jsonify({"message": "Unauthorized. User email not provided."}), 401

    data = request.json
    group_name = data.get("name")
    members = data.get("members", [])

    if not group_name or not members:
        return jsonify({"message": "Group name and members are required."}), 400

    try:
        new_group = GroupChatService.create_group(group_name, members, user_email)
        return jsonify(new_group), 201
    except Exception as e:
        print(f"Error creating group: {e}")
        return jsonify({"message": "Internal server error"}), 500

@group_chat_blueprint.route("/get-group-messages/<int:group_id>", methods=["GET"])
def get_group_messages(group_id):
    """ Retrieve messages for a specific group. """
    try:
        messages = GroupChatService.get_group_messages(group_id)
        return jsonify(messages), 200
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return jsonify({"message": "Internal server error"}), 500


@group_chat_blueprint.route("/send-group-message", methods=["POST"])
def send_group_message():
    """ Send a message to a group chat. """
    data = request.json
    group_id = data.get("group_id")
    content = data.get("content")
    sender_email = request.headers.get("User-Email")

    if not group_id or not content:
        return jsonify({"message": "Group ID and content are required."}), 400

    try:
        new_message, status_code = GroupChatService.send_group_message(group_id, content, sender_email)
        return jsonify(new_message), status_code
    except Exception as e:
        print(f"Error sending message: {e}")
        return jsonify({"message": "Internal server error"}), 500
    
@group_chat_blueprint.route("/delete-group", methods=["DELETE"])
def delete_group():
    """ Delete group and all data """
    user_email = request.headers.get("User-Email")
    data = request.json
    group_id = data.get("group_id")

    if not user_email:
        return jsonify({"message": "Unauthorized. User email not provided."}), 401

    if not group_id:
        return jsonify({"message": "Group ID is required."}), 400

    try:
        deleted_group = GroupChatService.delete_group_data(group_id, user_email)
        return jsonify(deleted_group), 200
    except Exception as e:
        print(f"Error creating group: {e}")
        return jsonify({"message": "Internal server error"}), 500

@group_chat_blueprint.route("/edit-group-name", methods=["PUT"])
def edit_group_name():
    """ Edit existing group name """
    user_email = request.headers.get("User-Email")
    data = request.json
    group_id = data.get("group_id")
    update_name = data.get("update_name")

    if not user_email:
        return jsonify({"message": "Unauthorized. User email not provided."}), 401

    if not group_id or not update_name:
        return jsonify({"message": "Group ID is required."}), 400

    try:
        updated_group_name = GroupChatService.edit_group_name(group_id, update_name, user_email)
        return jsonify(updated_group_name), 200
    except Exception as e:
        print(f"Error creating group: {e}")
        return jsonify({"message": "Internal server error"}), 500
    
@group_chat_blueprint.route("/exit-group", methods=["POST"])
def exit_group():
    """ Exit existing group """
    user_email = request.headers.get("User-Email")
    data = request.json
    group_id = data.get("group_id")

    if not user_email:
        return jsonify({"message": "Unauthorized. User email not provided."}), 401

    if not group_id:
        return jsonify({"message": "Group ID is required."}), 400

    try:
        exit_group = GroupChatService.exit_group(group_id, user_email)
        return jsonify(exit_group), 200
    except Exception as e:
        print(f"Error creating group: {e}")
        return jsonify({"message": "Internal server error"}), 500
    
@group_chat_blueprint.route("/get-all-group-members/<int:group_id>", methods=["GET"])
def get_all_group_members(group_id):
    """ Retrieve all team members from a specified group. """
    try:
        members = GroupChatService.get_all_group_members(group_id)
        return jsonify(members), 200
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return jsonify({"message": "Internal server error"}), 500
    
@group_chat_blueprint.route("/search-group-message", methods=["POST"])
def search_group_message():
    """ Retrieve messages based on a specific searched term. """
    data = request.json
    user_email = request.headers.get("User-Email")
    group_id = data.get("group_id")
    content = data.get("content")

    if not group_id or not content:
        return jsonify({"message": "Group ID and content are required."}), 400

    try:
        searched_message = GroupChatService.search_group_message(group_id, content)
        return jsonify(searched_message), 200
    except Exception as e:
        print(f"Error sending message: {e}")
        return jsonify({"message": "Internal server error"}), 500

@group_chat_blueprint.route("/add-new-member", methods=["POST"])
def add_new_member():
    """ Adds new member to team based on group name. """
    data = request.json
    group_id = data.get("group_id")
    user_email = data.get("user_email")

    if not group_id:
        return jsonify({"message": "Group ID is required."}), 400
    
    if not user_email:
        return jsonify({"message": "User email is required."}), 400

    try:
        added_member = GroupChatService.add_new_member(group_id, user_email)
        return jsonify(added_member), 200
    except Exception as e:
        print(f"Error adding new member: {e}")
        return jsonify({"message": "Internal server error"}), 500
    



