import sys
import os
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from backend.Service import registerService


@pytest.fixture
def valid_user_data():
    return {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "password": "securePass123",
        "userType": "student"
    }

@patch("backend.Service.registerService.RegisterRepo.check_email_exists")
@patch("backend.Service.registerService.RegisterRepo.get_next_user_id")
@patch("backend.Service.registerService.RegisterRepo.insert_new_user")
@patch("backend.Service.registerService.send_welcome_email")
def test_register_user_service_success(mock_send_email, mock_insert_user, mock_get_id, mock_check_email, valid_user_data):
    mock_check_email.return_value = False
    mock_get_id.return_value = 1
    mock_insert_user.return_value = None
    mock_send_email.return_value = None

    response, status = registerService.register_user_service(valid_user_data)

    assert status == 201
    assert "Registration successful!" in response["message"]
    mock_check_email.assert_called_once_with(valid_user_data["email"])
    mock_insert_user.assert_called_once()
    mock_send_email.assert_called_once()


def test_register_user_service_missing_fields():
    data = {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "password": ""  # Missing password
    }
    response, status = registerService.register_user_service(data)
    assert status == 400
    assert "All fields must be entered" in response["message"]


def test_register_user_service_short_password(valid_user_data):
    valid_user_data["password"] = "123"
    response, status = registerService.register_user_service(valid_user_data)
    assert status == 400
    assert "Password must be at least 7 characters" in response["message"]


@patch("backend.Service.registerService.RegisterRepo.check_email_exists")
def test_register_user_service_email_exists(mock_check_email, valid_user_data):
    mock_check_email.return_value = True
    response, status = registerService.register_user_service(valid_user_data)
    assert status == 409
    assert "An account with this email already exists" in response["message"]


@patch("backend.Service.registerService.RegisterRepo.check_email_exists")
@patch("backend.Service.registerService.RegisterRepo.get_next_user_id")
@patch("backend.Service.registerService.RegisterRepo.insert_new_user")
@patch("backend.Service.registerService.send_welcome_email")
def test_register_user_service_exception(mock_send_email, mock_insert_user, mock_get_id, mock_check_email, valid_user_data):
    mock_check_email.return_value = False
    mock_get_id.side_effect = Exception("DB Error")

    response, status = registerService.register_user_service(valid_user_data)
    assert status == 500
    assert "An internal error occurred" in response["message"]


def test_generate_otp_length():
    otp = registerService.generate_otp()
    assert len(otp) == 6
    assert otp.isdigit()


@patch("backend.Service.registerService.RegisterRepo.save_registration_otp")
@patch("backend.Service.registerService.send_registration_otp_email")
def test_request_registration_otp_service(mock_send_email, mock_save_otp):
    mock_send_email.return_value = None
    mock_save_otp.return_value = None

    response, status = registerService.request_registration_otp_service("test@example.com")
    assert status == 200
    assert "OTP has been sent" in response["message"]
    mock_save_otp.assert_called_once()
    mock_send_email.assert_called_once()


@patch("backend.Service.registerService.RegisterRepo.get_registration_otp")
def test_verify_registration_otp_service_success(mock_get_otp):
    mock_get_otp.return_value = ("123456", datetime.utcnow() + timedelta(minutes=5))
    response, status = registerService.verify_registration_otp_service("test@example.com", "123456")
    assert status == 200
    assert "OTP verified successfully" in response["message"]


@patch("backend.Service.registerService.RegisterRepo.get_registration_otp")
def test_verify_registration_otp_service_invalid(mock_get_otp):
    mock_get_otp.return_value = ("654321", datetime.utcnow() + timedelta(minutes=5))
    response, status = registerService.verify_registration_otp_service("test@example.com", "123456")
    assert status == 400
    assert "Invalid OTP" in response["message"]


@patch("backend.Service.registerService.RegisterRepo.get_registration_otp")
def test_verify_registration_otp_service_expired(mock_get_otp):
    mock_get_otp.return_value = ("123456", datetime.utcnow() - timedelta(minutes=5))
    response, status = registerService.verify_registration_otp_service("test@example.com", "123456")
    assert status == 400
    assert "OTP has expired" in response["message"]


@patch("backend.Service.registerService.RegisterRepo.check_email_exists")
def test_check_email_exists_service(mock_check_email):
    mock_check_email.return_value = True
    result = registerService.check_email_exists_service("test@example.com")
    assert result is True
    mock_check_email.assert_called_once_with("test@example.com")
