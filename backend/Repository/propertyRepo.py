import datetime
import psycopg2
import pandas as pd
from dotenv import load_dotenv
import os
from psycopg2.extras import execute_values
import googlemaps
import time
import math
import csv
import re

load_dotenv()

# Database connection parameters
DB_PARAMS = {
    "dbname": os.getenv('DATABASE_NAME'),
    "user": os.getenv('DATABASE_USER'),
    "password": os.getenv('DATABASE_PASSWORD'),
    "host": os.getenv('DATABASE_HOST'),
    "port": os.getenv('DATABASE_PORT')
}

ALLOWED_SORT_COLUMNS = {"current_energy_efficiency", "number_bedrooms", "current_energy_rating"}


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


def execute_query(user_prefs):
    query = """
    SELECT p.*, pc.latitude AS property_lat, pc.longitude AS property_lon
    FROM properties p
    JOIN postcode_coordinates pc ON p.postcode = pc.postcode
    JOIN university_distances ud ON p.postcode = ud.postcode
    WHERE p.local_authority = %s
      AND ud.university = %s
      AND ud.distance < %s;
    """
    params = (
        user_prefs['local_authority'],
        user_prefs['selectedUniversity'],
        user_prefs['maxDistance']
    )
    
    conn = None
    cursor = None
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        cursor.execute(query, params)
        data = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        results = [dict(zip(columns, row)) for row in data]
        return results
    except Exception as e:
        if conn:
            conn.rollback()
        print("Error executing query:", e)
        return []
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

