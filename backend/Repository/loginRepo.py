from psycopg2 import connect
from psycopg2.extras import RealDictCursor
import os

# Database configuration
db_config = {
    "host": os.getenv("DATABASE_HOST"),
    "port": os.getenv("DATABASE_PORT"),
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD"),
}


def find_user_by_email(email):
    """
    Fetch a user's details by their email address from the database.
    :param email: The user's email address
    :return: A dictionary with user details or None if no user is found
    """
    try:
        # Establish a connection to the database
        with connect(**db_config) as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                # SQL query to find the user
                cursor.execute(
                    "SELECT firstname, lastname, password_hash FROM users WHERE email_address = %s;",
                    (email,)
                )
                # Fetch and return the user record
                return cursor.fetchone()  # None if no user is found
    except Exception as e:
        print(f"Error finding user by email: {e}")
        return None

