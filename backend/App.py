from flask import Flask, request, jsonify
from flask_cors import CORS
from psycopg2 import sql, connect
from bcrypt import hashpw, gensalt, checkpw
import json

app = Flask(__name__)
CORS(app)  #allow frontend comm

# Database configuration
db_config = {
    'host': 'aws-0-eu-west-2.pooler.supabase.com',
    'port': '6543',
    'database': 'postgres',
    'user': 'postgres.uwxfjkzsanrumlwhtjyt',
    'password': 'EPCityPassword123!'
}

# Connect to the database
connection = connect(**db_config)
cursor = connection.cursor()

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')
    userType = data.get('userType')

    cursor.execute("SELECT * FROM users WHERE email_address = %s;", (email,))
    if cursor.fetchone():
        return jsonify({"message": "An account with this email already exists."}), 409

    password_hash = hashpw(password.encode('utf-8'), gensalt())

    cursor.execute(
        """
        INSERT INTO users (firstname, lastname, email_address, password_hash, "userType")
        VALUES (%s, %s, %s, %s, %s);
        """,
        (firstname, lastname, email, password_hash.decode('utf-8'), userType)
    )
    connection.commit()
    return jsonify({"message": "Registration successful!"}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cursor.execute("SELECT firstname, password_hash FROM users WHERE email_address = %s;", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "No account has been found with this email. Please register first."}), 404

    firstname, stored_password_hash = user

    if isinstance(stored_password_hash, memoryview):
        stored_password_hash = stored_password_hash.tobytes().decode('utf-8')

    if checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
        return jsonify({"message": f"Welcome back to EPCity, {firstname}!", "firstname": firstname}), 200
    else:
        return jsonify({"message": "Incorrect password. Please try again."}), 401

if __name__ == '__main__':
    app.run(port=5002, debug=True)
