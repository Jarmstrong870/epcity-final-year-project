from flask import Blueprint, jsonify
from flask_cors import CORS
from Service import getPropertiesService as properties

# Create a blueprint instance
property_blueprint = Blueprint('property', __name__)
CORS(property_blueprint)

# Route to get all properties
@property_blueprint.route('/property/load', methods=['GET'])
def property_load():
    """
    Handles GET requests to retrieve all properties.
    """
    return jsonify(properties.getAllProperties().to_dict(orient='records'))

# Route to load properties from CSV
@property_blueprint.route('/property/loadCSV', methods=['GET'])
def property_load_csv():
    """
    Handles GET requests to retrieve properties from CSV.
    """
    return jsonify(properties.getPropertiesFromCSV().to_dict(orient='records'))