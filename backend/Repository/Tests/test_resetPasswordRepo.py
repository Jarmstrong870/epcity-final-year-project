import sys
import os
import pytest
from unittest import mock
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.Repository.resetPasswordRepo import ResetPasswordRepo

@pytest.fixture
def mock_connect():
    with mock.patch("backend.Repository.resetPasswordRepo.psycopg2.connect") as mock_connect:
        yield mock_connect

def test_save_reset_otp_success(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    expiry = datetime.utcnow()
    ResetPasswordRepo.save_reset_otp("test@email.com", "123456", expiry)

    mock_cursor.execute.assert_called_once()
    mock_conn.commit.assert_called_once()

def test_get_otp_found(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = ("123456", datetime.utcnow())
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    result = ResetPasswordRepo.get_otp("test@email.com")
    assert result[0] == "123456"

def test_get_otp_not_found(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    result = ResetPasswordRepo.get_otp("unknown@email.com")
    assert result == (None, None)

def test_update_password_success(mock_connect):
    mock_cursor = mock.MagicMock()
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    ResetPasswordRepo.update_password("test@email.com", "newhashedpassword")

    mock_cursor.execute.assert_called_once()
    mock_conn.commit.assert_called_once()
