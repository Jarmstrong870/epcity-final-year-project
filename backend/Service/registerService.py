from bcrypt import hashpw, gensalt
from Repository.registerRepo import RegisterRepo
import requests
import os
import random
import string
from datetime import datetime, timedelta

MAILERSEND_API_KEY = os.getenv('MAILERSEND_API_KEY')  # MailerSend API key

def register_user_service(data):
    """Service to handle user registration."""
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('userType')

    # Validate required fields
    if not all([firstname, lastname, email, password, user_type]):
        return {"message": "All fields must be entered to create an account."}, 400

    # Validate password length
    if len(password) < 7:
        return {"message": "Password must be at least 7 characters long."}, 400

    try:
        # Check if the email already exists
        if RegisterRepo.check_email_exists(email):
            return {"message": "An account with this email already exists. All fields have been cleared."}, 409

        # Get the next available user ID
        new_user_id = RegisterRepo.get_next_user_id()

        # Hash the password securely
        password_hash = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

        # Insert the new user into the database
        RegisterRepo.insert_new_user(new_user_id, firstname, lastname, email, password_hash, user_type)

        return {"message": "Registration successful!"}, 201

    except Exception as e:
        print("Error during registration process:", e)
        return {"message": "An internal error occurred. Please try again later."}, 500

def generate_otp():
    """
    Generate a secure 6-digit OTP.
    
    :return: A 6-digit OTP as a string.
    """
    return ''.join(random.choices(string.digits, k=6))

def send_registration_otp_email(email, otp):
    """
    Send a registration OTP email to the user.

    :param email: The recipient's email address.
    :param otp: The OTP to send.
    """
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
            "subject": "Your Registration OTP",
            "text": f"Your registration OTP is {otp}. It will expire in 10 minutes."
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code != 202:
            raise Exception(f"Failed to send email: {response.text}")
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        raise

def request_registration_otp_service(email):
    """
    Generate and send an OTP for user registration.

    :param email: The recipient's email address.
    :return: A success message if the process completes.
    """
    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=10)

    # Save OTP and send the email
    RegisterRepo.save_registration_otp(email, otp, expiry)
    send_registration_otp_email(email, otp)

    return {"message": "If the email exists, an OTP has been sent."}, 200

def verify_registration_otp_service(email, otp):
    """
    Verify the OTP for user registration.

    :param email: The user's email address.
    :param otp: The OTP provided by the user.
    :return: A success or failure message.
    """
    stored_otp, expiry = RegisterRepo.get_registration_otp(email)

    if not stored_otp or stored_otp != otp:
        return {"message": "Invalid OTP."}, 400

    if datetime.utcnow() > expiry:
        return {"message": "OTP has expired."}, 400

    return {"message": "OTP verified successfully."}, 200

def check_email_exists_service(email):
    """
    Service to check if an email exists in the database.

    :param email: The email address to check.
    :return: True if the email exists, False otherwise.
    """
    return RegisterRepo.check_email_exists(email)



