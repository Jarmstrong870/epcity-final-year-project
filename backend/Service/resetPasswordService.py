import psycopg2
from datetime import datetime, timedelta
import os
import random
import string
import requests
from bcrypt import hashpw, gensalt

class ResetPasswordService:
    # Simple database configuration
    DB_CONFIG = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

    MAILERSEND_API_KEY = os.getenv('MAILERSEND_API_KEY')  # API Key for Testmail
    print(f"Using Testmail API Key: {os.getenv('MAILERSEND_API_KEY')}")
    TESTMAIL_NAMESPACE = "5k4xz"  # Namespace from Testmail
    TESTMAIL_BASE_URL = "https://api.testmail.app/api"  # Base URL for Testmail API

    @staticmethod
    def get_connection():
        """Establish a connection to the database."""
        try:
            return psycopg2.connect(**ResetPasswordService.DB_CONFIG)
        except Exception as e:
            print(f"Error connecting to the database: {e}")
            raise

    @staticmethod
    def generate_otp():
        """Generate a secure 6-digit OTP."""
        return ''.join(random.choices(string.digits, k=6))

    @staticmethod
    def save_reset_otp(email, otp):
        """Save the OTP and its expiry into the database."""
        expiration = datetime.utcnow() + timedelta(minutes=10)  # OTP valid for 10 minutes
        try:
            connection = ResetPasswordService.get_connection()
            cursor = connection.cursor()
            cursor.execute("""
                INSERT INTO password_resets (email, token, token_expiry)
                VALUES (%s, %s, %s)
                ON CONFLICT (email) DO UPDATE
                SET token = EXCLUDED.token, token_expiry = EXCLUDED.token_expiry;
            """, (email, otp, expiration))
            connection.commit()
            cursor.close()
            connection.close()
        except Exception as e:
            print(f"Error saving reset OTP: {e}")
            raise

    @staticmethod
    def send_otp_email(email, otp):
        try:
            print(f"Sending OTP email to {email} with OTP: {otp}")
            # Mailersend API details
            api_key = ResetPasswordService.MAILERSEND_API_KEY
            url = "https://api.mailersend.com/v1/email"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            # Payload for the email
            payload = {
                "from": {
                    "email": "support@epcity.co.uk",
                    "name": "EPCity Support"  # Optional
                },
                "to": [{"email": email}],
                "subject": "Your One-Time Password (OTP)",
                "text": f"Your OTP is {otp}. Please use this code within 10 minutes to reset your password."
            }

            # Make the request
            response = requests.post(url, json=payload, headers=headers)
            print(f"Mailersend Response: {response.status_code}, {response.text}")

            # Check response status
            if response.status_code != 202:  # 202 indicates email accepted for delivery
                raise Exception(f"Failed to send email: {response.text}")

        except Exception as e:
            print(f"Error sending email with Mailersend: {e}")
            raise

    @staticmethod
    def request_password_reset(email):
        print(f"calling method")
        """Generate and send an OTP for password reset."""
        otp = ResetPasswordService.generate_otp()  # Generate a new OTP
        ResetPasswordService.save_reset_otp(email, otp)  # Save OTP to the database
        ResetPasswordService.send_otp_email(email, otp)  # Send OTP email
        return {"message": "If the email exists, an OTP has been sent."}, 200

    @staticmethod
    def verify_reset_otp(email, otp):
        """Verify if the OTP is valid."""
        try:
            connection = ResetPasswordService.get_connection()
            cursor = connection.cursor()
            cursor.execute("""
                SELECT token_expiry FROM password_resets
                WHERE email = %s AND token = %s;
            """, (email, otp))
            result = cursor.fetchone()
            cursor.close()
            connection.close()

            if result:
                otp_expiry = result[0]
                return datetime.utcnow() <= otp_expiry  # Check if the OTP is still valid
            return False
        except Exception as e:
            print(f"Error verifying reset OTP: {e}")
            raise

    @staticmethod
    def update_password(email, new_password):
        """
        Update the user's password in the database.
        """
        try:
            # Hash the new password for security
            hashed_password = hashpw(new_password.encode('utf-8'), gensalt()).decode('utf-8')

            # Connect to the database and update the password
            connection = ResetPasswordService.get_connection()
            cursor = connection.cursor()

            cursor.execute("""
                UPDATE users SET password_hash = %s
                WHERE email_address = %s;
            """, (hashed_password, email))
            connection.commit()
            cursor.close()
            connection.close()

            return {"message": "Password updated successfully."}, 200
        except Exception as e:
            print(f"Error updating password: {e}")
            return {"message": "An internal error occurred."}, 500


    @staticmethod
    def reset_password(email, new_password, otp):
        """Handle the complete password reset process."""
        # Verify the OTP
        if not ResetPasswordService.verify_reset_otp(email, otp):
            return {"message": "Invalid or expired OTP."}, 400

        # Update the password
        try:
            ResetPasswordService.update_password(email, new_password)
            return {"message": "Password updated successfully. Redirecting to the Login page..."}, 200
        except Exception as e:
            print(f"Error during password reset: {e}")
            return {"message": "An internal error occurred."}, 500