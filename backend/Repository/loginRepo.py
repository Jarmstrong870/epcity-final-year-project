import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime

# Database connection configuration
db_config = {
    "host": os.getenv("DATABASE_HOST"),
    "port": os.getenv("DATABASE_PORT"),
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD"),
}

def update_user_last_active(email):
    """
    Updates the last active timestamp for a user.
    :param email: The user's email address
    """
    try:
        with psycopg2.connect(**db_config) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "UPDATE users SET last_active = %s WHERE email_address = %s;",
                    (datetime.utcnow(), email)
                )
                connection.commit()
                print(f"Last active time updated for user {email}")
    except Exception as e:
        print(f"Error updating last active time: {e}")

def find_user_by_email(email):
    """
    Fetches user details by email.
    :param email: The user's email address
    :return: Dictionary containing user details or None if not found
    """
    try:
        # Establish a database connection
        with psycopg2.connect(**db_config) as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                
                cursor.execute(
                    """
                    SELECT firstname, lastname, password_hash, is_admin, is_blocked, user_type 
                    FROM users WHERE email_address = %s;
                    """,
                    (email,)
                )
                user = cursor.fetchone()

                if not user:
                    return None

                if user["is_blocked"]:
                    return {"error": "This account has been blocked. Please contact support."}

                return {
                    "firstname": user["firstname"],
                    "lastname": user["lastname"],
                    "password_hash": user["password_hash"],
                    "is_admin": user["is_admin"],
                    "user_type": user["user_type"]
                }
    except Exception as e:
        print(f"Error finding user by email: {e}")
        return None


