from io import StringIO
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
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors

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
        'number-habitable-rooms': 'number_bedrooms',
        'energy-consumption-current': 'energy_consumption_current'
    })
    
    # Define the required columns to keep
    required_columns = [
        'uprn', 'address', 'postcode', 'property_type', 'lodgement_datetime',
        'current_energy_efficiency', 'current_energy_rating', 'heating_cost_current',
        'hot_water_cost_current', 'lighting_cost_current', 'total_floor_area',
        'number_bedrooms', 'energy_consumption_current'
    ]

    # Ensure only these columns are retained
    search_results = search_results[required_columns]
    
    # Define numeric columns
    numeric_columns = [
        'heating_cost_current', 'hot_water_cost_current', 'lighting_cost_current', 
        'number_bedrooms', 'current_energy_efficiency', 'total_floor_area', 'energy_consumption_current'
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
    search_results = search_results.dropna(subset=['energy_consumption_current'])
        
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
    query_params = { 'uprn': uprn}

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
    inflation_rate = calculate_inflation_rate(start_date)

    if inflation_rate is None:
        return df  # Return original DataFrame if API call fails

    # Adjust costs to inflation
    for col in cost_columns:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: adjust_cost(float(x), inflation_rate) if pd.notna(x) else None)
            
    # Convert annual costs to daily costs
    df['heating_daily'] = df['heating_cost_current'] / 365
    df['lighting_daily'] = df['lighting_cost_current'] / 365
    df['hot_water_daily'] = df['hot_water_cost_current'] / 365

    # Calculate real-world examples
    df['heating_example'] = df['heating_daily'] * 2  # 2 full days (weekend)
    df['hot_water_example'] = df['hot_water_daily'] / 48  # Half-hour shower (assuming 24 hours per day)
    df['lighting_example'] = df['lighting_daily'] / 3  # 8 hours overnight (assuming 24-hour reference)

    # Drop intermediate daily cost columns if not needed
    df.drop(columns=['heating_daily', 'lighting_daily', 'hot_water_daily'], inplace=True)

    # Set locale for currency formatting
    locale.setlocale(locale.LC_ALL, 'en_GB.UTF-8')

    # Convert adjusted costs to currency format in a separate column
    for col in cost_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')  # Ensure numeric format
            df[f"{col}_formatted"] = df[col].apply(lambda x: locale.currency(x) if pd.notna(x) else None)
            
    examples = ['heating_example', 'hot_water_example', 'lighting_example']
    
    for col in examples:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')  # Ensure numeric format
            df[f"{col}_formatted"] = df[col].apply(lambda x: locale.currency(x) if pd.notna(x) else None)

    # # Compute monthly & weekly costs
    # for col in cost_columns:
    #     if col in df.columns:
    #         df[f"{col}_monthly"] = round(df[col] / 12, 2)  # Divide annual cost by 12
    #         df[f"{col}_weekly"] = round(df[col] / 52, 2)  # Divide annual cost by 52

    #         # Store formatted currency versions separately
    #         df[f"{col}_monthly_formatted"] = df[f"{col}_monthly"].apply(
    #             lambda x: locale.currency(x, grouping=True) if pd.notna(x) else None
    #         )
    #         df[f"{col}_weekly_formatted"] = df[f"{col}_weekly"].apply(
    #             lambda x: locale.currency(x, grouping=True) if pd.notna(x) else None
    #         )

    # cost_per_kwh = 0.2542  # Define the cost per kWh

    # # Add cost_per_kwh column
    # df['cost_per_kwh'] = cost_per_kwh

    # Convert to numeric and fill missing values with NaN
    df['number_habitable_rooms'] = pd.to_numeric(df['number_habitable_rooms'], errors='coerce')

    # Compute number of bedrooms, ensuring a minimum of 1
    df['number_bedrooms'] = df['number_habitable_rooms'].apply(
        lambda x: x - 1 if pd.notna(x) and x >= 2 else 1
    )

    # Add energy_consumption_cost column
    # df['energy_consumption_current'] = pd.to_numeric(df['energy_consumption_current'], errors='coerce')
    # df['total_floor_area'] = pd.to_numeric(df['total_floor_area'], errors='coerce')
    # total_floor_area = df['total_floor_area']

    # # Compute annual energy cost
    # df['energy_consumption_cost'] = df['energy_consumption_current'].apply(
    #     lambda x: cost_per_kwh * x * total_floor_area if pd.notna(x) else None
    # )

    # # Format as currency
    # df['energy_consumption_cost_formatted'] = df['energy_consumption_cost'].apply(
    #     lambda x: locale.currency(x, grouping=True) if pd.notna(x) else None
    # )
        
    return df


