from psycopg2 import connect
from bcrypt import hashpw, gensalt
import os

# Database configuration
db_config = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
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

        # Check if the email already exists
        cursor.execute("SELECT * FROM users WHERE email_address = %s;", (email,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return {"message": "An account with this email already exists. All fields have been cleared."}, 409

        # Fetch the maximum user_id and increment it by 1
        cursor.execute("SELECT COALESCE(MAX(user_id), 0) + 1 FROM users;")
        new_user_id = cursor.fetchone()[0]

        # Hash the password
        password_hash = hashpw(password.encode('utf-8'), gensalt())

        # Insert the new user into the database
        cursor.execute(
            """
            INSERT INTO users (user_id, firstname, lastname, email_address, password_hash, "userType")
            VALUES (%s, %s, %s, %s, %s, %s);
            """,
            (new_user_id, firstname, lastname, email, password_hash.decode('utf-8'), userType)
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


