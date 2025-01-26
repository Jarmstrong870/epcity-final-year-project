import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os
from Repository import favouriteRepo as repo

load_dotenv()

def getFavouriteProperties(email):
    favourite_properties = pd.DataFrame()
    favourite_properties = repo.getFavouritePropertiesfromDB(email)
    return favourite_properties

def addFavouriteProperty(email, uprn):
    return repo.addFavouriteToDB(email, uprn)

def removeFavouriteProperty(email, uprn):
    return repo.removeFavouriteFromDB(email, uprn)
