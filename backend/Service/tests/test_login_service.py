from unittest.mock import patch, MagicMock
import sys
import os

# Make sure the `Service` directory is included in the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from loginService import login_user_service  # Importing login_user_service from loginService.py


@patch('loginService.connect')  # Mocking the database connect method
def test_login_user_service_success(mock_connect):
    # Mock database connection and cursor
    mock_connection = MagicMock()
    mock_cursor = MagicMock()
    mock_connect.return_value = mock_connection
    mock_connection.cursor.return_value = mock_cursor

    # Set up the cursor to return a user with firstname and password hash
    mock_cursor.fetchone.return_value = ('John', 'hashed_password')

    # Mock the input data
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }

    # Mock the bcrypt checkpw function to return True (password match)
    with patch('loginService.checkpw', return_value=True):
        response, status_code = login_user_service(data)

    # Verify the response and status code
    assert status_code == 200
    assert response['message'] == 'Welcome back to EPCity, John!'
    assert response['firstname'] == 'John'


@patch('loginService.connect')
def test_login_user_service_user_not_found(mock_connect):
    # Mock database connection and cursor
    mock_connection = MagicMock()
    mock_cursor = MagicMock()
    mock_connect.return_value = mock_connection
    mock_connection.cursor.return_value = mock_cursor

    # Set up the cursor to return None (user not found)
    mock_cursor.fetchone.return_value = None

    # Mock the input data
    data = {
        'email': 'unknown@example.com',
        'password': 'password123'
    }

    response, status_code = login_user_service(data)

    # Verify the response and status code
    assert status_code == 404
    assert response['message'] == 'No account has been found with this email. Please register first.'


@patch('loginService.connect')
def test_login_user_service_incorrect_password(mock_connect):
    # Mock database connection and cursor
    mock_connection = MagicMock()
    mock_cursor = MagicMock()
    mock_connect.return_value = mock_connection
    mock_connection.cursor.return_value = mock_cursor

    # Set up the cursor to return a user with firstname and password hash
    mock_cursor.fetchone.return_value = ('John', 'hashed_password')

    # Mock the input data
    data = {
        'email': 'test@example.com',
        'password': 'wrongpassword'
    }

    # Mock the bcrypt checkpw function to return False (password mismatch)
    with patch('loginService.checkpw', return_value=False):
        response, status_code = login_user_service(data)

    # Verify the response and status code
    assert status_code == 401
    assert response['message'] == 'Incorrect password. Please try again.'


@patch('loginService.connect')
def test_login_user_service_missing_fields(mock_connect):
    # Mock input data with missing email or password
    data = {
        'email': ''  # Missing email field
    }

    response, status_code = login_user_service(data)

    # Verify the response and status code
    assert status_code == 400
    assert response['message'] == 'Both email and password fields must be entered.'


@patch('loginService.connect')
def test_login_user_service_internal_error(mock_connect):
    # Set up the mock to throw an exception when connecting to the database
    mock_connect.side_effect = Exception("Database connection failed")

    # Mock the input data
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }

    response, status_code = login_user_service(data)

    # Verify the response and status code
    assert status_code == 500
    assert response['message'] == 'An internal error occurred. Please try again later.'


@patch('loginService.connect')
def test_login_user_service_sql_injection(mock_connect):
    # Mock database connection and cursor
    mock_connection = MagicMock()
    mock_cursor = MagicMock()
    mock_connect.return_value = mock_connection
    mock_connection.cursor.return_value = mock_cursor

    # Set up the cursor to return None, assuming no valid user is found with the attempted SQL injection
    mock_cursor.fetchone.return_value = None

    # Mock the input data to attempt SQL injection
    data = {
        'email': "' OR '1'='1'; --",
        'password': 'password123'
    }

    # Call the service function with the SQL injection attempt
    response, status_code = login_user_service(data)

    # Verify that the SQL injection attempt does not return a valid user
    assert status_code == 404
    assert response['message'] == 'No account has been found with this email. Please register first.'

