from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit
from Controller.propertyController import property_blueprint
from Controller.loginController import login_controller
from Controller.registrationController import register_controller
from Controller.accountOverviewController import account_overview_controller
from Controller.resetPasswordController import reset_password_controller
from Controller.favouriteController import favourites_blueprint
from Controller.groupChatController import group_chat_blueprint
from dotenv import load_dotenv  
import os 

load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

socketio = SocketIO (app, cors_allowed_origins="*")

# Register blueprints
app.register_blueprint(property_blueprint, url_prefix='/api')
app.register_blueprint(login_controller, url_prefix='/')
app.register_blueprint(register_controller, url_prefix='/') 
app.register_blueprint(account_overview_controller)
app.register_blueprint(reset_password_controller)
app.register_blueprint(favourites_blueprint)
app.register_blueprint(group_chat_blueprint)

@socketio.on("connect")
def handle_connect():
    print("A user connected.")

@socketio.on("disconnect")
def handle_disconnect():
    print("A user disconnected.")

@socketio.on("join_room")
def join_group(data):
    group_id = data.get("group_id")
    join_room(group_id)
    print(f"User joined group {group_id}")

@socketio.on("leave_room")
def leave_group(data):
    group_id = data.get("group_id")
    leave_room(group_id)
    print(f"User left group {group_id}")

@socketio.on("send_message")
def send_group_message(data):
    group_id = data.get("group_id")
    message = data.get("content")
    sender_id = data.get("sender_id")

    # Emit message to the specific group
    emit("receive_message", {
        "group_id": group_id,
        "content": message,
        "sender_id": sender_id
    }, room=group_id)


# Run the server
if __name__ == '__main__':
      socketio.run(app, debug=True, host='0.0.0.0', port=5000)