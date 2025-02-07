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
def update_properties():
    # Page size (max 5000)
    query_size = 5000

    #Query Parameters
    query_params = {
        'size': query_size,
        'constituency': 'E14000795',        
    }

    # Initialize a list to store all rows
    all_rows = []

    # Keep track of whether we have made at least one request for CSV headers and search-after
    first_request = True
    # Keep track of search-after from previous request
    search_after = None

    # Loop over entries in query blocks of up to 5000 to write all the data into a file
    # Perform at least one request; if there's no search_after, there are no further results
    print("Start API request")
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
    
    print('Finish API Request')

    # Convert the data to a DataFrame
    search_results = pd.DataFrame(all_rows)
    
    # Convert 'uprn' to numeric and drop rows where it's missing
    search_results['uprn'] = pd.to_numeric(search_results['uprn'], errors='coerce')
    search_results = search_results.dropna(subset=['uprn'])

    # Convert 'lodgement-datetime' to datetime safely
    search_results['lodgement-datetime'] = pd.to_datetime(search_results['lodgement-datetime'], format='mixed', errors='coerce')

    # Drop rows where 'lodgement-datetime' is NaT (missing)
    search_results = search_results.dropna(subset=['lodgement-datetime'])

    # Convert datetime to date (important for SQL storage)
    search_results['lodgement-datetime'] = search_results['lodgement-datetime'].dt.date

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    search_results = search_results.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    search_results = search_results.drop_duplicates(subset='uprn', keep='first')
    
    # Rename columns for consistency
    search_results = search_results.rename(columns={
        'property-type': 'property_type',
        'current-energy-efficiency': 'current_energy_efficiency',
        'current-energy-rating': 'current_energy_rating',
        'lodgement-datetime': 'lodgement_datetime',
        'heating-cost-current': 'heating_cost_current',
        'hot-water-cost-current': 'hot_water_cost_current',
        'lighting-cost-current': 'lighting_cost_current',
        'total-floor-area': 'total_floor_area',
        'number-habitable-rooms': 'number_bedrooms'
    })
    
    # Define the required columns to keep
    required_columns = [
        'uprn', 'address', 'postcode', 'property_type', 'lodgement_datetime',
        'current_energy_efficiency', 'current_energy_rating', 'heating_cost_current',
        'hot_water_cost_current', 'lighting_cost_current', 'total_floor_area',
        'number_bedrooms'
    ]

    # Ensure only these columns are retained
    search_results = search_results[required_columns]
    
    # Define numeric columns
    numeric_columns = [
        'heating_cost_current', 'hot_water_cost_current', 'lighting_cost_current', 
        'number_bedrooms', 'current_energy_efficiency', 'total_floor_area'
    ]

    # Convert columns to numeric, coercing errors to NaN
    for col in numeric_columns:
        search_results[col] = pd.to_numeric(search_results[col], errors='coerce')
        
    # Drop rows where column values are missing
    search_results = search_results.dropna(subset=['number_bedrooms'])
    search_results = search_results.dropna(subset=['property_type'])
    search_results = search_results.dropna(subset=['current_energy_efficiency'])
    search_results = search_results.dropna(subset=['heating_cost_current'])
    search_results = search_results.dropna(subset=['hot_water_cost_current'])
    search_results = search_results.dropna(subset=['lighting_cost_current'])
    search_results = search_results.dropna(subset=['total_floor_area'])
    search_results = search_results.dropna(subset=['address'])
    search_results = search_results.dropna(subset=['postcode'])
    search_results = search_results.dropna(subset=['current_energy_rating'])
        
    search_results = search_results[search_results['total_floor_area'] > 0]
    
    # Adjust 'number_bedrooms' by subtracting 1, but only if the value is >= 2
    search_results['number_bedrooms'] = search_results['number_bedrooms'].apply(lambda x: x - 1 if x >= 2 else x)
    
    # save the filtered DataFrame to the hosted database
    return repo.update_properties_in_db(search_results)

"""
Method that sorts the propertied by epc rating and returns the top 6
"""
def get_top_rated_properties():
    top6 = pd.DataFrame()
    top6 = repo.get_top_rated_from_db()
    return top6

"""
Method that gets a page of 30 properties from database
"""
def return_properties(property_types=None, energy_ratings=None, search=None, sort_by=None, order=None, page=1):
    # get property data from database
    thisPage = repo.get_data_from_db(property_types, energy_ratings, search, sort_by, order, page)
    return thisPage

