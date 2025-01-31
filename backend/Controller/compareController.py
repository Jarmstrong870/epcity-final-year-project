from flask import Blueprint, jsonify, request
from flask_cors import CORS
from Service import compareService

compare_blueprint = Blueprint('compare', __name__)
CORS(compare_blueprint, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@compare_blueprint.route('/compare', methods=['POST'])
def compare_properties():
    # Extract JSON request data
    data = request.get_json()
    uprns = data.get("uprns", [])

    # Validate that exactly 4 UPRNs are provided
    if len(uprns) != 4:
        return jsonify({"error": "Exactly 4 property UPRNs are required"}), 400

    # Call the service layer to fetch comparison data
    comparison_data = compareService.get_property_comparison(uprns)

    return jsonify(comparison_data), 200
