import pytest
from unittest.mock import patch, MagicMock
from backend.Repository.groupChatRepo import GroupChatRepo  # Import the class you are testing


@pytest.fixture
def mock_db():
    """Fixture to mock database connection and cursor"""
    with patch("psycopg2.connect") as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        yield mock_cursor, mock_conn


def test_get_groups_by_user_email_success(mock_db):
    """Test getting groups by user email when user is part of groups"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchall.return_value = [
        (1, "Group A", "2024-01-01"),
        (2, "Group B", "2024-02-01"),
    ]

    result = GroupChatRepo.get_groups_by_user_email("test@example.com")

    assert result == [
        {"group_id": 1, "name": "Group A", "created_at": "2024-01-01"},
        {"group_id": 2, "name": "Group B", "created_at": "2024-02-01"},
    ]
    mock_cursor.execute.assert_called_once()


def test_get_groups_by_user_email_no_groups(mock_db):
    """Test when user is not in any groups"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchall.return_value = []

    result = GroupChatRepo.get_groups_by_user_email("test@example.com")

    assert result == []  # Expect empty list
    mock_cursor.execute.assert_called_once()


def test_create_new_group_success(mock_db):
    """Test successfully creating a new group"""
    mock_cursor, mock_conn = mock_db
    mock_cursor.fetchone.side_effect = [(10,), (20,), (30,)]  # Mock group_id and user_ids

    result = GroupChatRepo.create_new_group("New Group", ["user1@example.com"], "owner@example.com")

    assert result == {"group_id": 10, "name": "New Group"}
    assert mock_cursor.execute.call_count >= 2  # Ensure multiple inserts
    mock_conn.commit.assert_called_once()  # Ensure commit happens

def test_insert_message_user_not_found(mock_db):
    """Test inserting a message when sender is not found"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchone.side_effect = [None]  # User not found

    result = GroupChatRepo.insert_message(5, "Hello!", "unknown@example.com")

    assert result == ({"error": "Sender email not found in database"}, 400)
