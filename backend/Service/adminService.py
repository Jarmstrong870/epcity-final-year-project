try:
    from Repository.adminRepo import (
        fetch_users_from_db, update_user_block_status, delete_user, 
        fetch_active_users_count, fetch_total_properties_count, fetch_messages_last_24_hours
    )
# If that fails (e.g., during testing), import with the full package path
except ModuleNotFoundError:
    from backend.Repository.adminRepo import (
        fetch_users_from_db, update_user_block_status, delete_user, 
        fetch_active_users_count, fetch_total_properties_count, fetch_messages_last_24_hours
    )
    
def get_all_users():
    return fetch_users_from_db()

def toggle_user_block(email):
    return update_user_block_status(email)

def delete_userr(email):
    """ Delete a user """
    return delete_user(email)

def get_active_users_count():
    """ Returns the count of active users in the last 10 minutes """
    return fetch_active_users_count()

def get_total_properties_count():
    """ Returns the total count of properties """
    return fetch_total_properties_count()

def get_messages_last_24_hours():
    """ Returns the total count of messages sent in the last 24 hours """
    return fetch_messages_last_24_hours()
