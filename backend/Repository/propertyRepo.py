import psycopg2
import pandas as pd
from dotenv import load_dotenv
import os
from psycopg2.extras import execute_values
import googlemaps
import time
import math

load_dotenv()

# Database connection parameters
DB_PARAMS = {
    "dbname": os.getenv('DATABASE_NAME'),
    "user": os.getenv('DATABASE_USER'),
    "password": os.getenv('DATABASE_PASSWORD'),
    "host": os.getenv('DATABASE_HOST'),
    "port": os.getenv('DATABASE_PORT')
}

def get_all_properties():
    """
    Retrieves all property records from the 'properties' table in the database.

    Returns:
        A list of dictionaries, where each dictionary represents a property record.
        Returns an empty list if an error occurs.
    """
    conn = None
    cursor = None
    try:
        # Connect to the PostgreSQL database using your DB parameters.
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Execute the query to select all records from the properties table.
        query = "SELECT * FROM properties"
        cursor.execute(query)
        data = cursor.fetchall()

        # Retrieve column names from the cursor description.
        columns = [desc[0] for desc in cursor.description]

        # Create a list of dictionaries, one for each record.
        properties_list = [dict(zip(columns, row)) for row in data]

        return properties_list

    except Exception as e:
        # Rollback in case of error and print the error message.
        if conn:
            conn.rollback()
        print("Error retrieving properties:", e)
        return []

    finally:
        # Ensure that the cursor and connection are closed properly.
        if cursor:
            cursor.close()
        if conn:
            conn.close()

"""
Connect to the database, wipe the properties table, and populate it with new data.
"""    
def update_properties_in_db(dataframe, local_authority):
    
    conn = None  # Ensure conn is defined before try block
    cursor = None  # Ensure cursor is also pre-defined
    
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Begin a transaction
        conn.autocommit = False

        # Step 1: Backup user_properties before deletion
        cursor.execute("SELECT * FROM user_properties")
        user_properties_data = cursor.fetchall()
        
        up_columns = ['user_id', 'uprn']
        
        user_properties_dataframe = pd.DataFrame(user_properties_data, columns=up_columns)
        
        cursor.execute("DELETE FROM user_properties")

        # Step 2: Wipe the properties table
        cursor.execute(
            "DELETE FROM properties WHERE local_authority = %s",
            (local_authority,)
        )

        # Step 3: Insert updated property data
        insert_data = [tuple(row) for row in dataframe.itertuples(index=False, name=None)]
        insert_query = """
            INSERT INTO properties (uprn, address, postcode, property_type, lodgement_datetime, 
                                    current_energy_efficiency, current_energy_rating, heating_cost_current, 
                                    hot_water_cost_current, lighting_cost_current, total_floor_area, 
                                    number_bedrooms, energy_consumption_current, local_authority)
            VALUES %s
        """
        execute_values(cursor, insert_query, insert_data)

        # Step 4: Restore user_properties with valid uprns
        up_data = [tuple(row) for row in user_properties_dataframe.itertuples(index=False, name=None)]
        if up_data:
            insert_user_properties_query = """
                INSERT INTO user_properties (user_id, uprn)
                VALUES %s
            """
            execute_values(cursor, insert_user_properties_query, up_data)

        # Step 5: Commit the transaction
        conn.commit()
        print("Database updated successfully with the latest property data.")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")
        return False

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    
    return True

"""
Updates the Inflation table in database to get the most up to date data
"""
def update_inflation_data_in_db(dataframe):
    conn = None  # Ensure conn is defined before try block
    cursor = None  # Ensure cursor is also pre-defined
    
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Begin a transaction
        conn.autocommit = False

        # Step 1: Wipe the inflation table
        cursor.execute("DELETE FROM inflation")

        # Step 2: Insert updated inflatio  data
        insert_data = [tuple(row) for row in dataframe.itertuples(index=False, name=None)]
        insert_query = """
            INSERT INTO inflation (date, cpih_value)
            VALUES %s
        """
        execute_values(cursor, insert_query, insert_data)

        # Step 3: Commit the transaction
        conn.commit()
        print("Database updated successfully with the latest inflation data.")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")
        return False

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    
    return True

