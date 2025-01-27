import psycopg2
from datetime import datetime
import os

db_config = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

class ResetPasswordRepo:

    @staticmethod
    def save_reset_otp(email, otp, expiry):
        """Save the OTP and its expiry into the database."""
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            cursor.execute("""
                INSERT INTO password_resets (email, token, token_expiry)
                VALUES (%s, %s, %s)
                ON CONFLICT (email) DO UPDATE
                SET token = EXCLUDED.token, token_expiry = EXCLUDED.token_expiry;
            """, (email, otp, expiry))
            connection.commit()
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_otp(email):
        """Retrieve the OTP and its expiry for a given email."""
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            cursor.execute("""
                SELECT token, token_expiry FROM password_resets WHERE email = %s;
            """, (email,))
            result = cursor.fetchone()
            return result if result else (None, None)
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def update_password(email, hashed_password):
        """Update the password in the database."""
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            cursor.execute("""
                UPDATE users SET password_hash = %s WHERE email_address = %s;
            """, (hashed_password, email))
            connection.commit()
        finally:
            cursor.close()
            connection.close()
