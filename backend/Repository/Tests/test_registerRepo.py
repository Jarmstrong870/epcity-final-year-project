import sys
import os
import pytest
from unittest import mock
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.Repository.registerRepo import RegisterRepo

@pytest.fixture
def mock_connect():
    with mock.patch("backend.Repository.registerRepo.psycopg2.connect") as mock_connect:
        yield mock_connect

def test_check_email_exists_found(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = (1,)
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    result = RegisterRepo.check_email_exists("test@email.com")
    assert result is True

def test_check_email_exists_not_found(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    result = RegisterRepo.check_email_exists("unknown@email.com")
    assert result is False

def test_get_next_user_id(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = (5,)
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    result = RegisterRepo.get_next_user_id()
    assert result == 5

def test_insert_new_user_success(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    RegisterRepo.insert_new_user(1, "John", "Doe", "john@email.com", "hashed_pw", "student")
    mock_cursor.execute.assert_called_once()
    mock_conn.commit.assert_called_once()

def test_save_registration_otp_success(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    expiry = datetime.utcnow()
    RegisterRepo.save_registration_otp("test@email.com", "123456", expiry)

    mock_cursor.execute.assert_called_once()
    mock_conn.commit.assert_called_once()

def test_get_registration_otp_found(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = ("123456", datetime.utcnow())
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    result = RegisterRepo.get_registration_otp("test@email.com")
    assert result[0] == "123456"

def test_get_registration_otp_not_found(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    result = RegisterRepo.get_registration_otp("unknown@email.com")
    assert result == (None, None)
