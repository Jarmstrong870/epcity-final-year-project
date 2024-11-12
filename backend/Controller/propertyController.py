from flask import Blueprint, jsonify, request
from flask_cors import CORS
from Service import propertiesService as properties

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

# Define route for property search
@property_blueprint.route('/property/search', methods=['GET'])
def property_search():
    """
    Handles GET requests to search properties.
    """
    user_input = request.args.get('query', '').lower()
    return jsonify(properties.searchPropertiesAPI(user_input).to_dict(orient='records'))

@property_blueprint.route('/property/searchCSV', methods=['GET'])
def property_search_csv():
    """
    Handles GET requests to search properties.
    """
    user_input = request.args.get('query', '').lower()
    return jsonify(properties.searchPropertiesCSV(user_input).to_dict(orient='records'))

@property_blueprint.route('/property/getInfo', methods=['GET'])
def get_property_info():
    """
    Returns data for a single property
    """
    address = request.args.get('query', '').lower()
    return jsonify(properties.getPropertyInfo(address).to_dict(orient='records'))