"""
Connect to the database, wipe the properties table, and populate it with new data.
"""    
def update_properties_in_db(dataframe, local_authority):
    
    conn = None  # Ensure conn is defined before try block
    cur = None  # Ensure cursor is also pre-defined
    
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # Begin a transaction
        conn.autocommit = False

        # Step 1: Backup user_properties before deletion
        cur.execute("SELECT * FROM user_properties")
        user_properties_data = cur.fetchall()
        
        up_columns = ['user_id', 'uprn']
        
        user_properties_dataframe = pd.DataFrame(user_properties_data, columns=up_columns)
        
        cur.execute("DELETE FROM user_properties")

        # Step 2: Wipe the properties table
        cur.execute(
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
        execute_values(cur, insert_query, insert_data)

        # Step 4: Restore user_properties with valid uprns
        up_data = [tuple(row) for row in user_properties_dataframe.itertuples(index=False, name=None)]
        if up_data:
            insert_user_properties_query = """
                INSERT INTO user_properties (user_id, uprn)
                VALUES %s
            """
            execute_values(cur, insert_user_properties_query, up_data)

        # Step 5: Commit the transaction
        conn.commit()
        print("Database updated successfully with the latest property data.")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")
        return False

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return True

"""
Updates the Inflation table in database to get the most up to date data
"""
def update_inflation_data_in_db(dataframe):
    conn = None  # Ensure conn is defined before try block
    cur = None  # Ensure cursor is also pre-defined
    
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # Begin a transaction
        conn.autocommit = False

        # Step 1: Wipe the inflation table
        cur.execute("DELETE FROM inflation")

        # Step 2: Only insert data if DataFrame is NOT empty
        if not dataframe.empty:
            insert_data = [tuple(row) for row in dataframe.itertuples(index=False, name=None)]
            insert_query = """
                INSERT INTO inflation (date, cpih_value)
                VALUES %s
            """
            execute_values(cur, insert_query, insert_data)  # This is now only called if `dataframe` has data

        # Step 3: Commit the transaction
        conn.commit()
        print("Database updated successfully with the latest inflation data.")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")
        return False

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return True

"""
Returns the top 6 highest rated energy efficient properties from the database
"""            
def get_top_rated_from_db():
    conn = None
    cur = None
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
    
        # Convert rows to a Pandas DataFrame
        df = pd.DataFrame(rows, columns=column_names)
        
        return df
    
    except Exception as e:
        # Rollback in case of an error
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")
        
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

"""
Fetches properties filtered by property_types, energy_ratings, and a search term (address or postcode),
with optional sorting. Returns the results as a Pandas DataFrame.
"""
def get_data_from_db(property_types=None, energy_ratings=None, search=None, min_bedrooms=1, max_bedrooms=10, sort_by=None, order=None, page=1, local_authority=None):
    conn = None
    cur = None
    try:
        # Connect to PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # Base query
        query = "SELECT * FROM properties WHERE 1 = 1"
        params = []

        # Filters
        if local_authority:
            query += " AND local_authority = %s"
            params.append(local_authority)

        if property_types:
            query += " AND property_type = ANY(%s)"
            params.append(property_types)

        if energy_ratings:
            query += " AND current_energy_rating = ANY(%s)"
            params.append(energy_ratings)

        if search:
            # Remove wildcards to prevent abuse
            search = re.sub(r"[%_]", "", search)
            query += " AND (address ILIKE %s OR postcode ILIKE %s)"
            params.extend([f"%{search}%", f"%{search}%"])

        query += " AND number_bedrooms BETWEEN %s AND %s"
        params.extend([min_bedrooms, max_bedrooms])

        # Validate `sort_by` before appending
        if sort_by in ALLOWED_SORT_COLUMNS:
            if order.lower() not in ["asc", "desc"]:
                raise ValueError(f"Invalid sort order: {order}")
            query += f" ORDER BY {sort_by} {order.lower()}"

        # Pagination
        per_page = 10
        offset = (page - 1) * per_page
        query += " LIMIT %s OFFSET %s"
        params.extend([per_page, offset])

        # Execute safely
        cur.execute(query, params)
        results = cur.fetchall()

        # Transform results into DataFrame
        column_names = [desc[0] for desc in cur.description]
        df = pd.DataFrame(results, columns=column_names)

        return df

    except psycopg2.Error as e:
        return f"An error occurred while fetching properties: {e}"

    except ValueError as ve:
        return f"Invalid input: {ve}"

    except Exception as e:
        return f"An unexpected error occurred: {e}"

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

"""
Retrieves all property data in a given postcode with a certain number of bedrooms
"""   
def get_area_data_from_db(postcode, number_bedrooms):
    conn = None  # Ensure conn is defined
    cur = None   # Ensure cur is defined
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
    
        # Convert rows to a Pandas DataFrame
        df = pd.DataFrame(rows, columns=column_names)
        
        return df
    
    except Exception as e:
        # Rollback in case of an error
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")
    
    finally:
        if cur:  # Always close the cursor
            cur.close()
        if conn:  # Always close the connection
            conn.close()

"""
Retrieves a DataFrame with two rows:
1. The row with the latest CPIH value.
2. The row that matches the month and year of the given lodgement date.
"""     
def get_latest_and_lodgement_cpih(lodgement_date):
    conn = None  # Ensure conn is defined
    cur = None   # Ensure cur is defined
    
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()
        
        if isinstance(lodgement_date, str):
            lodgement_date = datetime.datetime.strptime(lodgement_date, "%Y-%m-%d").date()
        
        query = """
            (SELECT date, cpih_value FROM inflation ORDER BY date DESC LIMIT 1)
            UNION ALL
            (SELECT date, cpih_value FROM inflation WHERE date <= %s ORDER BY date DESC LIMIT 1);
        """.strip()
        
        cur.execute(query, (lodgement_date,))  # Ensure execute is called correctly
        column_names = [desc[0] for desc in cur.description]
        
        print(f"DEBUG: Columns returned from DB - {column_names}")  # Debugging print
        
        rows = cur.fetchall()
        
        print(f"DEBUG: DataFrame returned:\n{rows}")  # Debugging print

        
        return pd.DataFrame(rows, columns=column_names)
    
    except Exception as e:
        print(f"Error retrieving CPIH data: {e}")
        return pd.DataFrame()

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()




def populate_postcode_coordinates_for_local_authority(
    google_maps_api_key,
    local_authority,
    sleep_time=0.1,
    batch_size=100
):
    """
    Fetches distinct postcodes for the given local authority from the 'properties' table
    that have no latitude/longitude values in the 'postcode_coordinates' table,
    uses the Google Maps Geocoding API to retrieve latitude and longitude for each postcode,
    and inserts/updates these values in the 'postcode_coordinates' table in batches.
    Additionally, writes the geocoding results to a local CSV file.
    """
    gmaps = googlemaps.Client(key=google_maps_api_key)
    conn = None
    cursor = None
    # Specify the CSV file path (adjust the path as needed)
    csv_filename = f"C:\\Users\\carlk\\Dissertation\\postcode_coordinates_{local_authority}.csv"

    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Retrieve distinct postcodes for the specified local authority
        # that either have no record in postcode_coordinates or have null lat/long values.
        cursor.execute("""
            SELECT DISTINCT p.postcode
            FROM properties p
            LEFT JOIN postcode_coordinates pc ON p.postcode = pc.postcode
            WHERE p.local_authority = %s
              AND p.postcode IS NOT NULL
              AND (pc.latitude IS NULL OR pc.longitude IS NULL)
        """, (local_authority,))
        postcodes = [row[0] for row in cursor.fetchall()]

        print(f"Processing {len(postcodes)} postcodes for local authority: {local_authority}")

        insert_query = """
            INSERT INTO postcode_coordinates (postcode, local_authority, latitude, longitude)
            VALUES %s
            ON CONFLICT (postcode) DO UPDATE
            SET local_authority = EXCLUDED.local_authority,
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude;
        """

        data_to_insert = []

        # Open the CSV file for writing. This overwrites any existing file.
        with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            # Write CSV header
            writer.writerow(["postcode", "local_authority", "latitude", "longitude"])

            for postcode in postcodes:
                full_address = f"{postcode}, UK"

                try:
                    geocode_result = gmaps.geocode(full_address)
                    if geocode_result:
                        location = geocode_result[0]['geometry']['location']
                        lat = location['lat']
                        lng = location['lng']
                        data_to_insert.append((postcode, local_authority, lat, lng))
                    else:
                        print(f"No geocode result for {full_address}")
                except Exception as e:
                    print(f"Error geocoding {full_address}: {e}")
                    continue

                # Respect rate limits
                time.sleep(sleep_time)

                # When we've collected a full batch, insert into DB and write to CSV
                if len(data_to_insert) >= batch_size:
                    try:
                        execute_values(cursor, insert_query, data_to_insert)
                        conn.commit()
                        print(f"Inserted a batch of {len(data_to_insert)} records.")
                        writer.writerows(data_to_insert)
                        data_to_insert = []  # Clear the batch
                    except psycopg2.OperationalError as op_err:
                        print("Operational error during batch insertion:", op_err)
                        if conn and conn.closed == 0:
                            conn.rollback()
                        conn = psycopg2.connect(**DB_PARAMS)
                        cursor = conn.cursor()
                        execute_values(cursor, insert_query, data_to_insert)
                        conn.commit()
                        writer.writerows(data_to_insert)
                        print(f"Retried and inserted a batch of {len(data_to_insert)} records.")
                        data_to_insert = []

            # Insert any leftover records.
            if data_to_insert:
                try:
                    execute_values(cursor, insert_query, data_to_insert)
                    conn.commit()
                    print(f"Inserted the final batch of {len(data_to_insert)} records.")
                    writer.writerows(data_to_insert)
                except psycopg2.OperationalError as op_err:
                    print("Operational error during final batch insertion:", op_err)
                    if conn and conn.closed == 0:
                        conn.rollback()
                    conn = psycopg2.connect(**DB_PARAMS)
                    cursor = conn.cursor()
                    execute_values(cursor, insert_query, data_to_insert)
                    conn.commit()
                    writer.writerows(data_to_insert)
                    print(f"Retried and inserted the final batch of {len(data_to_insert)} records.")

        print(f"Finished processing local authority: {local_authority}")
        print(f"Data written to CSV file: {csv_filename}")

    except Exception as e:
        if conn and conn.closed == 0:
            conn.rollback()
        print("Error in populate_postcode_coordinates_for_local_authority:", e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
