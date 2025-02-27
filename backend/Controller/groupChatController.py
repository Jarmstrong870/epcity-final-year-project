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
    
@group_chat_blueprint.route("/send-property-to-group", methods=["POST"])
def send_property_to_group():
    """ Send a property URL to a group chat. """
    data = request.json
    group_id = data.get("group_id")
    property_url = data.get("property_url")
    sender_email = request.headers.get("User-Email")

    if not group_id or not property_url or not sender_email:
        return jsonify({"message": "Group ID, property URL, and sender email are required."}), 400

    try:
        new_message = GroupChatService.send_group_property(group_id, property_url, sender_email)
        return jsonify(new_message), 201
    except Exception as e:
        print(f"Error sending property to group: {e}")
        return jsonify({"message": "Internal server error"}), 500
