import random
import string
from datetime import datetime, timedelta
from bcrypt import hashpw, gensalt
from Repository.resetPasswordRepo import ResetPasswordRepo
import requests
import os

MAILERSEND_API_KEY = os.getenv('MAILERSEND_API_KEY')

class ResetPasswordService:

    @staticmethod
    def generate_otp():
        """Generate a secure 6-digit OTP."""
        return ''.join(random.choices(string.digits, k=6))

    @staticmethod
    def send_otp_email(email, otp):
        """Send OTP email using MailerSend."""
        try:
            url = "https://api.mailersend.com/v1/email"
            headers = {
                "Authorization": f"Bearer {MAILERSEND_API_KEY}",
                "Content-Type": "application/json"
            }

            payload = {
                "from": {
                    "email": "support@epcity.co.uk",
                    "name": "EPCity Support"
                },
                "to": [{"email": email}],
                "subject": "Your One-Time Password (OTP)",
                "text": f"Your OTP is {otp}. Please use this code within 10 minutes to reset your password."
            }

            response = requests.post(url, json=payload, headers=headers)

            if response.status_code != 202:
                raise Exception(f"Failed to send email: {response.text}")
        except Exception as e:
            print(f"Error sending email: {e}")
            raise

    @staticmethod
    def request_password_reset(email):
        """Handle the OTP generation and email sending."""
        otp = ResetPasswordService.generate_otp()
        expiry = datetime.utcnow() + timedelta(minutes=10)  # OTP valid for 10 minutes

        # Save OTP in the database
        ResetPasswordRepo.save_reset_otp(email, otp, expiry)

        # Send OTP email
        ResetPasswordService.send_otp_email(email, otp)

        return {"message": "If the email exists, an OTP has been sent."}, 200

    @staticmethod
    def verify_otp(email, otp):
        """Verify if the OTP is valid."""
        stored_otp, token_expiry = ResetPasswordRepo.get_otp(email)

        if not stored_otp or stored_otp != otp:
            return False, 400

        if datetime.utcnow() > token_expiry:
            return False, 400

        return True, 200

    @staticmethod
    def reset_password(email, new_password):
        """Reset the user's password."""
        hashed_password = hashpw(new_password.encode('utf-8'), gensalt()).decode('utf-8')

        # Update password in the database
        ResetPasswordRepo.update_password(email, hashed_password)

        return {"message": "Password reset successfully."}, 200

