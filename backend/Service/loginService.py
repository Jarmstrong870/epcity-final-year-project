from psycopg2 import connect
from bcrypt import checkpw
import os

db_config = {
    'host': os.getenv('DB_HOST'),  # Default values can be overridden by env vars
    'port': os.getenv('DB_PORT'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

def login_user_service(data):
    print("Login service called with data:", data)  

    email = data.get('email')
    password = data.get('password')

    # Presence checks for email and password
    if not email or not password:
        return {"message": "Both email and password fields must be entered."}, 400

    try:
        print("Attempting to connect to the database...")  
        connection = connect(**db_config)
        print("Database connection successful.")  

        cursor = connection.cursor()

        # Query for the user in the database
        print(f"Executing query to find user with email: {email}") 
        cursor.execute("SELECT firstname, lastname, password_hash FROM users WHERE email_address = %s;", (email,))
        user = cursor.fetchone()
        print("Query result:", user)  

        if not user:
            print("User not found.") 
            cursor.close()
            connection.close()
            return {"message": "No account has been found with this email. Please register first."}, 404

        firstname, lastname, stored_password_hash = user

       
        if isinstance(stored_password_hash, memoryview):
            stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

        print("Stored password hash type:", type(stored_password_hash))  

        # Verify the password
        if checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            print("Password verification successful.") 
            cursor.close()
            connection.close()
            return {"message": f"Welcome back to EPCity, {firstname}!", "lastname": lastname, "firstname": firstname}, 200
        else:
            print("Password verification failed.")  
            cursor.close()
            connection.close()
            return {"message": "Incorrect password. Please try again."}, 401

    except Exception as e:
        # Log the error for debugging purposes
        print("Error during login process:", e)  
        return {"message": "An internal error occurred. Please try again later."}, 500
