import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os
from Repository import propertyRepo as repo
import datetime
import locale

load_dotenv()

# Base url and api key
base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'
api_key = os.getenv("EPC_API_KEY")

# Set up authentication
headers = {
    'Accept': 'application/json',
    'Authorization': api_key
}

"""
Retrives all valid properties from API and calls the database method to update the property table
"""
def get_all_properties():
    # Page size (max 5000)
    query_size = 5000

    #Query Parameters
    query_params = {
        'size': query_size,
        'local-authority': 'E08000012',        
    }

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
    
    search_results['uprn'] = pd.to_numeric(search_results['uprn'], errors='coerce')
    search_results = search_results.dropna(subset=['uprn'])

    #Convert 'lodgement-datetime' to datetime for sorting
    search_results['lodgement-datetime'] = pd.to_datetime(search_results['lodgement-datetime'], format='mixed', errors='coerce').dt.date    

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    search_results = search_results.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    search_results = search_results.drop_duplicates(subset='uprn', keep='first')

    search_results = search_results.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 
                                                    'current-energy-rating': 'current_energy_rating', 'lodgement-datetime': 'lodgement_datetime', 
                                                    'heating-cost-current': 'heating_cost_current', 'hot-water-cost-current': 'hot_water_cost_current',
                                                    'lighting-cost-current': 'lighting_cost_current', 'total-floor-area': 'total_floor_area'})
    
    required_columns = [
        'uprn', 'address', 'postcode', 'property_type', 'lodgement_datetime',
        'current_energy_efficiency', 'current_energy_rating', 'heating_cost_current',
        'hot_water_cost_current', 'lighting_cost_current', 'total_floor_area'
    ]
    
    search_results = search_results[required_columns]
    
    numeric_columns = ['heating_cost_current', 'hot_water_cost_current', 'lighting_cost_current']
    for col in numeric_columns:
        search_results[col] = pd.to_numeric(search_results[col], errors='coerce')
        search_results = search_results.dropna(subset=[col])
    
    # save the filtered DataFrame to the hosted database
    repo.update_properties_in_db(search_results)

"""
method that sorts the propertied by epc rating and returns the top 6
"""
def get_top_rated_properties():
    top6 = pd.DataFrame()
    top6 = repo.get_top_rated_from_db()
    return top6

"""
Method that gets properties from database and performs pagination on it
"""
def return_properties(property_types=None, energy_ratings=None, search=None, sort_by=None, order=None, page=1):
    # set page size and page values
    page_size = 30
    pageNumber = int(page) - 1
    firstProperty = pageNumber * page_size
    lastProperty = (firstProperty + page_size) - 1
    thisPage = pd.DataFrame()
    # get property data from database
    thisPage = repo.get_data_from_db(property_types, energy_ratings, search, sort_by, order)
    #paginate properties
    thisPage = thisPage.iloc[firstProperty:lastProperty]
    return thisPage

# finds info for when a property is selected by user
def get_property_info(uprn):

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
    df['lodgement-datetime'] = pd.to_datetime(df['lodgement-datetime'], format='mixed', errors='coerce').dt.date

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    df = df.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    df = df.drop_duplicates(subset='uprn', keep='first')

    new_columns = {col: col.replace('-', '_') for col in df.columns}
    # Rename the columns in the dataframe
    df = df.rename(columns=new_columns)
        
    start_date = df.loc[df.index[0], 'lodgement_datetime']
    inflation_rate = get_inflation_rate(start_date)
    
    if inflation_rate is None:
        return df  # Return original DataFrame if API call fails
    
    # adjust costs to inflation
    def adjust_cost(value):
        return float(value) * (1 + inflation_rate / 100)
    
    adjusted_hot_water_cost = adjust_cost(df.loc[df.index[0], 'hot_water_cost_current'])
    adjusted_heating_cost = adjust_cost(df.loc[df.index[0], 'heating_cost_current'])
    adjusted_lighting_cost = adjust_cost(df.loc[df.index[0], 'lighting_cost_current'])
    
    locale.setlocale(locale.LC_ALL, 'en_GB.UTF-8')
    
    # set values to currency
    hw_currency = locale.currency(adjusted_hot_water_cost)
    h_currency = locale.currency(adjusted_heating_cost)
    l_currency = locale.currency(adjusted_lighting_cost)
    
    # put currency values into dataframe
    df.loc[df.index[0], 'hot_water_cost_current'] = hw_currency
    df.loc[df.index[0], 'heating_cost_current'] = h_currency
    df.loc[df.index[0], 'lighting_cost_current'] = l_currency
    
    return df

"""
Fetches the inflation rate for the United Kingdom between the start date and today.
"""
def get_inflation_rate(start_date: str) -> float:
    
    api_url = "https://www.statbureau.org/calculate-inflation-rate-json"
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    #set parameter
    params = {
        "country": "united-kingdom",
        "start": start_date,
        "end": end_date
    }
    
    #build url
    full_url = f"{api_url}?{urllib.parse.urlencode(params)}"
    
    try:
        # make request
        request = urllib.request.Request(full_url)
        with urllib.request.urlopen(request) as response:
            response_body = response.read().decode()
            # set inflation rate to float and return it
            inflation_rate = float(response_body.strip('"'))
            return inflation_rate
    except Exception as e:
        print(f"Error fetching inflation rate: {e}")
        return None