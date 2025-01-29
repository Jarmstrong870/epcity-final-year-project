from bcrypt import checkpw
from Repository.loginRepo import find_user_by_email


def login_user_service(data):
    """
    Handle the user login process.
    :param data: A dictionary containing email and password
    :return: A response message and HTTP status code
    """
    # Extract email and password from the input data
    email = data.get('email')
    password = data.get('password')

    # Validate input fields
    if not email or not password:
        return {"message": "Both email and password fields must be entered."}, 400

    try:
        # Fetch the user details from the database
        user = find_user_by_email(email)

        if not user:
            # If no user is found, return a 404 response
            return {"message": "No account has been found with this email. Please register first."}, 404

        # Extract user details from the fetched record
        firstname, lastname, stored_password_hash = user["firstname"], user["lastname"], user["password_hash"]

        # Validate the stored password hash (ensure it's a string if stored as memoryview)
        if isinstance(stored_password_hash, memoryview):
            stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

        # Verify the provided password using bcrypt
        if checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            # If the password is correct, return a success message and user details
            return {"message": f"Welcome back to EPCity, {firstname}!", "lastname": lastname, "firstname": firstname}, 200
        else:
            # If the password is incorrect, return a 401 response
            return {"message": "Incorrect password. Please try again."}, 401

    except Exception as e:
        # Log and handle unexpected errors
        print(f"Error during login process: {e}")
        return {"message": "An internal error occurred. Please try again later."}, 500