"""
Finds info for when a property is selected by the user
"""
def get_property_info(uprn):
    # Define query parameters
    query_params = {'local-authority': 'E08000012', 'uprn': uprn}

    # Encode query parameters
    encoded_params = urlencode(query_params)

    # Append parameters to the base URL
    full_url = f"{base_url}?{encoded_params}"

    request = urllib.request.Request(full_url, headers=headers)

    try:
        # Make the API request
        with urllib.request.urlopen(request) as response:
            response_body = response.read().decode()
            data = json.loads(response_body)
    except Exception as e:
        print(f"Error fetching property data: {e}")
        return pd.DataFrame()  # Return empty DataFrame on failure

    # Validate response data
    if 'rows' not in data or not data['rows']:
        print(f"No data found for UPRN {uprn}")
        return pd.DataFrame()

    # Convert the data to a DataFrame
    df = pd.DataFrame(data['rows'])
    
    df['uprn'] = pd.to_numeric(df['uprn'], errors='coerce')

    # Convert 'lodgement-datetime' to datetime for sorting
    if 'lodgement-datetime' in df.columns:
        df['lodgement-datetime'] = pd.to_datetime(df['lodgement-datetime'], format='mixed', errors='coerce').dt.date

        # Sort by 'uprn' and 'lodgement_datetime' in descending order
        df = df.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

        # Keep only the most recent entry for each 'uprn'
        df = df.drop_duplicates(subset='uprn', keep='first')

    # Rename the columns in the DataFrame (replace '-' with '_')
    df = df.rename(columns={col: col.replace('-', '_') for col in df.columns})

    # Ensure DataFrame is not empty before proceeding
    if df.empty or 'lodgement_datetime' not in df.columns:
        return df

    # Define the cost columns to process
    cost_columns = [
        'hot_water_cost_current', 'heating_cost_current', 'lighting_cost_current',
        'hot_water_cost_potential', 'heating_cost_potential', 'lighting_cost_potential'
    ]

    # Ensure cost columns exist in DataFrame
    for col in cost_columns:
        if col not in df.columns:
            df[col] = None  # Add missing columns with NaN values

    # Convert cost columns to numeric format
    df[cost_columns] = df[cost_columns].apply(pd.to_numeric, errors='coerce')
    
    # Get the start date for inflation calculation
    start_date = df.loc[df.index[0], 'lodgement_datetime']
    
    # Fetch inflation rate
    inflation_rate = get_inflation_rate(start_date)

    if inflation_rate is None:
        return df  # Return original DataFrame if API call fails

    # Adjust costs to inflation
    def adjust_cost(value):
        try:
            if pd.notna(value):  # Check if value is not NaN
                adjusted_cost = float(value) * (1 + inflation_rate / 100)
                return round(adjusted_cost, 2)
            return None
        except (ValueError, TypeError):  # Handle non-numeric values safely
            return None

    # Adjust costs to inflation
    for col in cost_columns:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: float(adjust_cost(x)) if pd.notna(adjust_cost(x)) else None)


    # Set locale for currency formatting
    locale.setlocale(locale.LC_ALL, 'en_GB.UTF-8')

    # Convert adjusted costs to currency format in a separate column
    for col in cost_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')  # Ensure numeric format
            df[f"{col}_formatted"] = df[col].apply(lambda x: locale.currency(x) if pd.notna(x) else None)


    # Compute monthly & weekly costs
    for col in cost_columns:
        if col in df.columns:
            df[f"{col}_monthly"] = round(df[col] / 12, 2)  # Divide annual cost by 12
            df[f"{col}_weekly"] = round(df[col] / 52, 2)  # Divide annual cost by 52

            # Store formatted currency versions separately
            df[f"{col}_monthly_formatted"] = df[f"{col}_monthly"].apply(
                lambda x: locale.currency(x, grouping=True) if pd.notna(x) else None
            )
            df[f"{col}_weekly_formatted"] = df[f"{col}_weekly"].apply(
                lambda x: locale.currency(x, grouping=True) if pd.notna(x) else None
            )

    cost_per_kwh = 0.2542  # Define the cost per kWh

    # Add cost_per_kwh column
    df['cost_per_kwh'] = cost_per_kwh

    # Convert to numeric and fill missing values with NaN
    df['number_habitable_rooms'] = pd.to_numeric(df['number_habitable_rooms'], errors='coerce')

    # Compute number of bedrooms, ensuring a minimum of 1
    df['number_bedrooms'] = df['number_habitable_rooms'].apply(
        lambda x: x - 1 if pd.notna(x) and x >= 2 else 1
    )

    # Add energy_consumption_cost column
    df['energy_consumption_current'] = pd.to_numeric(df['energy_consumption_current'], errors='coerce')

    # Compute annual energy cost
    df['energy_consumption_cost'] = df['energy_consumption_current'].apply(
        lambda x: cost_per_kwh * x if pd.notna(x) else None
    )

    # Format as currency
    df['energy_consumption_cost_formatted'] = df['energy_consumption_cost'].apply(
        lambda x: locale.currency(x, grouping=True) if pd.notna(x) else None
    )
        
    return df

"""
Fetches the inflation rate for the United Kingdom between the start date and today.
"""
def get_inflation_rate(start_date: str) -> float:
    api_url = "https://www.statbureau.org/calculate-inflation-rate-json"
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    # Set parameters
    params = {
        "country": "united-kingdom",
        "start": start_date,
        "end": end_date
    }

    # Build the URL
    full_url = f"{api_url}?{urllib.parse.urlencode(params)}"

    try:
        # Make request
        request = urllib.request.Request(full_url)
        with urllib.request.urlopen(request) as response:
            response_body = response.read().decode()
            # Set inflation rate to float and return it
            return float(response_body.strip('"'))
    except Exception as e:
        print(f"Error fetching inflation rate: {e}")
        return None

"""
Method that returns a list of property data for each UPRN provided in the parameter
"""    
def compare_properties(uprns):
    # Create an empty DataFrame to store results
    compared_properties = pd.DataFrame()

    # Loop through the list of UPRNs
    for uprn in uprns:
        # Call get_property_info method for each UPRN
        property_info = get_property_info(uprn)

        # Add property to DataFrame if it has data
        if not property_info.empty:
            compared_properties = pd.concat([compared_properties, property_info], ignore_index=True)

    # Return the list of properties
    return compared_properties