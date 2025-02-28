from Repository.adminRepo import fetch_users_from_db, update_user_block_status, delete_user

def get_all_users():
    return fetch_users_from_db()

def toggle_user_block(email):
    return update_user_block_status(email)

def delete_userr(email):
    """ Delete a user """
    return delete_user(email)
