from flask import Blueprint, jsonify, request
from flask_cors import CORS
from Service import favouriteService as favourites

# Create a blueprint instance
favourites_blueprint = Blueprint('favourites', __name__)
CORS(favourites_blueprint)

"""
Route method that returns the user's favourite properties
Email is derived from the request's url and used as a parameter for the Service layer's method
Service layer is called and returns a jsonified dataframe of the user's favourite properties
"""
@favourites_blueprint.route('/favourites/getFavourites', methods=['GET'])
def get_favourites():
    email = request.args.get('email', '').lower()
    return jsonify(favourites.get_favourite_properties(email).to_dict(orient='records'))

"""
Route method that adds a property to a user's favourites
Email is derived from the request's url and used as a parameter for the Service layer's method
uprn is derived from the request's url and used as a parameter for the Service layer's method
Service layer is called and returns a jsonified True or False to indicate if the property has been added
"""
@favourites_blueprint.route('favourites/addFavourite', methods=['POST'])
def add_favourite():
    email = request.args.get('email', '').lower()
    uprn = request.args.get('uprn', '').lower()
    return jsonify(favourites.add_favourite_property(email, uprn))

"""
Route method that removes a property from a user's favourites
Email is derived from the request's url and used as a parameter for the Service layer's method
uprn is derived from the request's url and used as a parameter for the Service layer's method
Service layer is called and returns a jsonified True or False to indicate if the property has been removed
"""
@favourites_blueprint.route('favourites/removeFavourite', methods=['DELETE'])
def remove_favourite():
    email = request.args.get('email', '').lower()
    uprn = request.args.get('uprn', '').lower()
    return jsonify(favourites.remove_favourite_property(email, uprn))
