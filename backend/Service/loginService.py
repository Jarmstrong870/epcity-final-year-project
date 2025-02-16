from bcrypt import checkpw
from Repository.loginRepo import find_user_by_email


def login_user_service(data):
    """
    Handle the user login process.
    :param data: A dictionary containing email and password
    :return: A response message and HTTP status code
    """
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return {"message": "Both email and password fields must be entered."}, 400

    try:
        user = find_user_by_email(email)

        if not user:
            return {"message": "No account has been found with this email. Please register first."}, 404

        firstname, lastname, stored_password_hash, is_admin = (
            user["firstname"], 
            user["lastname"], 
            user["password_hash"], 
            user["is_admin"]
        )

        # Ensure the password hash is properly formatted
        if isinstance(stored_password_hash, memoryview):
            stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

        # Verify the password using bcrypt
        if checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            return {
                "message": f"Welcome back to EPCity, {firstname}!",
                "lastname": lastname,
                "firstname": firstname,
                "is_admin": is_admin  # Return admin status
            }, 200
        else:
            return {"message": "Incorrect password. Please try again."}, 401

    except Exception as e:
        print(f"Error during login process: {e}")
        return {"message": "An internal error occurred. Please try again later."}, 500
