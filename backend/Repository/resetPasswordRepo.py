import psycopg2
from datetime import datetime
import os

# Database connection configuration
db_config = {
    'host': os.getenv('DATABASE_HOST'),  # Hostname of the database server
    'port': os.getenv('DATABASE_PORT'),  # Port for database connection
    'database': os.getenv('DATABASE_NAME'),  # Name of the database
    'user': os.getenv('DATABASE_USER'),  # Username for database access
    'password': os.getenv('DATABASE_PASSWORD')  # Password for database access
}

class ResetPasswordRepo:
    """
    Repository class for managing reset password operations, 
    including saving OTPs, retrieving OTPs, and updating passwords.
    """

    @staticmethod
    def save_reset_otp(email, otp, expiry):
        """
        Save a One-Time Password (OTP) and its expiry timestamp for a given email.

        :param email: The email address associated with the OTP
        :param otp: The OTP to be saved
        :param expiry: The expiry timestamp of the OTP
        """
        try:
            # Establish a connection to the database
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Insert or update the OTP and expiry for the given email
            cursor.execute("""
                INSERT INTO password_resets (email, token, token_expiry)
                VALUES (%s, %s, %s)
                ON CONFLICT (email) DO UPDATE
                SET token = EXCLUDED.token, token_expiry = EXCLUDED.token_expiry;
            """, (email, otp, expiry))

            # Commit the transaction
            connection.commit()
        finally:
            # Ensure that resources are closed properly
            cursor.close()
            connection.close()

    @staticmethod
    def get_otp(email):
        """
        Retrieve the OTP and its expiry for a given email.

        :param email: The email address associated with the OTP
        :return: A tuple containing the OTP and expiry timestamp, or (None, None) if not found
        """
        try:
            # Establish a connection to the database
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Query the database for the OTP and its expiry
            cursor.execute("""
                SELECT token, token_expiry FROM password_resets WHERE email = %s;
            """, (email,))

            # Fetch the result (returns None if no record is found)
            result = cursor.fetchone()
            return result if result else (None, None)
        finally:
            # Ensure that resources are closed properly
            cursor.close()
            connection.close()

    @staticmethod
    def update_password(email, hashed_password):
        """
        Update the password for a user in the database.

        :param email: The email address of the user
        :param hashed_password: The new hashed password to be stored
        """
        try:
            # Establish a connection to the database
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Update the user's password in the database
            cursor.execute("""
                UPDATE users SET password_hash = %s WHERE email_address = %s;
            """, (hashed_password, email))

            # Commit the transaction
            connection.commit()
        finally:
            # Ensure that resources are closed properly
            cursor.close()
            connection.close()

