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


def test_get_group_messages(mock_db):
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


def test_delete_group_data_not_admin(mock_db):
    """Test deletion attempt by non-admin"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchone.side_effect = [(2,), (3,)]  # user_id, admin_id

    result = GroupChatRepo.delete_group_data(1, "test@example.com")

    assert result == ({"error": "Only the admin is able to delete this group"}, 403)


def test_edit_group_name_success(mock_db):
    """Test successful group name edit"""
    mock_cursor, mock_conn = mock_db
    mock_cursor.fetchone.side_effect = [(1,), (10,)]  # user_id, membership_id

    result = GroupChatRepo.edit_group_name(5, "New Team Name", "test@example.com")

    assert result == {"message": "The group name has been successfully updated to New Team Name"}
    mock_conn.commit.assert_called_once()


def test_exit_group_not_member(mock_db):
    """Test exit attempt by non-member"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchone.side_effect = [(2,), None]  # user_id found, but no membership

    result = GroupChatRepo.exit_group(1, "test@example.com")

    assert result == {"error": "member can't be found in this group"}


def test_get_all_group_members(mock_db):
    """Test getting members of a group"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchall.return_value = [(1, "Alex", "alex@example.com")]

    result = GroupChatRepo.get_all_group_members(1)

    assert result == [{"user_id": 1, "firstname": "Alex", "email_address": "alex@example.com"}]


def test_search_group_message(mock_db):
    """Test searching group messages"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchall.return_value = [
        (1, "Test Message", MagicMock(isoformat=lambda: "2024-04-04T10:00:00"), 2, "Max", None)
    ]

    result = GroupChatRepo.search_group_message(1, "%test%")

    assert result[0]["sender_name"] == "Max"


def test_add_new_member_not_found(mock_db):
    """Test adding a member that doesn't exist"""
    mock_cursor, _ = mock_db
    mock_cursor.fetchone.return_value = None  # No user found

    result = GroupChatRepo.add_new_member(1, "test@example.com")

    assert result == ({"error": "User email not found in database"}, 400)
