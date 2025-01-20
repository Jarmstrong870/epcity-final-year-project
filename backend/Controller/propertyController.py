from flask import Blueprint, jsonify, request
from flask_cors import CORS
from Service import propertiesService as properties

# Create a blueprint instance
property_blueprint = Blueprint('property', __name__)
CORS(property_blueprint)

# Route to update properties monthly
@property_blueprint.route('/property/replace', methods=['GET'])
def property_load():
    """
    Handles GET requests to retrieve all properties from API and update database.
    """
    return jsonify(properties.getAllProperties().to_dict(orient='records'))

# Route to load properties from CSV
@property_blueprint.route('/property/loadDB', methods=['GET'])
def property_load_db():
    """
    Handles GET requests to retrieve properties from AWS Database.
    """
    return jsonify(properties.loadAllProperties().to_dict(orient='records'))

# Route to load top 6 properties from CSV for Home Page
@property_blueprint.route('/property/loadTopRated', methods=['GET'])
def property_load_toprated():
    """
    Handles GET requests to retrieve top rated properties from .
    """
    return jsonify(properties.getTopRatedProperties().to_dict(orient='records'))

# Route to get info on a selected property
@property_blueprint.route('/property/getInfo', methods=['GET'])
def get_property_info():
    """
    Returns data for a single property
    """
    uprn = request.args.get('uprn', '').lower()
    print(f"Received UPRN: {uprn}")
    return jsonify(properties.getPropertyInfo(uprn).to_dict(orient='records'))

# Route to for searching and filtering data
@property_blueprint.route('/property/alter', methods=['GET'])
def alter_properties():
    """
    Checks if searching or filtering has been applied and returns the altered list of properties
    """
    search_value = request.args.get('search', '').lower()  # Use 'search' from query params
    property_types = request.args.get('pt', '').split(',') if request.args.get('pt', '') else []
    epc_ratings = request.args.get('epc', '').split(',') if request.args.get('epc', '') else []

    # Calling alterProperties with the corrected parameter names
    altered_properties = properties.alterProperties(
        searchValue=search_value,
        property_types=property_types,
        epc_ratings=epc_ratings
    )

    return jsonify(altered_properties.to_dict(orient='records'))

# Route for sorting data
@property_blueprint.route('/property/sort', methods=['GET'])
def sort_properties():
    attribute = request.args.get('attribute', '')
    #ascending = request.args.get('ascending', '')
    
    sorted_properties = properties.sortProperties(attribute, ascending = True)
    return jsonify(sorted_properties.to_dict(orient='records'))

# Route for 
@property_blueprint.route('/property/paginate', methods=['GET'])
def get_property_page():
    page_number = request.args.get('pageNumber', '')
    page = properties.getPage(page_number)
    return jsonify(page.to_dict(orient='records'))