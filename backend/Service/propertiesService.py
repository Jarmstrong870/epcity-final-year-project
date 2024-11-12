import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

all_properties = pd.DataFrame()

searched_properties = pd.DataFrame()

# Base url and api key
base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'
api_key = os.getenv("EPC_API_KEY")

# Set up authentication
headers = {
    'Accept': 'application/json',
    'Authorization': api_key
}

column_names = ['low_energy_fixed_light_count', 'address', 'uprn_source',
       'floor_height', 'heating_cost_potential', 'unheated_corridor_length',
       'hot_water_cost_potential', 'construction_age_band',
       'potential_energy_rating', 'mainheat_energy_eff', 'windows_env_eff',
       'lighting_energy_eff', 'environmental_impact_potential', 'glazed_type',
       'heating_cost_current', 'address3', 'mainheatcont_description',
       'sheating_energy_eff', 'property_type', 'local_authority_label',
       'fixed_lighting_outlets_count', 'energy_tariff',
       'mechanical_ventilation', 'hot_water_cost_current', 'county',
       'postcode', 'solar_water_heating_flag', 'constituency',
       'co2_emissions_potential', 'number_heated_rooms', 'floor_description',
       'energy_consumption_potential', 'local_authority', 'built_form',
       'number_open_fireplaces', 'windows_description', 'glazed_area',
       'inspection_date', 'mains_gas_flag', 'co2_emiss_curr_per_floor_area',
       'address1', 'heat_loss_corridor', 'flat_storey_count',
       'constituency_label', 'roof_energy_eff', 'total_floor_area',
       'building_reference_number', 'environmental_impact_current',
       'co2_emissions_current', 'roof_description', 'floor_energy_eff',
       'number_habitable_rooms', 'address2', 'hot_water_env_eff', 'posttown',
       'mainheatc_energy_eff', 'main_fuel', 'lighting_env_eff',
       'windows_energy_eff', 'floor_env_eff', 'sheating_env_eff',
       'lighting_description', 'roof_env_eff', 'walls_energy_eff',
       'photo_supply', 'lighting_cost_potential', 'mainheat_env_eff',
       'multi_glaze_proportion', 'main_heating_controls', 'lodgement_datetime',
       'flat_top_storey', 'current_energy_rating', 'secondheat_description',
       'walls_env_eff', 'transaction_type', 'uprn',
       'current_energy_efficiency', 'energy_consumption_current',
       'mainheat_description', 'lighting_cost_current', 'lodgement_date',
       'extension_count', 'mainheatc_env_eff', 'lmk_key', 'wind_turbine_count',
       'tenure', 'floor_level', 'potential_energy_efficiency',
       'hot_water_energy_eff', 'low_energy_lighting', 'walls_description',
       'hotwater_description']

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

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    search_results = search_results.sort_values(by=['address', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    search_results = search_results.drop_duplicates(subset='address', keep='first')

    search_results = search_results.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 
                                                    'current-energy-rating': 'current_energy_rating', 'number-habitable-rooms': 'number_habitable_rooms'})
    
    search_results = search_results[['address', 'postcode', 'property_type', 'current_energy_efficiency', 'current_energy_rating', 'number_habitable_rooms']]

    # save the filtered DataFrame to a new CSV file
    search_results.to_csv('properties_for_search.csv', index=False)


# Call this on backend start up to load properties into all_properties
def getPropertiesFromCSV():
    properties = pd.read_csv('properties_for_search.csv', low_memory=False)
    properties = properties.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 'current-energy-rating': 'current_energy_rating', 
                            'number-habitable-rooms': 'number_habitable_rooms'})
    properties = properties[['address', 'postcode', 'property_type', 'current_energy_efficiency', 'current_energy_rating', 'number_habitable_rooms']]
    all_properties = properties
    return all_properties.head(30)

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
    #df = df.dropna(subset=['lodgement-datetime'])

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    df = df.sort_values(by=['address', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    df = df.drop_duplicates(subset='address', keep='first')

    df = df.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 'current-energy-rating': 'current_energy_rating'})

    return df

# can search by address or postcode
def searchPropertiesCSV(userInput):
    # Check if the input is a postcode (assuming UK postcode format starting with 'L')
    if len(userInput) >= 2 and userInput[0] == 'L' and userInput[1].isdigit():
        # Use postcode to filter properties
        searched_properties = all_properties[all_properties['postcode'].str.contains(userInput, case=False, na=False)]
    else:
        # Use address to filter properties
        searched_properties = all_properties[all_properties['address'].str.contains(userInput, case=False, na=False)]
    
    # If no properties found, print a message
    if searched_properties.empty:
        print("No properties found for the given search criteria.")
    
    return searched_properties

# finds info for when a property is selected by user
def getPropertyInfo(address):

    # Define query parameters
    query_params = {'local-authority': 'E08000012', 'address': address}

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
    df = df.sort_values(by=['address', 'lodgement-datetime'], ascending=[True, False])

    # Keep only the most recent entry for each 'uprn'
    df = df.drop_duplicates(subset='address', keep='first')

    new_columns = {col: col.replace('-', '_') for col in df.columns}
    # Rename the columns in the dataframe
    df = df.rename(columns=new_columns)

    return df