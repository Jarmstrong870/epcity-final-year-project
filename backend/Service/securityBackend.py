import psycopg2
from psycopg2 import sql
from bcrypt import hashpw, gensalt, checkpw

class UserAuthSystem:
    def __init__(self, db_config):
        # Initialize the database connection
        self.connection = psycopg2.connect(
            host=db_config['host'],
            port=db_config['port'],
            database=db_config['database'],
            user=db_config['user'],
            password=db_config['password'],
            sslmode='require'  # Ensures the connection is secure
        )
        self.cursor = self.connection.cursor()

    def close_connection(self):
        self.cursor.close()
        self.connection.close()

    def register_user(self, firstname, lastname, email, password, userType):
        self.cursor.execute("SELECT * FROM users WHERE email_address = %s;", (email,))
        if self.cursor.fetchone():
            print("An account with this email already exists.")
            return False

        # Hashing password before stored so its secure
        password_hash = hashpw(password.encode('utf-8'), gensalt())

        self.cursor.execute(
            """
            INSERT INTO users (firstname, lastname, email_address, password_hash, "userType")
            VALUES (%s, %s, %s, %s, %s);
            """,
            (firstname, lastname, email, password_hash.decode('utf-8'), userType)  
        )
        self.connection.commit()
        print("Registration successful! You can proceed to log in.")
        return True

    def login_user(self, email, password):
        # Check if the user exists and retrieve their hashed password
        self.cursor.execute("SELECT firstname, password_hash FROM users WHERE email_address = %s;", (email,))
        user = self.cursor.fetchone()

        if not user:
            print("No account has been found with this email. Please register first.")
            return False

        firstname, stored_password_hash = user

        # because its saved as slightly different format to supa, need to decode it first so we can read the hased value
        if isinstance(stored_password_hash, memoryview):
            stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

        # Check if the entered password matches the stored hash
        try:
            if checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                print(f"Welcome back to EPCity, {firstname}!")
                return True
            else:
                print("Incorrect password. Please try again.")
                return False
        except ValueError as e:
            print(f"Hash verification error: {e}")
            return False

    def print_all_users(self):
        #print all usernames and their emails in our database
        self.cursor.execute('SELECT firstname, lastname, email_address, "userType" FROM users;')
        users = self.cursor.fetchall()

        if not users:
            print("No users found in the system.")
            return

        print("\nList of all users:")
        for firstname, lastname, email, userType in users:
            print(f"{firstname} {lastname} - {email} ({userType})")

    def start(self):
        # Main method to ask the user what they want to do
        action = input("Would you like to (register), (login), or (list users)? ").strip().lower()

        if action == 'register':
            firstname = input("Enter your first name: ").strip()
            lastname = input("Enter your last name: ").strip()
            email = input("Enter your email address: ").strip()
            userType = input("Are you a student or a landlord? (Enter 'student' or 'landlord'): ").strip().lower()
            
            if userType not in ['student', 'landlord']:
                print("Invalid user type. Please enter 'student' or 'landlord'.")
                return
            
            password = input("Enter your password: ").strip()
            self.register_user(firstname, lastname, email, password, userType)

        elif action == 'login':
            email = input("Enter your email address: ").strip()
            password = input("Enter your password: ").strip()
            self.login_user(email, password)

        elif action == 'list users':
            self.print_all_users()

        else:
            print("Invalid option. Please choose 'register', 'login', or 'list users'.")

# Database hosting/Connection settings - Important **
db_config = {
    'host': 'aws-0-eu-west-2.pooler.supabase.com',
    'port': '6543',
    'database': 'postgres',
    'user': 'postgres.uwxfjkzsanrumlwhtjyt',
    'password': 'EPCityPassword123!'
}

user_auth_system = UserAuthSystem(db_config)
try:
    user_auth_system.start()
finally:
    user_auth_system.close_connection()