"""
Fetches CPI data for Actual Rentals for housing from the Office of National Statistics
"""
def fetch_cpih_data():
    csv_url = "https://download.beta.ons.gov.uk/downloads/datasets/cpih01/editions/time-series/versions/54.csv"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    req = urllib.request.Request(csv_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            csv_data = response.read().decode("utf-8")
        
        data = StringIO(csv_data)
        df = pd.read_csv(data)
        
        # Filter for '04.1 Actual rentals for housing'
        df_filtered = df[df["Aggregate"] == "04.1 Actual rentals for housing"]
        df_filtered = df_filtered.rename(columns={"Time": "date", "v4_0": "cpih_value"})
        df_filtered["date"] = pd.to_datetime(df_filtered["date"], format='%b-%y')
        df_filtered = df_filtered.sort_values(by='date', ascending=False)
        
        # Keep only relevant columns
        df_filtered = df_filtered[["date", "cpih_value"]]
        
        return repo.update_inflation_data_in_db(df_filtered)
    
    except Exception as e:
        print(f"Error fetching CPIH data: {e}")
        return False

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

"""
Retrieves CPIH data and calculates the inflation rate for the property.
"""
def calculate_inflation_rate(lodgement_date):
    df = repo.get_latest_and_lodgement_cpih(lodgement_date)
    
    if df.empty or len(df) < 2:
        print("Insufficient CPIH data to calculate inflation rate.")
        return None
    
    latest_cpih = df.iloc[0]['cpih_value']
    lodgement_cpih = df.iloc[1]['cpih_value']
    
    if pd.isna(latest_cpih) or pd.isna(lodgement_cpih) or lodgement_cpih == 0:
        print("Invalid CPIH values for inflation calculation.")
        return None
    
    inflation_rate = ((latest_cpih - lodgement_cpih) / lodgement_cpih) * 100
    return round(inflation_rate, 2)

"""
Adjusts results from repo method by adjusting costs for inflation
"""
def get_properties_from_area(postcode, number_bedrooms):
    properties = repo.get_area_data_from_db(postcode, number_bedrooms)

    # Define the cost columns to process
    cost_columns = ['hot_water_cost_current', 'heating_cost_current', 'lighting_cost_current']

    # Convert cost columns to numeric
    properties[cost_columns] = properties[cost_columns].apply(pd.to_numeric, errors='coerce')

    # Ensure there are no missing values before proceeding
    if not properties.isnull().values.any():
        for index, row in properties.iterrows():  # Corrected row iteration
            properties.at[index, 'lodgement_datetime'] = pd.to_datetime(
                row['lodgement_datetime'], format='mixed', errors='coerce'
            ).date()
            
            start_date = properties.at[index, 'lodgement_datetime']
            inflation_rate = calculate_inflation_rate(start_date)

            for col in cost_columns:
                properties.at[index, col] = adjust_cost(row[col], inflation_rate)

    return properties

"""
Adjusts heating, lighting, and hot water costs based on the inflation rate.
"""
def adjust_cost(cost, inflation_rate):
    """Adjusts a given cost by the inflation rate."""
    if inflation_rate is None:
        print("Inflation rate is not available. Returning original costs.")
        return cost  # Return original value if inflation data is missing
    
    try:
        adjusted_cost = round(float(cost) * (1 + float(inflation_rate) / 100), 2)
        return adjusted_cost
    except (TypeError, ValueError) as e:
        print(f"Error adjusting cost: {e}")
        return cost  # Fallback to original cost if adjustment fails

def recommend_by_knn(user_prefs):
    """
    Recommends properties based on user preferences and proximity to a selected university using KNN.

    Expected user_prefs example:
    {
        "number_bedrooms": 3,
        "current_energy_rating": "B",
        "property_type": "HOUSE",
        "selectedUniversity": "liverpool",   # or "johnmoores" or "hope"
        "maxDistance": 10                     # maximum distance in kilometers
    }
    """
    # Retrieve all property data from the repository.
    # (Assumes properties table has been joined with spatial data columns)
    all_props = repo.get_all_properties()
    df = pd.DataFrame(all_props)
    
    # --- Filter by Distance to Selected University ---
    if "selectedUniversity" in user_prefs and "maxDistance" in user_prefs:
        uni = user_prefs["selectedUniversity"].lower()
        try:
            max_dist = float(user_prefs["maxDistance"])
        except ValueError:
            max_dist = None
        # Mapping from user-friendly key to the column name in the dataframe.
        mapping = {
            "liverpool": "distance_uni_liverpool",
            "johnmoores": "distance_uni_john_moores",
            "hope": "distance_uni_hope"
        }
        distance_col = mapping.get(uni)
        if distance_col and max_dist is not None and distance_col in df.columns:
            df = df[df[distance_col] <= max_dist]
    
    # --- Standardise and Process Features ---
    df['property_type'] = df['property_type'].str.upper()
    df['number_bedrooms'] = pd.to_numeric(df['number_bedrooms'], errors='coerce').fillna(0)
    
    # Map EPC rating letter to numeric value (lower is better)
    epc_mapping = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7}
    df['current_energy_rating'] = df['current_energy_rating'].str.upper().map(epc_mapping).fillna(8)
    
    # One-hot encode the property type.
    property_type_dummies = pd.get_dummies(df['property_type'], prefix='type')
    df = pd.concat([df, property_type_dummies], axis=1)
    
    # --- Build the User Preference Vector ---
    user_vector = []
    
    # a) Number of bedrooms
    try:
        user_bedrooms = int(user_prefs.get('number_bedrooms', 0))
    except ValueError:
        user_bedrooms = 0
    user_vector.append(user_bedrooms)
    
    # b) EPC Rating
    user_epc = user_prefs.get('current_energy_rating', 'G')
    user_epc_numeric = epc_mapping.get(user_epc.upper(), 8)
    user_vector.append(user_epc_numeric)
    
    # c) Property Type: Create a one-hot vector matching the dummy columns
    property_type_columns = property_type_dummies.columns.tolist()
    user_property_type = user_prefs.get('property_type', '').upper()
    property_vector = [1 if col == f"type_{user_property_type}" else 0 for col in property_type_columns]
    user_vector.extend(property_vector)
    
    # Debug prints to help verify the vector and columns.
    print("User vector:", user_vector)
    print("Property type columns:", property_type_columns)
    
    # --- Prepare the Feature Matrix for KNN ---
    feature_columns = ['number_bedrooms', 'current_energy_rating'] + property_type_columns
    feature_matrix = df[feature_columns].values
    
    # --- Build and Apply the KNN Model ---
    from sklearn.neighbors import NearestNeighbors
    knn = NearestNeighbors(n_neighbors=5, metric='euclidean')
    knn.fit(feature_matrix)
    
    # Convert the user vector to a 2D numpy array (required by scikit-learn)
    import numpy as np
    user_vector_np = np.array([user_vector])
    distances, indices = knn.kneighbors(user_vector_np)
    
    recommended = df.iloc[indices[0]].to_dict(orient='records')
    return recommended
