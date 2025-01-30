from bcrypt import hashpw, gensalt
from Repository.registerRepo import RegisterRepo
import requests
import os
import random
import string
from datetime import datetime, timedelta
from mailersend import emails

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

        try:
            send_welcome_email(data['email'], data['firstname'])
        except Exception as e:
            print(f"Error sending welcome email: {e}")


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

from mailersend import emails

def send_registration_otp_email(email, otp, user_name="User"):
    """
    Send a registration OTP email to the user using a MailerSend template.

    :param email: The recipient's email address.
    :param otp: The OTP to send.
    :param user_name: The name of the user (default: "User").
    """
    try:
        # Initialize the MailerSend email client
        mailer = emails.NewEmail()
        mailer.api_key = os.getenv('MAILERSEND_API_KEY')  # Set the API key

        # Define the mail body object
        mail_body = {}

        # Sender information
        mail_from = {
            "name": "EPCity Support",
            "email": "support@epcity.co.uk"
        }

        # Recipient information
        recipients = [
            {
                "name": user_name,  # Dynamically include the user's name
                "email": email
            }
        ]

        # Personalization data for the template
        personalization = [
            {
                "email": email,
                "data": {
                    "otp": otp,  # Inject the OTP into the template
                    "name": user_name,  # Dynamically pass the user's name
                    "support_email": "support@epcity.co.uk",  # Add support email
                    "closing_note": f"Welcome to EPCity! Kind regards,\nThe EPCity Team"  # Add a closing note
                }
            }
        ]

        # Set the MailerSend fields
        mailer.set_mail_from(mail_from, mail_body)  # Set the sender
        mailer.set_mail_to(recipients, mail_body)  # Set the recipients
        mailer.set_subject("Your Registration OTP", mail_body)  # Subject for the email
        mailer.set_template("k68zxl2qzn5lj905", mail_body)  # Use the registration template ID
        mailer.set_personalization(personalization, mail_body)  # Add personalization data

        # Debug logs for testing
        print(f"Mail Body: {mail_body}")
        print(f"Personalization Data: {personalization}")

        # Send the email
        print("Attempting to send registration email via MailerSend...")
        response = mailer.send(mail_body)
        print(f"MailerSend Response: {response}")  # Log the response

    except Exception as e:
        print(f"Error sending registration OTP email with MailerSend: {e}")
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

def send_welcome_email(email, user_name):
    """
    Send a welcome email to the user after successful registration.
    
    :param email: The recipient's email address.
    :param user_name: The name of the recipient to personalise the email.
    :raises Exception: If the email fails to send.
    """
    try:
        # Initialize the MailerSend email client
        mailer = emails.NewEmail()

        # Define the mail body object
        mail_body = {}

        # Sender information
        mail_from = {
            "name": "EPCity Team",
            "email": "support@epcity.co.uk"
        }

        # Recipient information
        recipients = [
            {
                "name": user_name,
                "email": email
            }
        ]

        # Personalization data for the template
        personalization = [
            {
                "email": email,
                "data": {
                    "name": user_name
                }
            }
        ]

        # Set the MailerSend fields
        mailer.set_mail_from(mail_from, mail_body)
        mailer.set_mail_to(recipients, mail_body)
        mailer.set_subject("Your account has been set up, Welcome to EPCity!", mail_body)
        mailer.set_template("3zxk54v1rdz4jy6v", mail_body)  # Replace with your MailerSend template ID
        mailer.set_personalization(personalization, mail_body)

        # Send the email
        print(f"Welcome email trying to be sent {email}.")
        mailer.send(mail_body)
        print(f"Welcome email sent successfully to {email}.")
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        raise