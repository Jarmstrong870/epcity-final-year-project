from unittest.mock import patch, MagicMock
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.Service.loginService import login_user_service


@patch('backend.Service.loginService.update_user_last_active')
@patch('backend.Service.loginService.checkpw')
@patch('backend.Service.loginService.find_user_by_email')
def test_login_user_service_success(mock_find_user, mock_checkpw, mock_update_active):
    mock_find_user.return_value = {
        'firstname': 'John',
        'lastname': 'Doe',
        'password_hash': 'hashed_password',
        'is_admin': False,
        'user_type': 'student'
    }
    mock_checkpw.return_value = True

    data = {'email': 'test@example.com', 'password': 'password123'}
    response, status = login_user_service(data)

    assert status == 200
    assert response['message'] == 'Welcome back to EPCity, John!'
    assert response['firstname'] == 'John'
    mock_update_active.assert_called_once()


@patch('backend.Service.loginService.find_user_by_email')
def test_login_user_service_user_not_found(mock_find_user):
    mock_find_user.return_value = None
    data = {'email': 'unknown@example.com', 'password': 'password123'}
    response, status = login_user_service(data)
    assert status == 404
    assert 'No account has been found' in response['message']


def test_login_user_service_missing_fields():
    data = {'email': ''}
    response, status = login_user_service(data)
    assert status == 400
    assert 'must be entered' in response['message']


@patch('backend.Service.loginService.find_user_by_email')
@patch('backend.Service.loginService.checkpw')
def test_login_user_service_incorrect_password(mock_checkpw, mock_find_user):
    mock_find_user.return_value = {
        'firstname': 'John',
        'lastname': 'Doe',
        'password_hash': 'hashed_password',
        'is_admin': False,
        'user_type': 'student'
    }
    mock_checkpw.return_value = False

    data = {'email': 'test@example.com', 'password': 'wrongpassword'}
    response, status = login_user_service(data)
    assert status == 401
    assert 'Incorrect password' in response['message']


@patch('backend.Service.loginService.find_user_by_email')
def test_login_user_service_internal_error(mock_find_user):
    mock_find_user.side_effect = Exception("DB error")
    data = {'email': 'test@example.com', 'password': 'password123'}
    response, status = login_user_service(data)
    assert status == 500
    assert 'internal error' in response['message']

