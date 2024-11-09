from flask import Blueprint, jsonify, request
from flask_cors import CORS
from Service import searchPropertiesService

# Create a blueprint instance for the property search controller
search_property_blueprint = Blueprint('search_property', __name__)
CORS(search_property_blueprint)

# Define route for property search
@search_property_blueprint.route('/property/search', methods=['GET'])
def property_search():
    """
    Handles GET requests to search properties.
    """
    user_input = request.args.get('query', '').lower()
    return jsonify(searchPropertiesService.searchProperties(user_input).to_dict(orient='records'))
