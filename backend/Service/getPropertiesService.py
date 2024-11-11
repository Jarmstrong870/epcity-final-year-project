import urllib.request
from urllib.parse import urlencode
import json
from flask import jsonify
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

# Base url and api key
base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'
api_key = os.getenv("EPC_API_KEY")

    # Set up authentication
headers = {
    'Accept': 'application/json',
    'Authorization': api_key
}

column_names = ['low-energy-fixed-light-count', 'address', 'uprn-source',
    'floor-height', 'heating-cost-potential', 'unheated-corridor-length',
    'hot-water-cost-potential', 'construction-age-band',
    'potential-energy-rating', 'mainheat-energy-eff', 'windows-env-eff',
    'lighting-energy-eff', 'environment-impact-potential', 'glazed-type',
    'heating-cost-current', 'address3', 'mainheatcont-description',
    'sheating-energy-eff', 'property-type', 'local-authority-label',
    'fixed-lighting-outlets-count', 'energy-tariff',
    'mechanical-ventilation', 'hot-water-cost-current', 'county',
    'postcode', 'solar-water-heating-flag', 'constituency',
    'co2-emissions-potential', 'number-heated-rooms', 'floor-description',
    'energy-consumption-potential', 'local-authority', 'built-form',
    'number-open-fireplaces', 'windows-description', 'glazed-area',
    'inspection-date', 'mains-gas-flag', 'co2-emiss-curr-per-floor-area',
    'address1', 'heat-loss-corridor', 'flat-storey-count',
    'constituency-label', 'roof-energy-eff', 'total-floor-area',
    'building-reference-number', 'environment-impact-current',
    'co2-emissions-current', 'roof-description', 'floor-energy-eff',
    'number-habitable-rooms', 'address2', 'hot-water-env-eff', 'posttown',
    'mainheatc-energy-eff', 'main-fuel', 'lighting-env-eff',
    'windows-energy-eff', 'floor-env-eff', 'sheating-env-eff',
    'lighting-description', 'roof-env-eff', 'walls-energy-eff',
    'photo-supply', 'lighting-cost-potential', 'mainheat-env-eff',
    'multi-glaze-proportion', 'main-heating-controls', 'lodgement-datetime',
    'flat-top-storey', 'current-energy-rating', 'secondheat-description',
    'walls-env-eff', 'transaction-type', 'uprn',
    'current-energy-efficiency', 'energy-consumption-current',
    'mainheat-description', 'lighting-cost-current', 'lodgement-date',
    'extension-count', 'mainheatc-env-eff', 'lmk-key', 'wind-turbine-count',
    'tenure', 'floor-level', 'potential-energy-efficiency',
    'hot-water-energy-eff', 'low-energy-lighting', 'walls-description',
    'hotwater-description']

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

    # Drop rows with invalid 'lodgement_datetime' values
    search_results = search_results.dropna(subset=['lodgement-datetime'])

    # Sort by 'uprn' and 'lodgement_datetime' in descending order
    search_results = search_results.sort_values(by=['uprn', 'lodgement-datetime'], ascending=[True, False])

    search_results = search_results.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 'current-energy-rating': 'current_energy_rating'})

    # Keep only the most recent entry for each 'uprn'
    search_results = search_results.drop_duplicates(subset='uprn', keep='first')

    return search_results.head(25)

    # Optionally, save the filtered DataFrame to a new CSV file
    #search_results.to_csv('most_recent_epc_certificates.csv', index=False, columns=column_names)


def getPropertiesFromCSV():
    df = pd.read_csv('most_recent_epc_certificates.csv', low_memory=False)
    df = df.rename(columns={'property-type': 'property_type', 'current-energy-efficiency': 'current_energy_efficiency', 'current-energy-rating': 'current_energy_rating'})
    properties = df[['address', 'postcode', 'property_type', 'current_energy_efficiency', 'current_energy_rating']].head(25)
    return properties

search_after_page = None

first_request_page = True

#def getPropertiesByPage():
     