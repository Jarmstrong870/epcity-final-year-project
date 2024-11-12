from psycopg2 import connect
from bcrypt import hashpw, gensalt
import os

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST'),  
    'port': os.getenv('DB_PORT'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

def register_user_service(data):
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')
    userType = data.get('userType')

    # Presence checks for all fields
    if not all([firstname, lastname, email, password, userType]):
        return {"message": "All fields must be entered to create an account."}, 400

    # Password length check
    if len(password) < 7:
        return {"message": "Password must be at least 7 characters long."}, 400

    try:
        # Establish a connection to the database
        connection = connect(**db_config)
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM users WHERE email_address = %s;", (email,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return {"message": "An account with this email already exists. All fields have been cleared."}, 409

        password_hash = hashpw(password.encode('utf-8'), gensalt())

        cursor.execute(
            """
            INSERT INTO users (firstname, lastname, email_address, password_hash, "userType")
            VALUES (%s, %s, %s, %s, %s);
            """,
            (firstname, lastname, email, password_hash.decode('utf-8'), userType)
        )
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

    except Exception as e:
        # Log the error for debugging purposes
        print("Error during registration process:", e)
        return {"message": "An internal error occurred. Please try again later."}, 500

    return {"message": "Registration successful!"}, 201

