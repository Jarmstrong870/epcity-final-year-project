import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from flask import Flask
from Controller.favouriteController import favourites_blueprint

class TestFavouriteController(unittest.TestCase):

    def setUp(self):
        """Set up the Flask test client"""
        app = Flask(__name__)
        app.register_blueprint(favourites_blueprint)
        self.client = app.test_client()

    @patch("Service.favouriteService.get_favourite_properties")
    def test_get_favourites_success(self, mock_get_favourite_properties):
        """Test /favourites/getFavourites returns favourite properties successfully"""

        # Fake favourite properties
        fake_data = pd.DataFrame([
            {"uprn": 123456, "address": "10 Downing St", "postcode": "SW1A 2AA"},
            {"uprn": 654321, "address": "221B Baker St", "postcode": "NW1 6XE"}
        ])
        mock_get_favourite_properties.return_value = fake_data

        # Call API
        response = self.client.get("/favourites/getFavourites?email=test@example.com")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, fake_data.to_dict(orient='records'))

        # Verify service was called with the correct email
        mock_get_favourite_properties.assert_called_once_with("test@example.com")

    @patch("Service.favouriteService.get_favourite_properties")
    def test_get_favourites_no_results(self, mock_get_favourite_properties):
        """Test /favourites/getFavourites when no favourites exist"""

        mock_get_favourite_properties.return_value = pd.DataFrame()

        # Call API
        response = self.client.get("/favourites/getFavourites?email=test@example.com")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])

    @patch("Service.favouriteService.get_favourite_properties")
    def test_get_favourites_missing_email(self, mock_get_favourite_properties):
        """Test /favourites/getFavourites with missing email"""

        mock_get_favourite_properties.return_value = pd.DataFrame()

        # Call API without email
        response = self.client.get("/favourites/getFavourites")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])

    @patch("Service.favouriteService.get_favourite_properties")
    def test_get_favourites_invalid_service_response(self, mock_get_favourite_properties):
        """Test /favourites/getFavourites when service returns an unexpected type"""

        mock_get_favourite_properties.return_value = None  # Invalid response

        # Call API
        response = self.client.get("/favourites/getFavourites?email=test@example.com")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])  # Should return an empty list
        
    @patch("Service.favouriteService.add_favourite_property")
    def test_add_favourite_success(self, mock_add_favourite_property):
        """Test /favourites/addFavourite when the property is successfully added"""

        mock_add_favourite_property.return_value = True

        # Call API
        response = self.client.get("/favourites/addFavourite?email=test@example.com&uprn=123456")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, True)

        # Ensure service was called with correct parameters
        mock_add_favourite_property.assert_called_once_with("test@example.com", "123456")

    @patch("Service.favouriteService.add_favourite_property")
    def test_add_favourite_failure(self, mock_add_favourite_property):
        """Test /favourites/addFavourite when the property could not be added"""

        mock_add_favourite_property.return_value = False

        # Call API
        response = self.client.get("/favourites/addFavourite?email=test@example.com&uprn=123456")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)

    @patch("Service.favouriteService.add_favourite_property")
    def test_add_favourite_missing_parameters(self, mock_add_favourite_property):
        """Test /favourites/addFavourite with missing email or UPRN"""

        # Missing email
        response = self.client.get("/favourites/addFavourite?uprn=123456")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)

        # Missing uprn
        response = self.client.get("/favourites/addFavourite?email=test@example.com")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)

    @patch("Service.favouriteService.add_favourite_property")
    def test_add_favourite_invalid_service_response(self, mock_add_favourite_property):
        """Test /favourites/addFavourite when service returns an unexpected value"""

        mock_add_favourite_property.return_value = None  # Invalid response

        # Call API
        response = self.client.get("/favourites/addFavourite?email=test@example.com&uprn=123456")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)
        
    @patch("Service.favouriteService.remove_favourite_property")
    def test_remove_favourite_success(self, mock_remove_favourite_property):
        """Test /favourites/removeFavourite when the property is successfully removed"""

        mock_remove_favourite_property.return_value = True

        # Call API
        response = self.client.get("/favourites/removeFavourite?email=test@example.com&uprn=123456")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, True)

        # Ensure service was called with correct parameters
        mock_remove_favourite_property.assert_called_once_with("test@example.com", "123456")

    @patch("Service.favouriteService.remove_favourite_property")
    def test_remove_favourite_failure(self, mock_remove_favourite_property):
        """Test /favourites/removeFavourite when the property could not be removed"""

        mock_remove_favourite_property.return_value = False

        # Call API
        response = self.client.get("/favourites/removeFavourite?email=test@example.com&uprn=123456")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)

    @patch("Service.favouriteService.remove_favourite_property")
    def test_remove_favourite_missing_parameters(self, mock_remove_favourite_property):
        """Test /favourites/removeFavourite with missing email or UPRN"""

        # Missing email
        response = self.client.get("/favourites/removeFavourite?uprn=123456")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)

        # Missing uprn
        response = self.client.get("/favourites/removeFavourite?email=test@example.com")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)

    @patch("Service.favouriteService.remove_favourite_property")
    def test_remove_favourite_invalid_service_response(self, mock_remove_favourite_property):
        """Test /favourites/removeFavourite when service returns an unexpected value"""

        mock_remove_favourite_property.return_value = None  # Invalid response

        # Call API
        response = self.client.get("/favourites/removeFavourite?email=test@example.com&uprn=123456")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, False)

if __name__ == '__main__':
    unittest.main()