"""
Returns the top 6 highest rated energy efficient properties from the database
"""            
def get_top_rated_from_db():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)    
        # Define the SQL query
        query_sql = """SELECT * FROM properties ORDER BY current_energy_efficiency DESC LIMIT 6;"""
    
        # Create a cursor to execute the query
        cur = conn.cursor()
        cur.execute(query_sql)
    
        # Fetch column names from the cursor description
        column_names = [desc[0] for desc in cur.description]
    
        # Fetch all rows from the query
        rows = cur.fetchall()
    
        # Close the cursor and connection
        cur.close()
        conn.close()
    
        # Convert rows to a Pandas DataFrame
        df = pd.DataFrame(rows, columns=column_names)
        
        return df
    except Exception as e:
        # Rollback in case of an error
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")

"""
Fetches properties filtered by property_types, energy_ratings, and a search term (address or postcode),
with optional sorting. Returns the results as a Pandas DataFrame.
"""
def get_data_from_db(property_types=None, energy_ratings=None, search=None, min_bedrooms = 1, max_bedrooms = 10, sort_by=None, order=None, page = 1, local_authority=None):
    
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Base query
        query = """
            SELECT * FROM properties WHERE 1 = 1
        """
        params = []
        
        if local_authority:
            query += " AND local_authority = %s"
            params.append(local_authority)

        # Dynamically append filters
        if property_types:
            query += " AND property_type = ANY(%s)"
            params.append(property_types)

        if energy_ratings:
            query += " AND current_energy_rating = ANY(%s)"
            params.append(energy_ratings)

        if search:
            query += " AND (address ILIKE %s OR postcode ILIKE %s)"
            params.extend([f"%{search}%", f"%{search}%"])
            
        query += " AND number_bedrooms BETWEEN %s AND %s"
        
        params.extend([min_bedrooms, max_bedrooms])

        # Append sorting
        if sort_by and order:
            # Ensure order is valid
            if order.lower() not in ['asc', 'desc']:
                raise ValueError(f"Invalid sort order: {order}")

            query += f" ORDER BY {sort_by} {order.lower()}"
            
        # Add pagination using LIMIT and OFFSET
        per_page = 30  # Fixed number of results per page
        offset = (page - 1) * per_page
        query += " LIMIT %s OFFSET %s"
        params.extend([per_page, offset])
        
        print(query)
        print(params)

        # Execute the query
        cursor.execute(query, params)
        results = cursor.fetchall()

        # Get column names from the cursor
        column_names = [desc[0] for desc in cursor.description]

        # Transform results into a Pandas DataFrame
        df = pd.DataFrame(results, columns=column_names)

        # Close the cursor and connection
        cursor.close()
        conn.close()

        return df

    except psycopg2.Error as e:
        print(f"Database error occurred: {e}")
        return f"An error occurred while fetching properties: {e}"

    except ValueError as ve:
        print(f"Value error: {ve}")
        return f"Invalid input: {ve}"

    except Exception as e:
        print(f"Unexpected error: {e}")
        return f"An unexpected error occurred: {e}"

"""
Retrieves all property data in a given postcode with a certain number of bedrooms
"""   
def get_area_data_from_db(postcode, number_bedrooms):
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)    
        # Define the SQL query
        query_sql = """SELECT * FROM properties WHERE postcode = %s AND number_bedrooms = %s;"""
        
        params = [postcode, number_bedrooms]
    
        # Create a cursor to execute the query
        cur = conn.cursor()
        cur.execute(query_sql, params)
    
        # Fetch column names from the cursor description
        column_names = [desc[0] for desc in cur.description]
    
        # Fetch all rows from the query
        rows = cur.fetchall()
    
        # Close the cursor and connection
        cur.close()
        conn.close()
    
        # Convert rows to a Pandas DataFrame
        df = pd.DataFrame(rows, columns=column_names)
        
        return df
    except Exception as e:
        # Rollback in case of an error
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")

"""
Retrieves a DataFrame with two rows:
1. The row with the latest CPIH value.
2. The row that matches the month and year of the given lodgement date.
"""     
def get_latest_and_lodgement_cpih(lodgement_date):
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        
        query = """
            (SELECT date, cpih_value FROM inflation ORDER BY date DESC LIMIT 1)
            UNION ALL
            (SELECT date, cpih_value FROM inflation WHERE date <= %s ORDER BY date DESC LIMIT 1);
        """
        
        cur = conn.cursor()
        cur.execute(query, (lodgement_date,))
        
        column_names = [desc[0] for desc in cur.description]
        
        rows = cur.fetchall()
        
        df = pd.DataFrame(rows, columns=column_names)
        
        conn.close()
        return df
    except Exception as e:
        print(f"Error retrieving CPIH data: {e}")
        return pd.DataFrame()


