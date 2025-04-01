try:
    from Repository.resetPasswordRepo import ResetPasswordRepo  
except ModuleNotFoundError:
    from backend.Repository.resetPasswordRepo import ResetPasswordRepo 
import random
import string
from datetime import datetime, timedelta
from bcrypt import hashpw, gensalt
from mailersend import emails
import os

# Environment variable for MailerSend API key
MAILERSEND_API_KEY = os.getenv('MAILERSEND_API_KEY')

class ResetPasswordService:
    """
    Service class to handle the logic for resetting a user's password.
    """

    @staticmethod
    def generate_otp():
        """
        Generate a secure 6-digit OTP.
        
        :return: A randomly generated 6-digit OTP as a string.
        """
        return ''.join(random.choices(string.digits, k=6))

    @staticmethod
    def send_otp_email(email, otp):
        """
        Send an OTP email to the user using a MailerSend template.

        :param email: The recipient's email address.
        :param otp: The generated OTP to include in the email.
        :raises Exception: If the email fails to send.
        """
        try:
            # Initialize the MailerSend email client
            mailer = emails.NewEmail()
            mailer.api_key = os.getenv('MAILERSEND_API_KEY')  # Set API key

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
                    "name": "User",  # Optional: Replace with the user's name if available
                    "email": email
                }
            ]

            # Personalization data for the template
            personalization = [
                {
                    "email": email,
                    "data": {
                        "otp": otp,  # Inject the OTP into the template
                        "name": "User",  # Replace with the user's name if available
                         "account": {
                           "The EPCity team": ""
                        },
                        "support_email": "support@epcity.co.uk"  # Support email
                    }
                }
            ]

            # Set the MailerSend fields
            mailer.set_mail_from(mail_from, mail_body)  # Set the sender
            mailer.set_mail_to(recipients, mail_body)  # Set the recipients
            mailer.set_subject("Your OTP for EPCity", mail_body)  # Set the subject
            mailer.set_template("neqvygm5nvz40p7w", mail_body)  # Replace with your MailerSend template ID
            mailer.set_personalization(personalization, mail_body)  # Add personalization data

            # Debug logs
            print(f"Mail Body: {mail_body}")
            print(f"Personalization Data: {personalization}")

            # Send the email and log the response
            print("Attempting to send email via MailerSend...")
            response = mailer.send(mail_body)
            print(f"MailerSend Response: {response}")  # Log the response

        except Exception as e:
            print(f"Error sending email with MailerSend: {e}")
            raise

    @staticmethod
    def request_password_reset(email):
        """
        Generate an OTP, save it to the database, and send it to the user's email.
        
        :param email: The recipient's email address.
        :return: JSON response indicating the OTP has been sent, and a success HTTP status code.
        """
        otp = ResetPasswordService.generate_otp()  # Generate a new OTP
        expiry = datetime.utcnow() + timedelta(minutes=10)  # Set OTP expiry time (10 minutes)

        # Save the OTP and its expiry time in the database
        ResetPasswordRepo.save_reset_otp(email, otp, expiry)

        # Send the OTP to the user's email using the updated method
        ResetPasswordService.send_otp_email(email, otp)

        # Return a success message (does not confirm email exists for security reasons)
        return {"message": "If the email exists, an OTP has been sent."}, 200

    @staticmethod
    def verify_otp(email, otp):
        """
        Verify whether the provided OTP matches the stored OTP and is not expired.

        :param email: The user's email address.
        :param otp: The OTP provided by the user.
        :return: Tuple of (boolean, HTTP status code).
                 - True, 200 if OTP is valid.
                 - False, 400 if OTP is invalid or expired.
        """
        # Retrieve stored OTP and its expiry time from the database
        stored_otp, token_expiry = ResetPasswordRepo.get_otp(email)

        # Check if the OTP exists and matches
        if not stored_otp or stored_otp != otp:
            return False, 400

        # Check if the OTP has expired
        if datetime.utcnow() > token_expiry:
            return False, 400

        return True, 200

    @staticmethod
    def reset_password(email, new_password):
        """
        Reset the user's password by hashing it and updating the database.
        
        :param email: The user's email address.
        :param new_password: The new password provided by the user.
        :return: JSON response indicating the password reset status and HTTP status code.
        """
        # Hash the new password for security
        hashed_password = hashpw(new_password.encode('utf-8'), gensalt()).decode('utf-8')

        # Update the password in the database using the repository
        ResetPasswordRepo.update_password(email, hashed_password)

        # Return success message
        return {"message": "Password reset successfully."}, 200
