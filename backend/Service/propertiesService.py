import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

# properties for displaying, searching, filtering and sorting
all_properties = pd.DataFrame()
altered_properties = pd.DataFrame()

altered = False

# Base url and api key
base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'
api_key = os.getenv("EPC_API_KEY")

# Set up authentication
headers = {
    'Accept': 'application/json',
    'Authorization': api_key
}

#Potentially call this method once a month to get the most up to date property data
def getAllProperties():
    # Page size (max 5000)
    query_size = 5000

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

    # Drop properties with no uprn
    search_results = search_results.dropna(subset=['uprn'])

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    search_results = search_results.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    search_results = search_results.drop_duplicates(subset='uprn', keep='first')

    search_results = search_results.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 
                                                    'current-energy-rating': 'current_energy_rating', 
                                                    'lodgement-datetime': 'lodgement_datetime'})
    
    search_results = search_results[['uprn', 'address', 'postcode', 'property_type', 'lodgement_datetime', 'current_energy_efficiency', 
                                     'current_energy_rating']]

    # save the filtered DataFrame to a new CSV file
    search_results.to_csv('properties_for_search.csv', index=False)

# Call this on backend start up to load properties into all_properties
def getPropertiesFromCSV():
    global all_properties
    global altered
    # Load the CSV into a DataFrame
    properties = pd.read_csv('properties_for_search.csv', low_memory=False)

    # Select only the required columns
    properties = properties[['uprn', 'address', 'postcode', 'property_type', 'current_energy_efficiency', 'current_energy_rating']]

    # Convert columns to object type to handle mixed values properly
    properties = properties.astype(object).fillna(pd.NA)

    # Sort by descending current efficiency and return top 6
    top_rated_properties = properties.sort_values(by='current_energy_efficiency')
   
    # Assign the DataFrame to the global variable and return the first 30 rows
    all_properties = properties

    # set altered to false
    altered = False

    return all_properties.head(30)

# method that sorts the propertied by epc rating and returns the top 6
def getTopRatedProperties():
    global all_properties
    global changed
    # Load the CSV into a DataFrame
    properties = pd.read_csv('properties_for_search.csv', low_memory=False)

    # Select only the required columns
    properties = properties[['uprn', 'address', 'postcode', 'property_type', 'current_energy_efficiency', 'current_energy_rating']]

    # Convert columns to object type to handle mixed values properly
    properties = properties.infer_objects(copy=False)


    # Sort by descending current efficiency and return top 6
    top_rated_properties = properties.sort_values(by='current_energy_efficiency', ascending=False)
   
    # Assign the DataFrame to the global variable and return the first 30 rows
    all_properties = top_rated_properties

    # set altered to false
    changed = False
    print(all_properties.head())
    return all_properties.head(12)


# srot All  Properties - sort by EPC rating (current efficiency)
# go to Controller method - add Controller 

# Call this to load first 30 properties to backend and when loading a new page of properties
def getPage(pageNumber):
    global altered
    global all_properties
    global altered_properties
    page_size = 30
    pageNumber = int(pageNumber)
    firstProperty = pageNumber * page_size
    lastProperty = (firstProperty + page_size)
    if altered:
        thisPage = altered_properties.iloc[firstProperty:lastProperty]
    else:
        thisPage = all_properties.iloc[firstProperty:lastProperty]
    return thisPage

# finds info for when a property is selected by user
def getPropertyInfo(uprn):

    # Define query parameters
    query_params = {'local-authority': 'E08000012', 'uprn': uprn}

    # Encode query parameters
    encoded_params = urlencode(query_params)

    # Append parameters to the base URL
    full_url = f"{base_url}?{encoded_params}"

    all_rows = []

    request = urllib.request.Request(full_url, headers=headers)

    with urllib.request.urlopen(request) as response:
        response_body = response.read().decode()
    
    data = json.loads(response_body)

    if 'rows' in data:
        rows = data['rows']

        # Break loop if no more records
        if not rows:
            print("No more data to fetch.")

         # Append each property's data to the all_rows list
        all_rows.extend(rows)

    # Convert the data to a DataFrame
    df = pd.DataFrame(all_rows)

    #Convert 'lodgement-datetime' to datetime for sorting
    df['lodgement-datetime'] = pd.to_datetime(df['lodgement-datetime'], format='mixed', errors='coerce')

    # Drop rows with invalid 'lodgement_datetime' values
    #df = df.dropna(subset=['lodgement-datetime'])

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    df = df.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    df = df.drop_duplicates(subset='uprn', keep='first')

    new_columns = {col: col.replace('-', '_') for col in df.columns}
    # Rename the columns in the dataframe
    df = df.rename(columns=new_columns)

    return df

# filter properties by property type or epc rating
def filterProperties(property_types, epc_ratings):
    global altered_properties

    print(epc_ratings)
    # Start with the full set of searched_properties
    filtered_properties = altered_properties

    # Filter by multiple property types if provided
    if property_types:
        filtered_properties = filtered_properties[filtered_properties['property_type'].str.lower().isin([pt.lower() for pt in property_types])]

    # Filter by multiple EPC ratings if provided
    if epc_ratings:
        filtered_properties = filtered_properties[filtered_properties['current_energy_rating'].str.upper().isin([rating.upper() for rating in epc_ratings])]

    return filtered_properties

# can search by address or postcode
def searchProperties(userInput):
    global altered_properties
    searched_properties = altered_properties
    # start by checking addresses
    searched_properties = searched_properties[searched_properties['address'].str.contains(userInput, case=False, na=False)]

    # if dataframe is empty after checking addresses, check postcode
    if searched_properties.empty:
        searched_properties = altered_properties
        searched_properties = searched_properties[searched_properties['postcode'].str.contains(userInput, case=False, na=False)]
    
    return searched_properties

# check if any searches or filters have been applied and apply them
def alterProperties(searchValue=None, property_types=None, epc_ratings=None):
    global all_properties
    global altered_properties
    global altered
    
    if searchValue is None and property_types is None and epc_ratings is None:
        altered = False
        return all_properties.head(30)
        

    altered = True
    altered_properties = all_properties

    # Apply search
    if searchValue:
        altered_properties = searchProperties(searchValue)

    # Apply filters
    if property_types is not None or epc_ratings is not None:
        altered_properties = filterProperties(property_types, epc_ratings)

    return altered_properties

def sortProperties(attribute, ascending=True):
    """
    Sort properties by EPC energy efficiency (current_energy_efficiency).
    :param ascending: Sort order. True for ascending, False for descending.
    """
    global all_properties
    global altered_properties
    global altered
    if altered:
        altered_properties = altered_properties.sort_values(by=attribute, ascending=ascending)
        return altered_properties
    else:
        all_properties = all_properties.sort_values(by=attribute, ascending=ascending)
