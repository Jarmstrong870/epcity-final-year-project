try:
    from Repository.accountOverviewRepo import AccountOverviewRepo  # Works when running backend
except ModuleNotFoundError:
    from backend.Repository.accountOverviewRepo import AccountOverviewRepo  # Works when running tests
from bcrypt import hashpw, checkpw, gensalt
from supabase import create_client
import os

# Initialise Supabase client for file storage
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class AccountOverviewService:
    """
    Service class to handle the business logic for account-related operations.
    """

    @staticmethod
    def change_password(data):
        """
        Change the user's password.
        
        :param data: Dictionary containing 'email', 'current_password', and 'new_password'.
        :return: JSON response with a success or error message and corresponding HTTP status code.
        """
        email = data.get('email')
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        # Validate input fields
        if not all([email, current_password, new_password]):
            return {"message": "All fields must be entered."}, 400

        # Ensure the new password meets the minimum length requirement
        if len(new_password) < 7:
            return {"message": "New password must be at least 7 characters long."}, 400

        # Retrieve the stored password hash from the repository
        user = AccountOverviewRepo.get_password_hash(email)

        if not user:
            # Return error if no user exists with the given email
            return {"message": "No account found with this email."}, 404

        stored_password_hash = user

        # Verify the current password matches the stored password hash
        if not checkpw(current_password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            return {"message": "Current password is incorrect."}, 401

        # Hash the new password and update it in the database
        new_password_hash = hashpw(new_password.encode('utf-8'), gensalt()).decode('utf-8')
        success = AccountOverviewRepo.update_password(email, new_password_hash)

        # Return appropriate success or failure message
        if success:
            return {"message": "Password changed successfully!"}, 200
        else:
            return {"message": "Failed to update password."}, 500

    @staticmethod
    def delete_account(data):
        """
        Delete the user's account.
        
        :param data: Dictionary containing 'email'.
        :return: JSON response with a success or error message and corresponding HTTP status code.
        """
        email = data.get('email')
        
        # Validate email field
        if not email:
            return {"message": "Email is required to delete account."}, 400

        # Call repository to delete the user
        if AccountOverviewRepo.delete_user(email):
            return {"message": "Account deleted successfully!"}, 200
        else:
            return {"message": "Failed to delete account."}, 500

    @staticmethod
    def edit_details(data):
        """
        Edit the user's firstname and lastname.
        
        :param data: Dictionary containing 'email', 'firstname', and 'lastname'.
        :return: JSON response with a success or error message and corresponding HTTP status code.
        """
        email = data.get('email')
        firstname = data.get('firstname')
        lastname = data.get('lastname')

        # Validate required fields
        if not email or not firstname or not lastname:
            return {"message": "All fields must be provided."}, 400

        # Call repository to update user details
        if AccountOverviewRepo.update_user_details(email, firstname, lastname):
            return {"message": "User details updated successfully!"}, 200
        else:
            return {"message": "Failed to update user details."}, 500

    @staticmethod
    def upload_profile_image(file, email):
        """
        Upload a new profile image for the user.
        
        :param file: The file object containing the user's profile image.
        :param email: The email address of the user.
        :return: The public URL of the uploaded file or None if upload fails.
        """
        file_name = f"profile-images/{email}_{file.filename}"
        bucket = supabase.storage.from_("profile-images")
        file_content = file.read()

        # Upload the file to Supabase storage
        upload_response = bucket.upload(file_name, file_content)
        if upload_response:
            # Generate and return the public URL for the uploaded file
            return bucket.get_public_url(file_name)
        return None

    @staticmethod
    def update_profile_image(email, public_url):
        """
        Update the user's profile image URL in the database.
        
        :param email: The email address of the user.
        :param public_url: The public URL of the new profile image.
        :return: True if update is successful, otherwise False.
        """
        return AccountOverviewRepo.update_profile_image_url(email, public_url)

    @staticmethod
    def get_user(email):
        """
        Retrieve the user's details.
        
        :param email: The email address of the user.
        :return: JSON response with user details or error message and corresponding HTTP status code.
        """
        user = AccountOverviewRepo.get_user_details(email)
        
        if user:
            # Return user details if found
            return {
                "firstname": user[0],
                "lastname": user[1],
                "email": user[2],
                "profile_image_url": user[3]
            }, 200
        else:
            # Return error if user not found
            return {"message": "User not found"}, 404





    

