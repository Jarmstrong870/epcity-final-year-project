import psycopg2
import pandas as pd
from dotenv import load_dotenv
import os

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
Fetch details of multiple properties based on their UPRN values.
Returns a pandas DataFrame with property details.
"""
def get_properties_by_uprns(uprns):
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # SQL query using `ANY()` for flexible UPRN filtering
        query = """
            SELECT * FROM properties WHERE uprn = ANY(%s)
        """
        
        # Execute the query with the UPRN values
        cur.execute(query, (uprns,))
        
        # Fetch column names
        column_names = [desc[0] for desc in cur.description]

        # Fetch all rows
        rows = cur.fetchall()

        # Convert to a pandas DataFrame
        df = pd.DataFrame(rows, columns=column_names)

        return df

    except psycopg2.Error as e:
        print(f" Database error: {e}")
        return None

    finally:
        cur.close()
        conn.close()
