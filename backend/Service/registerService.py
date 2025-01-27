from bcrypt import hashpw, gensalt
from Repository.registerRepo import RegisterRepo

def register_user_service(data):
    """Service to handle user registration."""
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('userType')

    # Validate required fields
    if not all([firstname, lastname, email, password, user_type]):
        return {"message": "All fields must be entered to create an account."}, 400

    # Validate password length
    if len(password) < 7:
        return {"message": "Password must be at least 7 characters long."}, 400

    try:
        # Check if the email already exists
        if RegisterRepo.check_email_exists(email):
            return {"message": "An account with this email already exists. All fields have been cleared."}, 409

        # Get the next available user ID
        new_user_id = RegisterRepo.get_next_user_id()

        # Hash the password securely
        password_hash = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

        # Insert the new user into the database
        RegisterRepo.insert_new_user(new_user_id, firstname, lastname, email, password_hash, user_type)

        return {"message": "Registration successful!"}, 201

    except Exception as e:
        print("Error during registration process:", e)
        return {"message": "An internal error occurred. Please try again later."}, 500




