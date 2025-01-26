from flask import Blueprint, jsonify, request
from flask_cors import CORS
from Service import favouriteService as favourites

# Create a blueprint instance
favourites_blueprint = Blueprint('favourites', __name__)
CORS(favourites_blueprint)

@favourites_blueprint.route('/favourites/getFavourites', methods=['GET'])
def get_favourites():
    email = request.args.get('email', '').lower()
    return jsonify(favourites.getFavouriteProperties(email).to_dict(orient='records'))

@favourites_blueprint.route('favourites/addFavourite', methods=['POST'])
def add_favourite():
    email = request.args.get('email', '').lower()
    uprn = request.args.get('uprn', '').lower()
    return jsonify(favourites.addFavouriteProperty(email, uprn))

@favourites_blueprint.route('favourites/removeFavourite', methods=['DELETE'])
def remove_favourite():
    email = request.args.get('email', '').lower()
    uprn = request.args.get('uprn', '').lower()
    return jsonify(favourites.removeFavouriteProperty(email, uprn))
