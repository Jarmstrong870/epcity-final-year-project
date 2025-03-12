import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime

#tests sql queries are correct, and input validation. 

from backend.Repository.adminRepo import (
    fetch_users_from_db,
    update_user_block_status,
    delete_user,
    fetch_active_users_count,
    fetch_total_properties_count,
    fetch_messages_last_24_hours
)

class TestAdminRepo(unittest.TestCase):

    @patch('backend.Repository.adminRepo.psycopg2.connect')
    def test_fetch_users_from_db(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchall.return_value = [
            ('John', 'Doe', 'john.doe@example.com', True, False, datetime(2023, 10, 1, 12, 0, 0)),
            ('Jane', 'Smith', 'jane.smith@example.com', False, True, None)
        ]
        mock_connect.return_value = mock_connection

        users = fetch_users_from_db()
        self.assertEqual(len(users), 2)
        self.assertEqual(users[0]['firstname'], 'John')
        self.assertEqual(users[1]['last_active'], 'Never')

    @patch('backend.Repository.adminRepo.psycopg2.connect')
    def test_update_user_block_status(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = (False,)
        mock_connect.return_value = mock_connection

        result = update_user_block_status('john.doe@example.com')
        self.assertTrue(result)
        mock_cursor.execute.assert_called_with(
            "UPDATE users SET is_blocked = %s WHERE email_address = %s;", (True, 'john.doe@example.com')
        )

    @patch('backend.Repository.adminRepo.psycopg2.connect')
    def test_delete_user(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = mock_connection.cursor.return_value
        mock_connect.return_value = mock_connection

        result = delete_user('john.doe@example.com')
        self.assertTrue(result)
        mock_cursor.execute.assert_called_with(
            "DELETE FROM users WHERE email_address = %s;", 
            ('john.doe@example.com',)
        )

    @patch('backend.Repository.adminRepo.psycopg2.connect')
    def test_fetch_active_users_count(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = (5,)
        mock_connect.return_value = mock_connection

        active_users_count = fetch_active_users_count()
        self.assertEqual(active_users_count, 5)

    @patch('backend.Repository.adminRepo.psycopg2.connect')
    def test_fetch_total_properties_count(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = (10,)
        mock_connect.return_value = mock_connection

        total_properties_count = fetch_total_properties_count()
        self.assertEqual(total_properties_count, 10)

    @patch('backend.Repository.adminRepo.psycopg2.connect')
    def test_fetch_messages_last_24_hours(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = (20,)
        mock_connect.return_value = mock_connection

        messages_count = fetch_messages_last_24_hours()
        self.assertEqual(messages_count, 20)

if __name__ == '__main__':
    unittest.main()