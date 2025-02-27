from flask import Blueprint, jsonify, request
from flask_cors import CORS
import pandas as pd
import Service.propertyService as properties

# Create a blueprint instance
property_blueprint = Blueprint('property', __name__)
CORS(property_blueprint)

"""
Route to update properties in the database
"""
@property_blueprint.route('property/updateDB', methods=['GET'])
def update_properties():
    return jsonify(properties.update_properties())

"""
Route to update properties in the database
"""
@property_blueprint.route('property/inflationDB', methods=['GET'])
def update_inflation_data():
    return jsonify(properties.fetch_cpih_data())

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
        order = request.args.get('order').lower() if request.args.get('order') in ['asc', 'desc'] else None
        page = int(request.args.get('page', 1))  # Defaults to 1
        local_authority = request.args.get('local_authority', '').strip()
        min_bedrooms = int(request.args.get('min_bedrooms', 1))
        max_bedrooms = int(request.args.get('max_bedrooms', 10))
        # Call service layer
        result = properties.return_properties(property_types, energy_ratings, search, min_bedrooms, max_bedrooms, sort_by, order, page, local_authority)

        # Return results
        return jsonify(result.to_dict(orient='records')), 200
    except ValueError as ve:
        return jsonify({"error": f"Invalid input: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
"""
Route: /property/compare
Method: POST
Description: Compares multiple properties based on selected criteria.
Request Body:
    - uprns (list of str): List of UPRNs of the properties to compare.
Response: JSON list containing comparison data for selected properties.

"""
@property_blueprint.route('/property/compare', methods=['POST'])
def compare_properties_route():
    try:
        # Extract request data
        data = request.get_json()
        print("Received Data:", data)  # Debugging

        if data is None:
            return jsonify({"error": "No data received"}), 400

        uprns = data.get("uprns", [])

        # Validate the input
        if not isinstance(uprns, list) or len(uprns) < 2 or len(uprns) > 4:
            return jsonify({"error": "You must select between 2 and 4 properties for comparison."}), 400

        print("UPRNs Received:", uprns)  # Debugging

        # Fetch comparison data from the service layer
        comparison_data = properties.compare_properties(uprns)

        #  Convert DataFrame to JSON format
        if isinstance(comparison_data, pd.DataFrame):
            comparison_data = comparison_data.to_dict(orient="records")

        return jsonify(comparison_data), 200

    except Exception as e:
        print("Error in compare_properties_route:", str(e))  # Debugging
        return jsonify({"error": str(e)}), 500

"""
Route method that returns property data for properties within the same postcode and have the same number of bedrooms as a given property
"""
@property_blueprint.route('/property/graph', methods=['GET'])
def get_graph_data_route():
    try:
        # Get params from argument
        postcode = request.args.get('postcode', '').strip()
        number_bedrooms = request.args.get('num_bedrooms')

        # Call service layer
        result = properties.get_properties_from_area(postcode, number_bedrooms)

        # Return results
        return jsonify(result.to_dict(orient='records')), 200
    except ValueError as ve:
        return jsonify({"error": f"Invalid input: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@property_blueprint.route('/property/knnSearch', methods=['POST'])
def knn_search():
    try:
        user_preferences = request.get_json()
        print(user_preferences)
        recommendations = properties.recommend_by_knn(user_preferences)
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500