def update_properties_lat_long(google_maps_api_key):
    """
    Fetches each property's address and postcode from the 'properties' table,
    constructs a more complete address (including city and country),
    uses the Google Maps Geocoding API to find latitude and longitude,
    and then inserts/updates these coordinates in the 'property_spatial_data' table.
    """
    conn = None
    cursor = None
    gmaps = googlemaps.Client(key=google_maps_api_key)

    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # 1. Retrieve UPRN, address, and postcode from the 'properties' table.
        cursor.execute("SELECT uprn, address, postcode FROM properties")
        properties = cursor.fetchall()

        rows_to_insert = []
        for uprn, address, postcode in properties:
            if not address:
                continue

            # Construct a more detailed address string
            # e.g., "123 Example Street, L13 3DT, Liverpool, UK"
            full_address = f"{address}, {postcode}, Liverpool, UK"

            # Use the Google Maps Geocoding API
            try:
                geocode_result = gmaps.geocode(full_address)
                if geocode_result:
                    location = geocode_result[0]['geometry']['location']
                    lat = location['lat']
                    lng = location['lng']
                else:
                    print(f"Could not geocode address: {full_address}")
                    continue
            except Exception as e:
                print(f"Geocoding error for {full_address}: {e}")
                continue

            rows_to_insert.append((uprn, lat, lng))
            # Optional sleep to respect API rate limits
            

        # 2. Insert or update the lat/long values in 'property_spatial_data'
        #    ON CONFLICT will update existing rows if uprn already exists
        insert_query = """
            INSERT INTO property_spatial_data (uprn, latitude, longitude)
            VALUES %s
            ON CONFLICT (uprn) DO UPDATE
            SET latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude
        """

        if rows_to_insert:
            execute_values(cursor, insert_query, rows_to_insert)
            conn.commit()
            print("Latitude/Longitude data updated successfully in property_spatial_data.")
        else:
            print("No rows to insert/update for latitude/longitude.")

    except Exception as e:
        if conn:
            conn.rollback()
        print("Error in update_properties_lat_long:", e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points (lat/long) on Earth
    using the Haversine formula. Returns distance in kilometers.
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of Earth in kilometers
    return c * r

def update_properties_uni_distances(liverpool_coords, hope_coords, john_moores_coords):
    """
    For each row in 'property_spatial_data' (which must have lat/long),
    calculates distances to the three given university coordinates and updates
    the distance_uni_liverpool, distance_uni_hope, and distance_uni_john_moores columns.

    Args:
        liverpool_coords: (lat, lon) for University of Liverpool
        hope_coords: (lat, lon) for Liverpool Hope University
        john_moores_coords: (lat, lon) for Liverpool John Moores
    """
    conn = None
    cursor = None

    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # 1. Retrieve all rows that have lat/long from property_spatial_data
        cursor.execute("SELECT uprn, latitude, longitude FROM property_spatial_data")
        rows = cursor.fetchall()

        update_data = []
        for uprn, lat, lon in rows:
            # Skip if lat or lon is missing
            if lat is None or lon is None:
                continue

            # Calculate distances
            dist_liv = haversine(lat, lon, liverpool_coords[0], liverpool_coords[1])
            dist_hope = haversine(lat, lon, hope_coords[0], hope_coords[1])
            dist_jm = haversine(lat, lon, john_moores_coords[0], john_moores_coords[1])

            update_data.append((dist_liv, dist_hope, dist_jm, uprn))

        # 2. Update the table with the calculated distances
        update_query = """
            UPDATE property_spatial_data
            SET distance_uni_liverpool = %s,
                distance_uni_hope = %s,
                distance_uni_john_moores = %s
            WHERE uprn = %s
        """

        if update_data:
            cursor.executemany(update_query, update_data)
            conn.commit()
            print("University distances updated successfully.")
        else:
            print("No valid lat/long found for distance calculation.")

    except Exception as e:
        if conn:
            conn.rollback()
        print("Error in update_properties_uni_distances:", e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
