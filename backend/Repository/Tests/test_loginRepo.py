import sys
import os
from unittest import mock
import pytest

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.Repository import loginRepo


@pytest.fixture
def mock_connection():
    with mock.patch("backend.Repository.loginRepo.psycopg2.connect") as mock_connect:
        yield mock_connect


def test_find_user_by_email_success(mock_connection):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = {
        "firstname": "John",
        "lastname": "Doe",
        "password_hash": "hashed_pw",
        "is_admin": False,
        "is_blocked": False,
        "user_type": "student"
    }
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connection.return_value.__enter__.return_value = mock_conn

    result = loginRepo.find_user_by_email("test@email.com")
    assert result == {
        "firstname": "John",
        "lastname": "Doe",
        "password_hash": "hashed_pw",
        "is_admin": False,
        "user_type": "student"
    }


def test_find_user_by_email_blocked_user(mock_connection):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = {
        "firstname": "Jane",
        "lastname": "Smith",
        "password_hash": "hashed_pw",
        "is_admin": False,
        "is_blocked": True,
        "user_type": "student"
    }
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connection.return_value.__enter__.return_value = mock_conn

    result = loginRepo.find_user_by_email("blocked@email.com")
    assert result == {
        "error": "This account has been blocked. Please contact support."
    }


def test_find_user_by_email_not_found(mock_connection):
    mock_cursor = mock.MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connection.return_value.__enter__.return_value = mock_conn

    result = loginRepo.find_user_by_email("unknown@email.com")
    assert result is None


def test_update_user_last_active_success(mock_connection):
    mock_cursor = mock.MagicMock()
    mock_conn = mock.MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connection.return_value.__enter__.return_value = mock_conn

    loginRepo.update_user_last_active("test@email.com")

    mock_cursor.execute.assert_called_once()
    query = "UPDATE users SET last_active = %s WHERE email_address = %s;"
    args = mock_cursor.execute.call_args[0]
    assert query in args[0]
    assert args[1][1] == "test@email.com"
    mock_conn.commit.assert_called_once()


def test_update_user_last_active_exception(mock_connection, capsys):
    mock_connection.side_effect = Exception("DB Error")

    loginRepo.update_user_last_active("fail@email.com")
    captured = capsys.readouterr()
    assert "Error updating last active time" in captured.out
