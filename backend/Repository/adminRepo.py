import psycopg2
import os
from datetime import datetime, timedelta

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
        cursor.execute("DELETE FROM users WHERE email_address = %s;", (email,))  # Fixed formatting
        connection.commit()
        return True
    except Exception as e:
        print(f"Error deleting user: {e}")
        return False
    finally:
        cursor.close()
        connection.close()

def fetch_users_from_db():
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT firstname, lastname, email_address, is_admin, is_blocked, last_active FROM users;")
        users = cursor.fetchall()
        return [
            {
                "firstname": user[0],
                "lastname": user[1],
                "email": user[2],
                "is_admin": user[3],
                "is_blocked": user[4],
                "last_active": user[5].strftime('%Y-%m-%d %H:%M:%S') if user[5] else "Never"
            }
            for user in users
        ]
    except Exception as e:
        print(f"Error fetching users: {e}")
        return []
    finally:
        cursor.close()
        connection.close()

def fetch_active_users_count():
    """ Fetch the number of users active in the last 10 minutes """
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()
        
        ten_minutes_ago = datetime.utcnow() - timedelta(minutes=10)
        cursor.execute("SELECT COUNT(*) FROM users WHERE last_active >= %s;", (ten_minutes_ago,))
        active_users = cursor.fetchone()[0]
        
        return active_users
    except Exception as e:
        print(f"Error fetching active users: {e}")
        return 0
    finally:
        cursor.close()
        connection.close()

def fetch_total_properties_count():
    """Fetch the total count of properties from the database."""
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM properties;")  # Count total rows in properties table
        total_properties = cursor.fetchone()[0]
        
        return total_properties
    except Exception as e:
        print(f"Error fetching total properties count: {e}")
        return 0
    finally:
        cursor.close()
        connection.close()

def fetch_messages_last_24_hours():
    """Fetch the total count of messages sent in the last 24 hours."""
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        # Use direct SQL query instead of passing Python variable
        cursor.execute("""
            SELECT COUNT(*) FROM group_messages 
            WHERE sent_at >= NOW() - INTERVAL '24 HOURS';
        """)

        total_messages = cursor.fetchone()[0]
        return total_messages

    except Exception as e:
        print(f"❌ Error fetching messages count: {e}")
        return 0
    finally:
        cursor.close()
        connection.close()



