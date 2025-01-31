from flask import Flask
from flask_cors import CORS
from Controller.propertyController import property_blueprint
from Controller.loginController import login_controller
from Controller.registrationController import register_controller
from Controller.accountOverviewController import account_overview_controller
from Controller.resetPasswordController import reset_password_controller
from Controller.favouriteController import favourites_blueprint
from Controller.compareController import compare_blueprint
from dotenv import load_dotenv  
import os 

load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(property_blueprint, url_prefix='/api')
app.register_blueprint(login_controller, url_prefix='/')
app.register_blueprint(register_controller, url_prefix='/') 
app.register_blueprint(account_overview_controller)
app.register_blueprint(reset_password_controller)
app.register_blueprint(favourites_blueprint)
app.register_blueprint(compare_blueprint)
# Run the server
if __name__ == '__main__':
      app.run(debug=True, host='0.0.0.0', port=5000)