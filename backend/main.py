from flask import Flask
from flask_cors import CORS
from Controller.propertyController import property_blueprint
from Controller.loginController import login_controller
from Controller.registrationController import register_controller
from Controller.accountOverviewController import account_overview_controller
from dotenv import load_dotenv  
import os 

load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Register blueprints
app.register_blueprint(property_blueprint, url_prefix='/api')
app.register_blueprint(login_controller, url_prefix='/')
app.register_blueprint(register_controller, url_prefix='/') 
app.register_blueprint(account_overview_controller)

# Run the server
if __name__ == '__main__':
      app.run(debug=True, host='0.0.0.0', port=5000)