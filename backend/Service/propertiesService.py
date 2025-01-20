import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os
from Repository import propertyRepo as repo
import datetime

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

# Call this on backend start up to load properties into all_properties
def loadAllProperties():
    global all_properties
    global altered
    
    all_properties = repo.getPropertiesFromDB()
    
    altered = False
    return all_properties.head(30)

# method that sorts the propertied by epc rating and returns the top 6
def getTopRatedProperties():
    global all_properties
    return all_properties.head(6)


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
    lastProperty = (firstProperty + page_size) - 1
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
    
    df['hot_water_cost'] = calculateInflationAdjustedPrice(df['hot_water_cost'], df['lodgement-datetime'].strftime("%Y-%m-%d"))
    df['heating_cost'] = calculateInflationAdjustedPrice(df['heating_cost'], df['lodgement-datetime'].strftime("%Y-%m-%d"))
    df['lighting_cost'] = calculateInflationAdjustedPrice(df['lighting_cost'], df['lodgement-datetime'].strftime("%Y-%m-%d"))

    return df

# filter properties by property type or epc rating
def filterProperties(property_types, epc_ratings):
    global altered_properties

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
        return all_properties
        

    altered = True
    altered_properties = all_properties

    # Apply search filter
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
        return all_properties
