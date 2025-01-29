from flask import Blueprint, jsonify, request
from flask_cors import CORS
import Service.propertyService as properties

# Create a blueprint instance
property_blueprint = Blueprint('property', __name__)
CORS(property_blueprint)

"""
Route to load top 6 properties from DB for Home Page
"""
@property_blueprint.route('/property/loadTopRated', methods=['GET'])
def property_load_toprated_route():
    # returns service method
    return jsonify(properties.get_top_rated_properties().to_dict(orient='records'))

"""
Route to get info on a selected property
"""
@property_blueprint.route('/property/getInfo', methods=['GET'])
def get_property_info_route():
    # gets uprn value from url
    uprn = request.args.get('uprn', '').lower()
    # calls service method
    return jsonify(properties.get_property_info(uprn).to_dict(orient='records'))

"""
Route that handles all searching, filtering, sorting and pagination
"""
@property_blueprint.route('/property/getPage', methods=['GET'])
def get_properties_page_route():
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
        result = properties.return_properties(property_types, energy_ratings, search, sort_by, order, page)

        # Return results
        return jsonify(result.to_dict(orient='records')), 200
    except ValueError as ve:
        return jsonify({"error": f"Invalid input: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500