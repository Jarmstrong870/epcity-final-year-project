import psycopg2
import os

db_config = {
    "host": os.getenv("DATABASE_HOST"),
    "port": os.getenv("DATABASE_PORT"),
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD"),
}

def fetch_users_from_db():
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT firstname, lastname, email_address, is_admin, is_blocked FROM users;")
        users = cursor.fetchall()
        return [
            {
                "firstname": user[0],
                "lastname": user[1],
                "email": user[2],
                "is_admin": user[3],
                "is_blocked": user[4],
            }
            for user in users
        ]
    except Exception as e:
        print(f"Error fetching users: {e}")
        return []
    finally:
        cursor.close()
        connection.close()

def update_user_block_status(email):
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        # Get current block status
        cursor.execute("SELECT is_blocked FROM users WHERE email_address = %s;", (email,))
        result = cursor.fetchone()

        if result is None:
            return False  # User not found

        new_status = not result[0]  # Toggle the boolean value

        cursor.execute("UPDATE users SET is_blocked = %s WHERE email_address = %s;", (new_status, email))
        connection.commit()
        return True
    except Exception as e:
        print(f"Error updating user block status: {e}")
        return False
    finally:
        cursor.close()
        connection.close()

def delete_user(email):
    """ Delete a user from the database """
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute(
            """
            DELETE FROM users WHERE email_address = %s;
            """,
            (email,),
        )
        connection.commit()
        return True
    except Exception as e:
        print(f"Error deleting user: {e}")
        return False
    finally:
        cursor.close()
        connection.close()
