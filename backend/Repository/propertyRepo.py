import psycopg2
import pandas as pd
from dotenv import load_dotenv
import os
from psycopg2.extras import execute_values

load_dotenv()

# Database connection parameters
DB_PARAMS = {
    "dbname": os.getenv('DATABASE_NAME'),
    "user": os.getenv('DATABASE_USER'),
    "password": os.getenv('DATABASE_PASSWORD'),
    "host": os.getenv('DATABASE_HOST'),
    "port": os.getenv('DATABASE_PORT')
}
    
def updatePropertiesInDB(dataframe):
    """
    Connect to the database, wipe the properties table, and populate it with new data.
    """
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Begin a transaction
        conn.autocommit = False

        # Wipe the existing data
        cursor.execute("DELETE FROM properties")
        
        # Prepare data for insertion
        #records = dataframe.to_records(index=False)
        insert_data = [list(row) for row in dataframe.itertuples(index=False)]

        # Bulk insert into the properties table
        insert_query = """
            INSERT INTO properties (uprn, address, postcode, property_type, lodgement_datetime, 
                                    current_energy_efficiency, current_energy_rating, heating_cost_current, hot_water_cost_current, lighting_cost_current, total_floor_area)
            VALUES %s
        """
        execute_values(cursor, insert_query, insert_data)

        # Commit the transaction
        conn.commit()

        print("Database updated successfully with the latest property data.")

    except Exception as e:
        # Rollback in case of an error
        if conn:
            conn.rollback()
        print(f"An error occurred: {e}")

    finally:
        # Close the connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
def getTopRatedFromDB():
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

def get_data_from_db(property_types=None, energy_ratings=None, search=None, sort_by=None, order=None):
    """
    Fetches properties filtered by property_types, energy_ratings, and a search term (address or postcode),
    with optional sorting and fixed pagination (30 results per page). Returns the results as a Pandas DataFrame.
    """
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Base query
        query = """
            SELECT * FROM properties WHERE 1=1
        """
        params = []

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

        # Append sorting
        if sort_by and order:
            # Ensure order is valid
            if order.lower() not in ['asc', 'desc']:
                raise ValueError(f"Invalid sort order: {order}")

            query += f" ORDER BY {sort_by} {order.lower()}"

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