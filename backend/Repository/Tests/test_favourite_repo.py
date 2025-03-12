import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
import psycopg2
from Repository import favouriteRepo  # Importing from the same Repository directory

class TestFavouriteRepo(unittest.TestCase):
    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_get_favourite_properties_from_db_success(self, mock_connect):
        """Test successful retrieval of favourite properties"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake database response
        fake_columns = ['uprn', 'address', 'postcode']
        fake_data = [
            (123456, '10 Downing St', 'SW1A 2AA'),
            (654321, '221B Baker St', 'NW1 6XE')
        ]

        # Set up mock cursor behavior
        mock_cursor.fetchall.return_value = fake_data
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call function
        result = favouriteRepo.get_favourite_properties_from_db("test@example.com")

        # Expected DataFrame
        expected_output = pd.DataFrame(fake_data, columns=fake_columns)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)

        # Ensure correct SQL query was executed
        expected_query = "SELECT * FROM getFavourites(%s)"
        mock_cursor.execute.assert_called_once_with(expected_query, ("test@example.com",))

        # Ensure resources were closed
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_get_favourite_properties_from_db_no_results(self, mock_connect):
        """Test when database returns no results"""

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake empty database response
        fake_columns = ['uprn', 'address', 'postcode']
        mock_cursor.fetchall.return_value = []
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call function
        result = favouriteRepo.get_favourite_properties_from_db("test@example.com")

        # Expected empty DataFrame with correct columns
        expected_output = pd.DataFrame(columns=fake_columns)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)

        # Ensure correct SQL query was executed
        expected_query = "SELECT * FROM getFavourites(%s)"
        mock_cursor.execute.assert_called_once_with(expected_query, ("test@example.com",))

    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_get_favourite_properties_from_db_database_error(self, mock_connect):
        """Test when a database error occurs"""

        mock_connect.side_effect = psycopg2.Error("Database connection failed")

        # Call function (should handle error gracefully)
        result = favouriteRepo.get_favourite_properties_from_db("test@example.com")

        # Expected empty DataFrame
        expected_output = pd.DataFrame()

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)
        
    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_add_favourite_to_db_success(self, mock_connect):
        """Test successful addition of a favourite property"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Call function
        result = favouriteRepo.add_favourite_to_db("test@example.com", 123456)

        # Assertions
        assert result is True

        # Ensure correct SQL query was executed
        expected_query = "SELECT addFavourite(%s, %s)"
        mock_cursor.execute.assert_called_once_with(expected_query, ("test@example.com", 123456))

        # Ensure commit was called
        mock_conn.commit.assert_called_once()

        # Ensure resources were closed
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_add_favourite_to_db_database_error(self, mock_connect):
        """Test when a database error occurs"""

        # Simulate connection failure
        mock_connect.side_effect = psycopg2.Error("Database connection failed")

        # Call function (should handle error gracefully)
        result = favouriteRepo.add_favourite_to_db("test@example.com", 123456)

        # Assertions
        assert result is False
        
    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_remove_favourite_from_db_success(self, mock_connect):
        """Test successful removal of a favourite property"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate that one row was deleted
        mock_cursor.rowcount = 1

        # Call function
        result = favouriteRepo.remove_favourite_from_db("test@example.com", 123456)

        # Assertions
        assert result is True

        # Ensure correct SQL query was executed
        expected_query = "SELECT removeFavourite(%s, %s)"
        mock_cursor.execute.assert_called_once_with(expected_query, ("test@example.com", 123456))

        # Ensure commit was called
        mock_conn.commit.assert_called_once()

        # Ensure resources were closed
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_remove_favourite_from_db_no_match(self, mock_connect):
        """Test when no matching row is found"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate that no rows were affected
        mock_cursor.rowcount = 0

        # Call function
        result = favouriteRepo.remove_favourite_from_db("test@example.com", 123456)

        # Assertions
        assert result is False

        # Ensure correct SQL query was executed
        expected_query = "SELECT removeFavourite(%s, %s)"
        mock_cursor.execute.assert_called_once_with(expected_query, ("test@example.com", 123456))

        # Ensure commit was called
        mock_conn.commit.assert_called_once()

        # Ensure resources were closed
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('Repository.favouriteRepo.psycopg2.connect')
    def test_remove_favourite_from_db_database_error(self, mock_connect):
        """Test when a database error occurs"""

        # Simulate connection failure
        mock_connect.side_effect = psycopg2.Error("Database connection failed")

        # Call function (should handle error gracefully)
        result = favouriteRepo.remove_favourite_from_db("test@example.com", 123456)

        # Assertions
        assert result is False
        
if __name__ == '__main__':
    unittest.main()