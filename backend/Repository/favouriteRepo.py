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

def getFavouritePropertiesfromDB(email):
    """
    Fetch all properties linked to a specific user_id from the user_properties table.
    """
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()

    # SQL query to select all UPRNs for the given user_id
    query = """
        SELECT * FROM getFavourites(%s)
    """
    # Create a cursor to execute the query
    cur = conn.cursor()
    cur.execute(query, (email))
    
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

def addFavouriteToDB(email, uprn):
    """
    Adds a row to the user_properties table.
    """
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # SQL query to insert a new row into the user_properties table
        query = """
            SELECT addFavourite(%s, %s)
        """

        # Execute the query with provided user_id and uprn
        cursor.execute(query, (email, uprn))

        # Commit the transaction
        conn.commit()

        print(f"Successfully added user {email} with uprn {uprn} to user_properties.")
        return True

    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return False

    finally:
        # Ensure the cursor and connection are closed
        if conn:
            cursor.close()
            conn.close()
            
def removeFavouriteFromDB(email, uprn):
    """
    Removes a row from the user_properties table.
    """
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # SQL query to delete the specific row
        query = """
            SELECT removeFavourite(%s, %s)
        """

        # Execute the query with provided user_id and uprn
        cursor.execute(query, (email, uprn))

        # Commit the transaction
        conn.commit()

        # Check if any row was affected
        if cursor.rowcount > 0:
            print(f"Successfully removed {email} with uprn {uprn} from user_properties.")
            return True
        else:
            print(f"No matching row found for {email} with uprn {uprn}.")
            return False

    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return False

    finally:
        # Ensure the cursor and connection are closed
        if conn:
            cursor.close()
            conn.close()
        