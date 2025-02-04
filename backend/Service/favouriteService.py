import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os
from Repository import favouriteRepo as repo

load_dotenv()

"""
Service layer method that retieves the user's favourite properties
Uses the email that was passed through the Controller layer
"""
def get_favourite_properties(email):
    # Create empty dataframe
    favourite_properties = pd.DataFrame()
    
    # Call the Repository layer and sets the result equal to the dataframe
    favourite_properties = repo.get_favourite_properties_from_db(email)
    
    #Return the dataframe
    return favourite_properties

"""
Service layer method that adds a property to the user's favourites
Uses the email and uprn passed through the Controller layer
"""
def add_favourite_property(email, uprn):
    #Calls and returns the Reposititory layer 
    return repo.add_favourite_to_db(email, uprn)

"""
Service layer method that removes a property from the user's favourites
Uses the email and uprn passed through the Controller layer
"""
def remove_favourite_property(email, uprn):
    # Calls and returns the Repository layer
    return repo.remove_favourite_from_db(email, uprn)