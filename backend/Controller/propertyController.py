from flask import Blueprint, jsonify, request
from flask_cors import CORS
import Service.propertyService as properties

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

# Route to load top 6 properties from DB for Home Page
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

# Does everything method
@property_blueprint.route('/property/getPage', methods=['GET'])
def get_properties_page():
    try:
        # Validate and parse query parameters
        property_types = (
            request.args.get('pt', '').split(',') if request.args.get('pt') else None
        )
        energy_ratings = (
            request.args.get('epc', '').split(',') if request.args.get('epc') else None
        )
        search = request.args.get('search', '').strip()
        sort_by = request.args.get('sort_by')
        order = request.args.get('order', '').lower() if request.args.get('order') in ['asc', 'desc'] else None
        page = int(request.args.get('page', 1))  # Defaults to 1

        # Call service layer
        result = properties.returnProperties(property_types, energy_ratings, search, sort_by, order, page)

        # Return paginated results
        return jsonify(result.to_dict(orient='records')), 200
    except ValueError as ve:
        return jsonify({"error": f"Invalid input: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500