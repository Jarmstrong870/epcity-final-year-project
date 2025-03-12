import unittest
from unittest.mock import patch, MagicMock
from backend.Repository.accountOverviewRepo import AccountOverviewRepo

class TestAccountOverviewRepo(unittest.TestCase):

    @patch('backend.Repository.accountOverviewRepo.psycopg2.connect')  # Mock the DB connection
    def test_get_password_hash(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Simulate return value from database
        mock_cursor.fetchone.return_value = ("hashed_password",)

        # Run function
        result = AccountOverviewRepo.get_password_hash("test@example.com")

        # Assertions
        self.assertEqual(result, "hashed_password")
        mock_cursor.execute.assert_called_once_with(
            "SELECT password_hash FROM users WHERE email_address = %s;", ("test@example.com",)
        )

    @patch('backend.Repository.accountOverviewRepo.psycopg2.connect')
    def test_update_password(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Simulate an update
        mock_cursor.rowcount = 1  # Simulating successful update

        # Run function
        result = AccountOverviewRepo.update_password("test@example.com", "new_hashed_password")

        # Assertions
        self.assertTrue(result)
        mock_cursor.execute.assert_called_once_with(
            "UPDATE users SET password_hash = %s WHERE email_address = %s;",
            ("new_hashed_password", "test@example.com")
        )

    @patch('backend.Repository.accountOverviewRepo.psycopg2.connect')
    def test_delete_user(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Simulate successful deletion
        mock_cursor.rowcount = 1

        # Run function
        result = AccountOverviewRepo.delete_user("test@example.com")

        # Assertions
        self.assertTrue(result)
        mock_cursor.execute.assert_called_once_with(
            "DELETE FROM users WHERE email_address = %s;", ("test@example.com",)
        )

    @patch('backend.Repository.accountOverviewRepo.psycopg2.connect')
    def test_update_user_details(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        mock_cursor.rowcount = 1  # Simulating successful update

        result = AccountOverviewRepo.update_user_details("test@example.com", "John", "Doe")

        self.assertTrue(result)
        mock_cursor.execute.assert_called_once_with(
            "UPDATE users SET firstname = %s, lastname = %s WHERE email_address = %s;",
            ("John", "Doe", "test@example.com")
        )

    @patch('backend.Repository.accountOverviewRepo.psycopg2.connect')
    def test_update_profile_image_url(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        mock_cursor.rowcount = 1

        result = AccountOverviewRepo.update_profile_image_url("test@example.com", "https://image.url")

        self.assertTrue(result)
        mock_cursor.execute.assert_called_once_with(
            "UPDATE users SET profile_image_url = %s WHERE email_address = %s;",
            ("https://image.url", "test@example.com")
        )

    @patch('backend.Repository.accountOverviewRepo.psycopg2.connect')
    def test_get_user_details(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Simulate user record from database
        mock_cursor.fetchone.return_value = ("John", "Doe", "test@example.com", "https://image.url")

        result = AccountOverviewRepo.get_user_details("test@example.com")

        self.assertEqual(result, ("John", "Doe", "test@example.com", "https://image.url"))
        mock_cursor.execute.assert_called_once_with(
            "SELECT firstname, lastname, email_address, profile_image_url FROM users WHERE email_address = %s;",
            ("test@example.com",)
        )

if __name__ == '__main__':
    unittest.main()
