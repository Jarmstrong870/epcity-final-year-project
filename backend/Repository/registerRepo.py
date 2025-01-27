import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Database connection parameters
db_config = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

class RegisterRepo:

    @staticmethod
    def check_email_exists(email):
        """Check if an email already exists in the users table."""
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor(cursor_factory=RealDictCursor)

            cursor.execute("SELECT COUNT(*) AS count FROM users WHERE email_address = %s;", (email,))
            result = cursor.fetchone()

            return result['count'] > 0  # Return True if the email exists
        except Exception as e:
            print(f"Error checking if email exists: {e}")
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    @staticmethod
    def get_next_user_id():
        """Retrieve the next user ID by incrementing the maximum user_id."""
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            cursor.execute("SELECT COALESCE(MAX(user_id), 0) + 1 AS next_id FROM users;")
            result = cursor.fetchone()

            return result[0]  # Return the next user ID
        except Exception as e:
            print(f"Error fetching next user ID: {e}")
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    @staticmethod
    def insert_new_user(user_id, firstname, lastname, email, password_hash, user_type):
        """Insert a new user into the users table."""
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            cursor.execute(
                """
                INSERT INTO users (user_id, firstname, lastname, email_address, password_hash, "userType")
                VALUES (%s, %s, %s, %s, %s, %s);
                """,
                (user_id, firstname, lastname, email, password_hash, user_type)
            )
            connection.commit()
        except Exception as e:
            print(f"Error inserting new user: {e}")
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

