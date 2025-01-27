from bcrypt import hashpw, checkpw, gensalt
from Repository import accountOverviewRepo as repo
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def change_password_service(data):
    email = data.get('email')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not all([email, current_password, new_password]):
        return {"message": "All fields must be entered."}, 400

    if len(new_password) < 7:
        return {"message": "New password must be at least 7 characters long."}, 400

    user = repo.get_user_details(email)
    if not user:
        return {"message": "No account found with this email."}, 404

    stored_password_hash = user[0]
    if isinstance(stored_password_hash, memoryview):
        stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

    if not checkpw(current_password.encode('utf-8'), stored_password_hash.encode('utf-8')):
        return {"message": "Current password is incorrect."}, 401

    new_password_hash = hashpw(new_password.encode('utf-8'), gensalt()).decode('utf-8')
    if repo.update_password(email, new_password_hash):
        return {"message": "Password changed successfully!"}, 200
    else:
        return {"message": "Failed to update password."}, 500

def delete_account_service(data):
    email = data.get('email')
    if not email:
        return {"message": "Email is required to delete account."}, 400

    if repo.delete_user(email):
        return {"message": "Account deleted successfully!"}, 200
    else:
        return {"message": "Failed to delete account."}, 500

def edit_details_service(data):
    email = data.get('email')
    firstname = data.get('firstname')
    lastname = data.get('lastname')

    if not email or not firstname or not lastname:
        return {"message": "All fields must be provided."}, 400

    if repo.update_user_details(email, firstname, lastname):
        return {"message": "User details updated successfully!"}, 200
    else:
        return {"message": "Failed to update user details."}, 500

def upload_profile_image(file, email):
    file_name = f"profile-images/{email}_{file.filename}"
    bucket = supabase.storage.from_("profile-images")
    file_content = file.read()
    upload_response = bucket.upload(file_name, file_content)

    if upload_response:
        return bucket.get_public_url(file_name)
    return None

def update_user_profile_image(email, public_url):
    if repo.update_profile_image_url(email, public_url):
        return True
    return False



    

