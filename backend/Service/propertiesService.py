import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

all_properties = pd.DataFrame()

#Potentially call this method once a month to get the most up to date property data
def getAllProperties():
    # Page size (max 5000)
    query_size = 5000

    # Base url and api key
    base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'
    api_key = os.getenv("EPC_API_KEY")

    # Set up authentication
    headers = {
        'Accept': 'application/json',
        'Authorization': api_key
    }

    #Query Parameters
    query_params = {'size': query_size, 'local-authority': 'E08000012'}

    # Initialize a list to store all rows
    all_rows = []

    # Keep track of whether we have made at least one request for CSV headers and search-after
    first_request = True
    # Keep track of search-after from previous request
    search_after = None

    # Loop over entries in query blocks of up to 5000 to write all the data into a file
    # Perform at least one request; if there's no search_after, there are no further results
    while search_after != None or first_request:
        # Only set search-after if this isn't the first request
        if not first_request:
            query_params["search-after"] = search_after

        # Set parameters for this query
        encoded_params = urlencode(query_params)
        full_url = f"{base_url}?{encoded_params}"

        # Now make request and extract the data and next search_after
        with urllib.request.urlopen(urllib.request.Request(full_url, headers=headers)) as response:
            response_body = response.read()
            body = response_body.decode()
            search_after = response.getheader('X-Next-Search-After')

        data = json.loads(body)

        if 'rows' in data:
                rows = data['rows']

                # Break loop if no more records
                if not rows:
                    print("No more data to fetch.")
                    break

                # Append each property's data to the all_rows list
                all_rows.extend(rows)
        else:
            print("No data found in the response.")
            break

        first_request = False

    # Convert the data to a DataFrame
    search_results = pd.DataFrame(all_rows)

    #Convert 'lodgement-datetime' to datetime for sorting
    search_results['lodgement-datetime'] = pd.to_datetime(search_results['lodgement-datetime'], format='mixed', errors='coerce')

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    search_results = search_results.sort_values(by=['address', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    search_results = search_results.drop_duplicates(subset='address', keep='first')

    search_results = search_results.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 
                                                    'current-energy-rating': 'current_energy_rating', 'number-habitable-rooms': 'number_habitable_rooms'})
    
    search_results = search_results[['address', 'postcode', 'property_type', 'current_energy_efficiency', 'current_energy_rating', 'number_habitable_rooms']]

    all_properties = search_results

    # save the filtered DataFrame to a new CSV file
    search_results.to_csv('properties_for_search.csv', index=False)


# Call this on backend start up to load properties into all_properties
def getPropertiesFromCSV():
    properties = pd.read_csv('properties_for_search.csv', low_memory=False)
    properties = properties.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 'current-energy-rating': 'current_energy_rating', 
                            'number-habitable-rooms': 'number_habitable_rooms'})
    properties = properties[['address', 'postcode', 'property_type', 'current_energy_efficiency', 'current_energy_rating', 'number_habitable_rooms']]
    all_properties = properties
    return getPage(0)

# Call this to load first 30 properties to backend and when loading a new page of properties
def getPage(pageNumber):
    page_size = 30
    firstProperty = pageNumber * page_size
    lastProperty = (firstProperty + page_size) - 1
    thisPage = all_properties.iloc[firstProperty:lastProperty]
    return thisPage

#Method that queries API with every search
def searchPropertiesAPI(userInput):
    query_size = 5000

    if len(userInput) >= 2 and userInput[0] == 'L' and userInput[1].isdigit():
        query_params = {'size': query_size, 'local-authority': 'E08000012', 'postcode': userInput}
    # Page size (max 5000)
    else:
        query_params = {'size': query_size, 'local-authority': 'E08000012', 'address': userInput}
    # Base url and example query parameters
    base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'

    api_key = os.getenv("EPC_API_KEY")

    # Set up authentication
    headers = {
        'Accept': 'application/json',
        'Authorization': api_key
    }

    # Keep track of whether we have made at least one request for CSV headers and search-after
    first_request = True
    # Keep track of search-after from previous request
    search_after = None

    # Initialize a list to store all rows
    all_rows = []

    # Loop over entries in query blocks of up to 5000 to write all the data into a file
        # Perform at least one request; if there's no search_after, there are no further results
    while search_after != None or first_request:
            # Only set search-after if this isn't the first request
        if not first_request:
            query_params["search-after"] = search_after

            # Set parameters for this query
        encoded_params = urlencode(query_params)
        full_url = f"{base_url}?{encoded_params}"

            # Now make request and extract the data and next search_after
        with urllib.request.urlopen(urllib.request.Request(full_url, headers=headers)) as response:
            response_body = response.read()
            body = response_body.decode()
            search_after = response.getheader('X-Next-Search-After')

        data = json.loads(body)

        if 'rows' in data:
            rows = data['rows']

            # Break loop if no more records
            if not rows:
                print("No more data to fetch.")
                break

            # Append each property's data to the all_rows list
            all_rows.extend(rows)

        else:
            print("No data found in the response.")
            break

        first_request = False

    # Convert the data to a DataFrame
    df = pd.DataFrame(all_rows)

    #Convert 'lodgement-datetime' to datetime for sorting
    df['lodgement-datetime'] = pd.to_datetime(df['lodgement-datetime'], format='mixed', errors='coerce')

    # Drop rows with invalid 'lodgement_datetime' values
    df = df.dropna(subset=['lodgement-datetime'])

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    df_sorted = df.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    df_most_recent = df_sorted.drop_duplicates(subset='uprn', keep='first')

    properties = df_most_recent.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 'current-energy-rating': 'current_energy_rating'})

    return properties

# can search by address or postcode
# def searchPropertiesCSV(userInput):
#     if len(userInput) >= 2 and userInput[0] == 'L' and userInput[1].isdigit():
#         #use postcode
#         searched_properties = all_properties
#     else:
#         #use address