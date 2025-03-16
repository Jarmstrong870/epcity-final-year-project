import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from Service import favouriteService

class TestFavouriteService(unittest.TestCase):
    @patch("Service.favouriteService.repo.get_favourite_properties_from_db")
    def test_get_favourite_properties_success(self, mock_get_favourites):
        """Test successful retrieval of favourite properties"""

        # Mocked favourite properties
        fake_data = pd.DataFrame({
            "uprn": [123456, 654321],
            "address": ["10 Downing St", "221B Baker St"],
            "postcode": ["SW1A 2AA", "NW1 6XE"]
        })

        # Set up mock return value
        mock_get_favourites.return_value = fake_data

        # Call function
        result = favouriteService.get_favourite_properties("test@example.com")

        # Assertions
        pd.testing.assert_frame_equal(result, fake_data)
        mock_get_favourites.assert_called_once_with("test@example.com")

    @patch("Service.favouriteService.repo.get_favourite_properties_from_db")
    def test_get_favourite_properties_no_results(self, mock_get_favourites):
        """Test when no favourite properties are found"""

        # Mock an empty DataFrame
        mock_get_favourites.return_value = pd.DataFrame(columns=["uprn", "address", "postcode"])

        # Call function
        result = favouriteService.get_favourite_properties("test@example.com")

        # Expected empty DataFrame
        expected_output = pd.DataFrame(columns=["uprn", "address", "postcode"])

        # Assertions
        pd.testing.assert_frame_equal(result, expected_output)
        mock_get_favourites.assert_called_once_with("test@example.com")
        
    @patch("Service.favouriteService.repo.add_favourite_to_db")
    def test_add_favourite_property_success(self, mock_add_favourite):
        """Test successful addition of a favourite property"""

        # Mock repository response
        mock_add_favourite.return_value = True

        # Call function
        result = favouriteService.add_favourite_property("test@example.com", 123456)

        # Assertions
        assert result is True
        mock_add_favourite.assert_called_once_with("test@example.com", 123456)

    @patch("Service.favouriteService.repo.add_favourite_to_db")
    def test_add_favourite_property_failure(self, mock_add_favourite):
        """Test failure when adding a favourite property"""

        # Mock repository response
        mock_add_favourite.return_value = False

        # Call function
        result = favouriteService.add_favourite_property("test@example.com", 123456)

        # Assertions
        assert result is False
        mock_add_favourite.assert_called_once_with("test@example.com", 123456)
        
    @patch("Service.favouriteService.repo.remove_favourite_from_db")
    def test_remove_favourite_property_success(self, mock_remove_favourite):
        """Test successful removal of a favourite property"""

        # Mock repository response
        mock_remove_favourite.return_value = True

        # Call function
        result = favouriteService.remove_favourite_property("test@example.com", 123456)

        # Assertions
        assert result is True
        mock_remove_favourite.assert_called_once_with("test@example.com", 123456)

    @patch("Service.favouriteService.repo.remove_favourite_from_db")
    def test_remove_favourite_property_failure(self, mock_remove_favourite):
        """Test failure when removing a favourite property"""

        # Mock repository response
        mock_remove_favourite.return_value = False

        # Call function
        result = favouriteService.remove_favourite_property("test@example.com", 123456)

        # Assertions
        assert result is False
        mock_remove_favourite.assert_called_once_with("test@example.com", 123456)

if __name__ == '__main__':
    unittest.main()