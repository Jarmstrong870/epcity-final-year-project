import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Database connection parameters
db_config = {
    'host': os.getenv('DATABASE_HOST'),  # Host address for the database
    'port': os.getenv('DATABASE_PORT'),  # Port number for the database connection
    'database': os.getenv('DATABASE_NAME'),  # Name of the database
    'user': os.getenv('DATABASE_USER'),  # Database username
    'password': os.getenv('DATABASE_PASSWORD')  # Password for the database user
}

class RegisterRepo:
    """
    Repository class to handle all database operations related to user registration.
    """

    @staticmethod
    def check_email_exists(email):
        """
        Check if an email address already exists in the `users` table.

        :param email: The email address to check
        :return: True if the email exists, False otherwise
        """
        try:
            # Establish a database connection
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor(cursor_factory=RealDictCursor)

            # Execute the SQL query to count matching email addresses
            cursor.execute("SELECT COUNT(*) AS count FROM users WHERE email_address = %s;", (email,))
            result = cursor.fetchone()

            # Return True if the count is greater than 0, indicating the email exists
            return result['count'] > 0
        except Exception as e:
            # Log any error that occurs
            print(f"Error checking if email exists: {e}")
            raise
        finally:
            # Ensure the cursor and connection are closed
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    @staticmethod
    def get_next_user_id():
        """
        Retrieve the next available user ID by incrementing the maximum `user_id` in the `users` table.

        :return: The next user ID as an integer
        """
        try:
            # Establish a database connection
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Execute the SQL query to calculate the next user ID
            cursor.execute("SELECT COALESCE(MAX(user_id), 0) + 1 AS next_id FROM users;")
            result = cursor.fetchone()

            # Return the calculated next user ID
            return result[0]
        except Exception as e:
            # Log any error that occurs
            print(f"Error fetching next user ID: {e}")
            raise
        finally:
            # Ensure the cursor and connection are closed
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    @staticmethod
    def insert_new_user(user_id, firstname, lastname, email, password_hash, user_type):
        """
        Insert a new user record into the `users` table.

        :param user_id: The user's unique ID
        :param firstname: The user's first name
        :param lastname: The user's last name
        :param email: The user's email address
        :param password_hash: The hashed password for the user
        :param user_type: The type of user (e.g., 'student', 'landlord')
        """
        try:
            # Establish a database connection
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Execute the SQL query to insert a new user record
            cursor.execute(
                """
                INSERT INTO users (user_id, firstname, lastname, email_address, password_hash, "userType")
                VALUES (%s, %s, %s, %s, %s, %s);
                """,
                (user_id, firstname, lastname, email, password_hash, user_type)
            )
            connection.commit()  # Commit the transaction to save changes
        except Exception as e:
            # Log any error that occurs
            print(f"Error inserting new user: {e}")
            raise
        finally:
            # Ensure the cursor and connection are closed
            if cursor:
                cursor.close()
            if connection:
                connection.close()


