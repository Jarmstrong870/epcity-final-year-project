from datetime import date
import datetime
from decimal import Decimal
import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from Repository import propertyRepo  # Importing from the same Repository directory

class TestPropertyRepo(unittest.TestCase):

    @patch('propertyRepo.psycopg2.connect')  # Mock DB connection
    def test_get_all_properties_success(self, mock_connect):
        """Test successful retrieval of properties"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake data to return
        fake_columns = ['id', 'name', 'location']
        fake_data = [(1, 'House A', 'New York'), (2, 'House B', 'Los Angeles')]
        
        # Set up the cursor behavior
        mock_cursor.fetchall.return_value = fake_data
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call the function
        result = propertyRepo.get_all_properties()

        # Expected Output
        expected_output = [
            {'id': 1, 'name': 'House A', 'location': 'New York'},
            {'id': 2, 'name': 'House B', 'location': 'Los Angeles'}
        ]

        # Assertions
        self.assertEqual(result, expected_output)
        mock_cursor.execute.assert_called_once_with("SELECT * FROM properties")
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_all_properties_failure(self, mock_connect):
        """Test error handling when database connection fails"""

        # Simulate an exception when connecting
        mock_connect.side_effect = Exception("Database connection error")

        # Call the function and verify it handles the error gracefully
        result = propertyRepo.get_all_properties()

        # Assertions
        self.assertEqual(result, [])  # Should return an empty list on failure
        
    @patch('propertyRepo.psycopg2.connect')  # Mock DB connection
    @patch('propertyRepo.execute_values')  # Mock bulk insert
    def test_update_properties_in_db_success(self, mock_execute_values, mock_connect):
        """Test successful update of the properties table"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate user_properties data
        mock_cursor.fetchall.return_value = [(1, 123456), (2, 654321)]

        # Fake DataFrame for property data
        fake_data = pd.DataFrame({
            'uprn': [123456, 654321],
            'address': ['123 Fake St', '456 Real Rd'],
            'postcode': ['AB1 2CD', 'EF3 4GH'],
            'property_type': ['House', 'Apartment'],
            'lodgement_datetime': ['2024-01-01', '2024-01-02'],
            'current_energy_efficiency': [75, 80],
            'current_energy_rating': ['C', 'B'],
            'heating_cost_current': [100, 120],
            'hot_water_cost_current': [50, 60],
            'lighting_cost_current': [20, 25],
            'total_floor_area': [100.0, 75.0],
            'number_bedrooms': [3, 2],
            'energy_consumption_current': [250, 200],
            'local_authority': ['LA1', 'LA2']
        })

        # Call the function
        result = propertyRepo.update_properties_in_db(fake_data, 'LA1')

        # Assertions
        self.assertTrue(result)  # Function should return True on success
        mock_cursor.execute.assert_any_call("SELECT * FROM user_properties")
        mock_cursor.execute.assert_any_call("DELETE FROM user_properties")
        mock_cursor.execute.assert_any_call(
            "DELETE FROM properties WHERE local_authority = %s",
            ('LA1',)
        )
        self.assertEqual(mock_execute_values.call_count, 2)  # Properties + user_properties
        mock_conn.commit.assert_called_once()  # Ensure commit was called
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    def test_update_properties_in_db_failure(self, mock_connect):
        """Test error handling when database update fails"""

        # Simulate an exception when connecting
        mock_connect.side_effect = Exception("Database connection error")

        # Create a fake DataFrame
        fake_data = pd.DataFrame({'uprn': [], 'address': []})

        # Call the function and verify it handles the error gracefully
        result = propertyRepo.update_properties_in_db(fake_data, 'LA1')

        # Assertions
        self.assertFalse(result)  # Should return False on failure

    @patch('propertyRepo.psycopg2.connect')  
    @patch('propertyRepo.execute_values')
    def test_update_properties_in_db_partial_failure(self, mock_execute_values, mock_connect):
        """Test rollback when insert fails"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate user_properties data
        mock_cursor.fetchall.return_value = [(1, 123456), (2, 654321)]

        # Fake DataFrame
        fake_data = pd.DataFrame({'uprn': [123456], 'address': ['123 Fake St']})

        # Simulate failure during property insert
        mock_execute_values.side_effect = Exception("Insert failed!")

        # Call the function
        result = propertyRepo.update_properties_in_db(fake_data, 'LA1')

        # Assertions
        self.assertFalse(result)  # Function should return False on failure
        mock_conn.rollback.assert_called_once()  # Ensure rollback is called
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()
        
    @patch('propertyRepo.psycopg2.connect')  # Mock DB connection
    @patch('propertyRepo.execute_values')  # Mock bulk insert
    def test_update_inflation_data_in_db_success(self, mock_execute_values, mock_connect):
        """Test successful update of the inflation table"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake DataFrame for inflation data
        fake_data = pd.DataFrame({
            'date': ['2024-01-01', '2024-02-01'],
            'cpih_value': [110.5, 111.2]
        })

        # Call the function
        result = propertyRepo.update_inflation_data_in_db(fake_data)

        # Assertions
        self.assertTrue(result)  # Function should return True on success
        mock_cursor.execute.assert_any_call("DELETE FROM inflation")  # Ensure delete is called
        mock_execute_values.assert_called_once()  # Ensure execute_values() is called once
        mock_conn.commit.assert_called_once()  # Ensure commit was called
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    def test_update_inflation_data_in_db_failure(self, mock_connect):
        """Test error handling when database update fails"""

        # Simulate an exception when connecting
        mock_connect.side_effect = Exception("Database connection error")

        # Create a fake DataFrame
        fake_data = pd.DataFrame({'date': [], 'cpih_value': []})

        # Call the function and verify it handles the error gracefully
        result = propertyRepo.update_inflation_data_in_db(fake_data)

        # Assertions
        self.assertFalse(result)  # Should return False on failure

    @patch('propertyRepo.psycopg2.connect')  
    @patch('propertyRepo.execute_values')
    def test_update_inflation_data_in_db_partial_failure(self, mock_execute_values, mock_connect):
        """Test rollback when insert fails"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake DataFrame
        fake_data = pd.DataFrame({'date': ['2024-01-01'], 'cpih_value': [110.5]})

        # Simulate failure during insert
        mock_execute_values.side_effect = Exception("Insert failed!")

        # Call the function
        result = propertyRepo.update_inflation_data_in_db(fake_data)

        # Assertions
        self.assertFalse(result)  # Function should return False on failure
        mock_conn.rollback.assert_called_once()  # Ensure rollback is called
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    @patch('propertyRepo.execute_values')
    def test_update_inflation_data_in_db_empty_dataframe(self, mock_execute_values, mock_connect):
        """Test handling of empty DataFrame"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Empty DataFrame
        empty_data = pd.DataFrame(columns=['date', 'cpih_value'])

        # Call the function
        result = propertyRepo.update_inflation_data_in_db(empty_data)

        # Assertions
        self.assertTrue(result)  # Function should still return True
        mock_cursor.execute.assert_any_call("DELETE FROM inflation")  # Ensure delete is called
        mock_execute_values.assert_not_called()  # No insert should happen
        mock_conn.commit.assert_called_once()  # Ensure commit was called
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()
        
    @patch('propertyRepo.psycopg2.connect')  # Mock DB connection
    def test_get_top_rated_from_db_success(self, mock_connect):
        """Test successful retrieval of top 6 rated energy-efficient properties"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate property data
        fake_columns = ['id', 'name', 'current_energy_efficiency']
        fake_data = [
            (1, 'House A', 95),
            (2, 'House B', 92),
            (3, 'House C', 90),
            (4, 'House D', 88),
            (5, 'House E', 87),
            (6, 'House F', 85),
        ]
        
        # Set up the cursor behavior
        mock_cursor.fetchall.return_value = fake_data
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call the function
        result = propertyRepo.get_top_rated_from_db()

        # Expected Output as a Pandas DataFrame
        expected_output = pd.DataFrame(fake_data, columns=fake_columns)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)
        mock_cursor.execute.assert_called_once_with(
            "SELECT * FROM properties ORDER BY current_energy_efficiency DESC LIMIT 6;"
        )
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_top_rated_from_db_connection_failure(self, mock_connect):
        """Test error handling when database connection fails"""

        # Simulate a database connection failure
        mock_connect.side_effect = Exception("Database connection error")

        # Call the function
        result = propertyRepo.get_top_rated_from_db()

        # Assertions
        self.assertIsNone(result)  # Should return None on failure

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_top_rated_from_db_query_failure(self, mock_connect):
        """Test error handling when query execution fails"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate query failure
        mock_cursor.execute.side_effect = Exception("Query execution failed")

        # Call the function
        result = propertyRepo.get_top_rated_from_db()

        # Assertions
        self.assertIsNone(result)  # Should return None on query failure
        mock_conn.rollback.assert_called_once()  # Ensure rollback is triggered
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()
        
    @patch('propertyRepo.psycopg2.connect')  # Mock DB connection
    def test_get_data_from_db_success(self, mock_connect):
        """Test successful retrieval of filtered properties"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake property data
        fake_columns = ['id', 'address', 'postcode', 'property_type', 'current_energy_rating', 'number_bedrooms']
        fake_data = [
            (1, '123 Fake St', 'AB1 2CD', 'House', 'A', 3),
            (2, '456 Real Rd', 'EF3 4GH', 'Apartment', 'B', 2),
        ]

        # Set up the cursor behavior
        mock_cursor.fetchall.return_value = fake_data
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call the function
        result = propertyRepo.get_data_from_db(property_types=['House'], energy_ratings=['A'], search='Fake')

        # Expected Output as a Pandas DataFrame
        expected_output = pd.DataFrame(fake_data, columns=fake_columns)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)
        mock_cursor.execute.assert_called_once()  # Ensure query execution
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_data_from_db_connection_failure(self, mock_connect):
        """Test error handling when database connection fails"""

        # Simulate a database connection failure
        mock_connect.side_effect = Exception("Database connection error")

        # Call the function
        result = propertyRepo.get_data_from_db()

        # Assertions
        self.assertIsInstance(result, str)  # Should return an error message

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_data_from_db_invalid_sort_order(self, mock_connect):
        """Test ValueError when an invalid sort order is provided"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Call the function with an invalid sort order
        result = propertyRepo.get_data_from_db(sort_by='current_energy_efficiency', order='invalid_order')

        # Assertions
        self.assertIsInstance(result, str)
        self.assertIn("Invalid input", result)

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_data_from_db_empty_filtering(self, mock_connect):
        """Test function with no filters applied"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake Data
        fake_columns = ['id', 'address', 'postcode', 'property_type', 'current_energy_rating', 'number_bedrooms']
        fake_data = [
            (1, '123 Fake St', 'AB1 2CD', 'House', 'A', 3),
            (2, '456 Real Rd', 'EF3 4GH', 'Apartment', 'B', 2),
        ]

        # Set up the cursor behavior
        mock_cursor.fetchall.return_value = fake_data
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call the function without filters
        result = propertyRepo.get_data_from_db()

        # Expected Output as a Pandas DataFrame
        expected_output = pd.DataFrame(fake_data, columns=fake_columns)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)
        mock_cursor.execute.assert_called_once()  # Ensure query execution
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()
        
    @patch('propertyRepo.psycopg2.connect')  # Mock DB connection
    def test_get_area_data_from_db_success(self, mock_connect):
        """Test successful retrieval of properties in a given postcode and bedroom count"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Fake property data
        fake_columns = ['id', 'address', 'postcode', 'number_bedrooms']
        fake_data = [
            (1, '123 Fake St', 'AB1 2CD', 3),
            (2, '456 Real Rd', 'AB1 2CD', 3),
        ]

        # Set up the cursor behavior
        mock_cursor.fetchall.return_value = fake_data
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call the function
        result = propertyRepo.get_area_data_from_db('AB1 2CD', 3)

        # Expected Output as a Pandas DataFrame
        expected_output = pd.DataFrame(fake_data, columns=fake_columns)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)
        mock_cursor.execute.assert_called_once_with(
            "SELECT * FROM properties WHERE postcode = %s AND number_bedrooms = %s;",
            ['AB1 2CD', 3]
        )
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_area_data_from_db_connection_failure(self, mock_connect):
        """Test error handling when database connection fails"""

        # Simulate a database connection failure
        mock_connect.side_effect = Exception("Database connection error")

        # Call the function
        result = propertyRepo.get_area_data_from_db('AB1 2CD', 3)

        # Assertions
        self.assertIsNone(result)  # Should return None on failure

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_area_data_from_db_query_failure(self, mock_connect):
        """Test error handling when query execution fails"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate query failure
        mock_cursor.execute.side_effect = Exception("Query execution failed")

        # Call the function
        result = propertyRepo.get_area_data_from_db('AB1 2CD', 3)

        # Assertions
        self.assertIsNone(result)  # Should return None on query failure
        mock_conn.rollback.assert_called_once()  # Ensure rollback is triggered
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()
        
    @patch('propertyRepo.psycopg2.connect')
    def test_get_latest_and_lodgement_cpih_success(self, mock_connect):
        """Test successful retrieval of latest and lodgement date CPIH values"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Use datetime.date and Decimal to match function output
        fake_columns = ['date', 'cpih_value']
        fake_data = [
            (date(2024, 12, 1), Decimal('129.70')),  # Matches actual function output
            (date(2023, 12, 1), Decimal('120.50'))
        ]

        # Set up the cursor behavior
        mock_cursor.fetchall.return_value = fake_data
        mock_cursor.description = [(col,) for col in fake_columns]

        # Call the function
        result = propertyRepo.get_latest_and_lodgement_cpih('2023-12-01')

        # Ensure DataFrame has correct types (datetime.date and Decimal)
        expected_output = pd.DataFrame(fake_data, columns=fake_columns)

        # Convert 'date' column to datetime.date (if Pandas converted it to string)
        expected_output['date'] = expected_output['date'].apply(lambda x: x if isinstance(x, date) else datetime.datetime.strptime(x, "%Y-%m-%d").date())
        result['date'] = result['date'].apply(lambda x: x if isinstance(x, date) else datetime.datetime.strptime(x, "%Y-%m-%d").date())

        # Convert 'cpih_value' to float for Pandas compatibility
        expected_output['cpih_value'] = expected_output['cpih_value'].astype(float)
        result['cpih_value'] = result['cpih_value'].astype(float)

        # Assertions - Ignore Index Differences
        pd.testing.assert_frame_equal(result, expected_output, check_dtype=False, check_index_type=False)

        # Ensure the correct SQL query was executed
        expected_query = """
            (SELECT date, cpih_value FROM inflation ORDER BY date DESC LIMIT 1)
            UNION ALL
            (SELECT date, cpih_value FROM inflation WHERE date <= %s ORDER BY date DESC LIMIT 1);
        """.strip()

        expected_lodgement_date = datetime.datetime.strptime('2023-12-01', "%Y-%m-%d").date()

        mock_cursor.execute.assert_called_once_with(expected_query, (expected_lodgement_date,))
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_latest_and_lodgement_cpih_connection_failure(self, mock_connect):
        """Test error handling when database connection fails"""

        # Simulate a database connection failure
        mock_connect.side_effect = Exception("Database connection error")

        # Call the function
        result = propertyRepo.get_latest_and_lodgement_cpih('2023-12-15')

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame

    @patch('propertyRepo.psycopg2.connect')  
    def test_get_latest_and_lodgement_cpih_query_failure(self, mock_connect):
        """Test error handling when query execution fails"""

        # Mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate query failure
        mock_cursor.execute.side_effect = Exception("Query execution failed")

        # Call the function
        result = propertyRepo.get_latest_and_lodgement_cpih('2023-12-15')

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()
        
if __name__ == '__main__':
    unittest.main()