import pandas as pd
from dotenv import load_dotenv
import os
from Repository import compareRepo as repo

load_dotenv()

"""
Service layer method that retrieves property details for comparison.
Uses the UPRNs passed through the Controller layer.
"""
def get_property_comparison(uprns):
    # Fetch data from the repository
    properties_df = repo.get_properties_by_uprns(uprns)

    # Handle cases where no data is returned
    if properties_df is None:
        return {"error": "Database error occurred. Could not fetch property data."}

    if properties_df.empty:
        return {"error": "No properties found for the given UPRNs"}

    return properties_df.to_dict(orient='records')
