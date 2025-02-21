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

"""
Fetch all properties linked to a user's email from the user_properties table
"""
def get_favourite_properties_from_db(email):
    try: 
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # SQL query to select all UPRNs for the given email
        query = """
            SELECT * FROM getFavourites(%s)
        """
    
        # Create a cursor to execute the query
        cur = conn.cursor()
        cur.execute(query, (email,))
    
        # Fetch column names from the cursor description
        column_names = [desc[0] for desc in cur.description]
    
        # Fetch all rows from the query
        rows = cur.fetchall()
    
        # Close the cursor and connection
        cur.close()
        conn.close()
    
        # Convert rows to a Pandas DataFrame
        df = pd.DataFrame(rows, columns=column_names)
        
        # Return the dataframe
        return df
    
    # Database exception
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return []

"""
Adds a row to the user_properties table using the user's email and uprn
"""
def add_favourite_to_db(email, uprn):
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # SQL query to insert a new row into the user_properties table
        query = """
            SELECT addFavourite(%s, %s)
        """

        # Execute the query with provided email and uprn
        cursor.execute(query, (email, uprn))

        # Commit the transaction
        conn.commit()
        
        # Closes the cursor and connection
        cursor.close()
        conn.close()

        # Returns true if successful
        print(f"Successfully added user {email} with uprn {uprn} to user_properties.")
        return True

    # Database exception
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return False
            
"""
Removes a row from the user_properties table using the user's email and upn
"""          
def remove_favourite_from_db(email, uprn):
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
            cursor.close()
            conn.close()
            print(f"Successfully removed {email} with uprn {uprn} from user_properties.")
            return True
        else:
            cursor.close()
            conn.close()
            print(f"No matching row found for {email} with uprn {uprn}.")
            return False

    # Database exception
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return False   