import psycopg2
from bcrypt import hashpw, checkpw, gensalt
import os

# Database configuration
db_config = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

def get_user_details(email):
    """
    Retrieve user details by email.
    """
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute(
            "SELECT firstname, lastname, email_address, profile_image_url FROM users WHERE email_address = %s;",
            (email,)
        )
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        return user
    except Exception as e:
        print(f"Error fetching user details: {e}")
        return None

def update_password(email, hashed_password):
    """
    Update user's password in the database.
    """
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE email_address = %s;",
            (hashed_password, email)
        )
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Error updating password: {e}")
        return False

def delete_user(email):
    """
    Delete a user from the database.
    """
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute("DELETE FROM users WHERE email_address = %s;", (email,))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Error deleting account: {e}")
        return False

def update_user_details(email, firstname, lastname):
    """
    Update user's firstname and lastname in the database.
    """
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute(
            "UPDATE users SET firstname = %s, lastname = %s WHERE email_address = %s;",
            (firstname, lastname, email)
        )
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Error updating user details: {e}")
        return False

def update_profile_image_url(email, public_url):
    """
    Update user's profile image URL in the database.
    """
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute(
            "UPDATE users SET profile_image_url = %s WHERE email_address = %s;",
            (public_url, email)
        )
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Error updating profile image URL: {e}")
        return False
