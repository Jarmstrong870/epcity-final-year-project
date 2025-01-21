from flask import Blueprint, jsonify, request
from flask_cors import CORS
from Service import favouriteService as favourites

# Create a blueprint instance
favourites_blueprint = Blueprint('favourites', __name__)
CORS(favourites_blueprint)

@favourites_blueprint.route('/favourites/getFavourites', methods=['GET'])
def get_favourites():
    user_id = request.args.get('user_id', '').lower()
    return jsonify(favourites.getFavouriteProperties(user_id).to_dict(orient='records'))

@favourites_blueprint.route('favourites/addFavourite', methods=['GET'])
def add_favourite():
    user_id = request.args.get('user_id', '').lower()
    uprn = request.args.get('uprn', '').lower()
    return jsonify(favourites.addFavouriteProperty(user_id, uprn).to_dict(orient='records'))

@favourites_blueprint.route('favourites/removeFavourite', methods=['GET'])
def remove_favourite():
    user_id = request.args.get('user_id', '').lower()
    uprn = request.args.get('uprn', '').lower()
    return jsonify(favourites.removeFavouriteProperty(user_id, uprn).to_dict(orient='records'))
