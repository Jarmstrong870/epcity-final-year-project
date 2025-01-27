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

#Potentially call this method once a month to get the most up to date property data
def getAllProperties():
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
    
    search_results['heating_cost_current'] = pd.to_numeric(search_results['heating_cost_current'], errors='coerce')
    search_results = search_results.dropna(subset=['heating_cost_current'])
    search_results['hot_water_cost_current'] = pd.to_numeric(search_results['hot_water_cost_current'], errors='coerce')
    search_results = search_results.dropna(subset=['hot_water_cost_current'])
    search_results['lighting_cost_current'] = pd.to_numeric(search_results['lighting_cost_current'], errors='coerce')
    search_results = search_results.dropna(subset=['lighting_cost_current'])
    
    # save the filtered DataFrame to the hosted database
    repo.updatePropertiesInDB(search_results)

# method that sorts the propertied by epc rating and returns the top 6
def getTopRatedProperties():
    top6 = pd.DataFrame()
    top6 = repo.getTopRatedFromDB()
    return top6

def returnProperties(property_types=None, energy_ratings=None, search=None, sort_by=None, order=None, page=1):
    page_size = 30
    pageNumber = int(page) - 1
    firstProperty = pageNumber * page_size
    lastProperty = (firstProperty + page_size) - 1
    thisPage = pd.DataFrame()
    thisPage = repo.get_data_from_db(property_types, energy_ratings, search, sort_by, order)
    thisPage = thisPage.iloc[firstProperty:lastProperty]
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
    df['lodgement-datetime'] = pd.to_datetime(df['lodgement-datetime'], format='mixed', errors='coerce').dt.date

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    df = df.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    df = df.drop_duplicates(subset='uprn', keep='first')

    new_columns = {col: col.replace('-', '_') for col in df.columns}
    # Rename the columns in the dataframe
    df = df.rename(columns=new_columns)
    
    adjusted_hot_water_cost = calculateInflationAdjustedPrice(df.loc[df.index[0], 'hot_water_cost_current'], df.loc[df.index[0], 'lodgement_datetime']).strip('"')
    adjusted_heating_cost = calculateInflationAdjustedPrice(df.loc[df.index[0], 'heating_cost_current'], df.loc[df.index[0], 'lodgement_datetime']).strip('"')
    adjusted_lighting_cost = calculateInflationAdjustedPrice(df.loc[df.index[0], 'lighting_cost_current'], df.loc[df.index[0], 'lodgement_datetime']).strip('"')

    locale.setlocale(locale.LC_ALL, 'en_GB.UTF-8')
    
    adjusted_hot_water_cost_value = float(adjusted_hot_water_cost)
    adjusted_heating_cost_value = float(adjusted_heating_cost)
    adjusted_lighting_cost_value = float(adjusted_lighting_cost)
    
    hw_currency = locale.currency(adjusted_hot_water_cost_value)
    h_currency = locale.currency(adjusted_heating_cost_value)
    l_currency = locale.currency(adjusted_lighting_cost_value)
    
    df.loc[df.index[0], 'hot_water_cost_current'] = hw_currency
    df.loc[df.index[0], 'heating_cost_current'] = h_currency
    df.loc[df.index[0], 'lighting_cost_current'] = l_currency

    return df

def calculateInflationAdjustedPrice(start_price, start_date):
    
    api_url = 'https://www.statbureau.org/calculate-inflation-price-json'
    
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")
        
    # Query parameters
    params = {
        'country': 'united-kingdom',
        'start': start_date,
        'end': end_date,  # Current date in YYYY-MM-DD format
        'amount': start_price,
        'format': False  # Format the result as currency
    }
    
    # Construct the full URL with encoded parameters
    full_url = f"{api_url}?{urlencode(params)}"
    
    try:
        # Make the API request
        request = urllib.request.Request(full_url)
        with urllib.request.urlopen(request) as response:
            # Read and decode the response
            response_body = response.read().decode()
            # Parse the JSON response (Statbureau API returns a quoted string)
            adjusted_price = response_body  # Remove quotes and convert to float
            return adjusted_price
    except Exception as e:
        print(f"Error fetching inflation-adjusted price: {e}")
        return None