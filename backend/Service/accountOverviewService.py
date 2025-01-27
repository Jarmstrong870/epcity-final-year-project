from psycopg2 import connect
from bcrypt import hashpw, checkpw, gensalt
from supabase import create_client
import os

# Database configuration
db_config = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

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

    try:
        connection = connect(**db_config)
        cursor = connection.cursor()

        # Retrieve the current hashed password
        cursor.execute("SELECT password_hash FROM users WHERE email_address = %s;", (email,))
        user = cursor.fetchone()

        if not user:
            cursor.close()
            connection.close()
            return {"message": "No account found with this email."}, 404

        stored_password_hash = user[0]

        if isinstance(stored_password_hash, memoryview):
            stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

        if not checkpw(current_password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            cursor.close()
            connection.close()
            return {"message": "Current password is incorrect."}, 401

        # Hash the new password and update the database
        new_password_hash = hashpw(new_password.encode('utf-8'), gensalt()).decode('utf-8')
        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE email_address = %s;",
            (new_password_hash, email)
        )
        connection.commit()

        cursor.close()
        connection.close()

    except Exception as e:
        print("Error during password update process:", e)
        return {"message": "An internal error occurred. Please try again later."}, 500

    return {"message": "Password changed successfully!"}, 200

def delete_account_service(data):
    email = data.get('email')

    if not email:
        return {"message": "Email is required to delete account."}, 400

    try:
        connection = connect(**db_config)
        cursor = connection.cursor()

        # Delete the user
        cursor.execute("DELETE FROM users WHERE email_address = %s;", (email,))
        connection.commit()

        cursor.close()
        connection.close()

    except Exception as e:
        print("Error deleting account:", e)
        return {"message": "An internal error occurred. Please try again later."}, 500

    return {"message": "Account deleted successfully!"}, 200

def edit_details_service(data):
    email = data.get('email')
    firstname = data.get('firstname')
    lastname = data.get('lastname')

    if not email or not firstname or not lastname:
        return {"message": "All fields must be provided."}, 400

    try:
        connection = connect(**db_config)
        cursor = connection.cursor()

        # Update the user's details in the database
        cursor.execute("""
            UPDATE users 
            SET firstname = %s, lastname = %s 
            WHERE email_address = %s;
        """, (firstname, lastname, email))

        connection.commit()
        cursor.close()
        connection.close()

    except Exception as e:
        print("Error updating user details:", e)
        return {"message": "An internal error occurred. Please try again later."}, 500

    return {"message": "User details updated successfully!"}, 200

def upload_profile_image(file, email):
    file_name = f"profile-images/{email}_{file.filename}"
    try:
        bucket = supabase.storage.from_("profile-images")

        prefix = f"{email}_"  # Prefix based on the email and naming convention
        print(f"Retrieving old images for user: {email} with prefix: {prefix}")

        list_response = bucket.list()
        if not isinstance(list_response, list):
            raise Exception("Failed to list files in the bucket or invalid response format.")
        
        old_files = [file_info for file_info in list_response if file_info.get("name", "").startswith(prefix)]
        print(f"Found old files for user {email}: {old_files}")

        if old_files:
            for old_file in old_files:
                file_name_to_delete = old_file.get("name")
                if file_name_to_delete:
                    print(f"Deleting old image: {file_name_to_delete}")
                    bucket.remove([file_name_to_delete])
        else:
            print(f"No old images found for user {email}.")

        print(f"Uploading new file for email: {email} to {file_name}")
        file_content = file.read()
        upload_response = bucket.upload(file_name, file_content)

        if not upload_response or not hasattr(upload_response, "path"):
            raise Exception("Failed to upload file to Supabase.")

        # Generate a public URL for the uploaded file
        public_url = bucket.get_public_url(file_name)

        if not isinstance(public_url, str) or not public_url:
            raise Exception("Failed to retrieve a valid public URL.")

        print(f"Generated public URL: {public_url}")
        return public_url
    except Exception as e:
        print(f"Error uploading profile image: {e}")
        return None

def update_user_profile_image(email, public_url):
    try:
        connection = connect(**db_config)
        cursor = connection.cursor()

        # Update the profile image URL
        print(f"Updating profile image URL in database for user: {email}")
        cursor.execute(
            "UPDATE users SET profile_image_url = %s WHERE email_address = %s;",
            (public_url, email),
        )
        connection.commit()
        cursor.close()
        connection.close()
        print(f"Profile image URL updated successfully for user {email}")
        return True
    except Exception as e:
        print(f"Error updating profile image URL in database: {e}")
        return False


    

