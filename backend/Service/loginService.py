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
    print("Login service called with data:", data)  # Debug: Input data trace

    email = data.get('email')
    password = data.get('password')

    try:
        print("Attempting to connect to the database...")  # Debug: Connection attempt trace
        connection = connect(**db_config)
        print("Database connection successful.")  # Debug: Connection successful

        cursor = connection.cursor()

        # Query for the user in the database
        print(f"Executing query to find user with email: {email}")  # Debug: Query trace
        cursor.execute("SELECT firstname, password_hash FROM users WHERE email_address = %s;", (email,))
        user = cursor.fetchone()
        print("Query result:", user)  # Debug: Query result trace

        if not user:
            print("User not found.")  # Debug: User not found trace
            cursor.close()
            connection.close()
            return {"message": "No account has been found with this email. Please register first."}, 404

        firstname, stored_password_hash = user

        # Convert memoryview to string if necessary
        if isinstance(stored_password_hash, memoryview):
            stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

        print("Stored password hash type:", type(stored_password_hash))  # Debug: Hash type trace

        # Verify the password
        if checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            print("Password verification successful.")  # Debug: Password match trace
            cursor.close()
            connection.close()
            return {"message": f"Welcome back to EPCity, {firstname}!", "firstname": firstname}, 200
        else:
            print("Password verification failed.")  # Debug: Password mismatch trace
            cursor.close()
            connection.close()
            return {"message": "Incorrect password. Please try again."}, 401

    except Exception as e:
        # Log the error for debugging purposes
        print("Error during login process:", e)  # Debug: Exception trace
        return {"message": "An internal error occurred. Please try again later."}, 500




'''
from psycopg2 import connect
from bcrypt import checkpw
import os

db_config = {
    'host': 'aws-0-eu-west-2.pooler.supabase.com',
    'port': '6543',
    'database': 'postgres',
    'user': 'postgres.uwxfjkzsanrumlwhtjyt',
    'password': 'EPCityPassword123!'
}

def login_user_service(data):
    email = data.get('email')
    password = data.get('password')

    try:
        # Establish a connection to the database
        connection = connect(**db_config)
        cursor = connection.cursor()

        # Query for the user in the database
        cursor.execute("SELECT firstname, password_hash FROM users WHERE email_address = %s;", (email,))
        user = cursor.fetchone()
        

        if not user:
            return {"message": "No account has been found with this email. Please register first."}, 404

        firstname, stored_password_hash = user

        # Convert memoryview to string if necessary
        if isinstance(stored_password_hash, memoryview):
            stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

        # Verify the password
        if checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            return {"message": f"Welcome back to EPCity, {firstname}!", "firstname": firstname}, 200
        else:
            return {"message": "Incorrect password. Please try again."}, 401

    except Exception as e:
        # Log the error for debugging purposes
        print("Error during login process:", e)
        return {"message": "An internal error occurred. Please try again later."}, 500

'''