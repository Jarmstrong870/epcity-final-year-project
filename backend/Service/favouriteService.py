import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os
from Repository import favouriteRepo as repo

load_dotenv()

def getFavouriteProperties(user_id):
    favourite_properties = pd.DataFrame()
    favourite_properties = repo.getFavouritePropertiesfromDB(user_id)
    return favourite_properties

def addFavouriteProperty(user_id, uprn):
    favourite_properties = pd.DataFrame()
    favourite_properties = repo.addFavouriteToDB(user_id, uprn)
    return favourite_properties

def removeFavouriteProperty(user_id, uprn):
    favourite_properties = pd.DataFrame()
    favourite_properties = repo.removeFavouriteFromDB(user_id, uprn)
    return favourite_properties
