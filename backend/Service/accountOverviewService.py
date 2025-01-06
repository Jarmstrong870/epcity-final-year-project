from psycopg2 import connect
from bcrypt import hashpw, checkpw, gensalt
from supabase import create_client
import os

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
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

def upload_profile_image(file, user_id):
    file_name = f"profile-images/{user_id}_{file.filename}"
    try:
        response = supabase.storage.from_("profile-images").upload(file_name, file.stream)
        if response.status_code != 200:
            raise Exception(f"Failed to upload: {response.json()}")
        # Get public URL
        public_url = supabase.storage.from_("profile-images").get_public_url(file_name)
        return public_url
    except Exception as e:
        print(f"Error uploading profile image: {e}")
        return None
