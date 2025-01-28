import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Database configuration
# These parameters are pulled from environment variables to establish a connection with the PostgreSQL database.
db_config = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

class AccountOverviewRepo:
    """
    Repository class for database operations related to account management.
    This class handles the direct interaction with the database for account-related functionality.
    """

    @staticmethod
    def get_password_hash(email):
        """
        Retrieve the hashed password for a given user's email address.

        :param email: The email address of the user.
        :return: The password hash if the email exists, otherwise None.
        """
        try:
            # Connect to the database
            with psycopg2.connect(**db_config) as conn:
                with conn.cursor() as cursor:
                    # Execute the query to fetch the password hash
                    cursor.execute("SELECT password_hash FROM users WHERE email_address = %s;", (email,))
                    result = cursor.fetchone()
                    # Return the password hash if a record is found
                    return result[0] if result else None
        except Exception as e:
            print(f"Error fetching password hash: {e}")
            return None

    @staticmethod
    def update_password(email, new_password_hash):
        """
        Update the hashed password for a given user's email address.

        :param email: The email address of the user.
        :param new_password_hash: The new hashed password to be updated.
        :return: True if the update was successful, otherwise False.
        """
        try:
            # Connect to the database
            with psycopg2.connect(**db_config) as conn:
                with conn.cursor() as cursor:
                    # Execute the query to update the password hash
                    cursor.execute(
                        "UPDATE users SET password_hash = %s WHERE email_address = %s;",
                        (new_password_hash, email)
                    )
                    # Return True if at least one row was updated
                    return cursor.rowcount > 0
        except Exception as e:
            print(f"Error updating password: {e}")
            return False

    @staticmethod
    def delete_user(email):
        """
        Delete a user by their email address.

        :param email: The email address of the user to be deleted.
        :return: True if the deletion was successful, otherwise False.
        """
        try:
            # Connect to the database
            with psycopg2.connect(**db_config) as conn:
                with conn.cursor() as cursor:
                    # Execute the query to delete the user
                    cursor.execute("DELETE FROM users WHERE email_address = %s;", (email,))
                    # Return True if at least one row was deleted
                    return cursor.rowcount > 0
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False

    @staticmethod
    def update_user_details(email, firstname, lastname):
        """
        Update the user's first name and last name.

        :param email: The email address of the user.
        :param firstname: The new first name of the user.
        :param lastname: The new last name of the user.
        :return: True if the update was successful, otherwise False.
        """
        try:
            # Connect to the database
            with psycopg2.connect(**db_config) as conn:
                with conn.cursor() as cursor:
                    # Execute the query to update the user's details
                    cursor.execute(
                        "UPDATE users SET firstname = %s, lastname = %s WHERE email_address = %s;",
                        (firstname, lastname, email)
                    )
                    # Return True if at least one row was updated
                    return cursor.rowcount > 0
        except Exception as e:
            print(f"Error updating user details: {e}")
            return False

    @staticmethod
    def update_profile_image_url(email, public_url):
        """
        Update the profile image URL for a user.

        :param email: The email address of the user.
        :param public_url: The new public URL of the user's profile image.
        :return: True if the update was successful, otherwise False.
        """
        try:
            # Connect to the database
            with psycopg2.connect(**db_config) as conn:
                with conn.cursor() as cursor:
                    # Execute the query to update the profile image URL
                    cursor.execute(
                        "UPDATE users SET profile_image_url = %s WHERE email_address = %s;",
                        (public_url, email)
                    )
                    # Return True if at least one row was updated
                    return cursor.rowcount > 0
        except Exception as e:
            print(f"Error updating profile image URL: {e}")
            return False

    @staticmethod
    def get_user_details(email):
        """
        Retrieve the user's details by their email address.

        :param email: The email address of the user.
        :return: A tuple containing the user's details (firstname, lastname, email_address, profile_image_url) or None if not found.
        """
        try:
            # Connect to the database
            with psycopg2.connect(**db_config) as conn:
                with conn.cursor() as cursor:
                    # Execute the query to fetch the user's details
                    cursor.execute(
                        "SELECT firstname, lastname, email_address, profile_image_url FROM users WHERE email_address = %s;",
                        (email,)
                    )
                    # Return the user's details as a tuple or None if not found
                    return cursor.fetchone()
        except Exception as e:
            print(f"Error fetching user details: {e}")
            return None

