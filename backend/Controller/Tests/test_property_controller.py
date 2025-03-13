import json
import unittest
from unittest import mock
from unittest.mock import patch
from flask import Flask
from Controller.propertyController import property_blueprint
import pandas as pd

class TestPropertyController(unittest.TestCase):
    def setUp(self):
        """Set up a test Flask app with the property blueprint"""
        self.app = Flask(__name__)
        self.app.register_blueprint(property_blueprint)
        self.client = self.app.test_client()

    @patch("Service.propertyService.update_properties")
    def test_update_properties_route_success(self, mock_update_properties):
        """Test updateDB route when properties update is successful"""
        mock_update_properties.return_value = True

        response = self.client.get("/property/updateDB")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"success": True})

    @patch("Service.propertyService.update_properties")
    def test_update_properties_route_failure(self, mock_update_properties):
        """Test updateDB route when properties update fails"""
        mock_update_properties.return_value = False

        response = self.client.get("/property/updateDB")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"success": False})  # Now the expected format matches the fix
        
    @patch("Service.propertyService.fetch_cpih_data")
    def test_update_inflation_data_route_success(self, mock_fetch_cpih_data):
        """Test inflationDB route when inflation data update is successful"""
        mock_fetch_cpih_data.return_value = True

        response = self.client.get("/property/inflationDB")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"success": True})

    @patch("Service.propertyService.fetch_cpih_data")
    def test_update_inflation_data_route_failure(self, mock_fetch_cpih_data):
        """Test inflationDB route when inflation data update fails"""
        mock_fetch_cpih_data.return_value = False

        response = self.client.get("/property/inflationDB")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"success": False})  # Now the expected format matches the fix
        
    @patch("Service.propertyService.get_top_rated_properties")
    def test_property_load_toprated_route_success(self, mock_get_top_rated_properties):
        """Test loadTopRated route when properties are successfully retrieved"""
        
        # Fake DataFrame of properties
        fake_data = pd.DataFrame([
            {"id": 1, "name": "Luxury Villa", "rating": 4.8},
            {"id": 2, "name": "Modern Apartment", "rating": 4.7},
        ])
        
        mock_get_top_rated_properties.return_value = fake_data

        response = self.client.get("/property/loadTopRated")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, fake_data.to_dict(orient="records"))

    @patch("Service.propertyService.get_top_rated_properties")
    def test_property_load_toprated_route_empty(self, mock_get_top_rated_properties):
        """Test loadTopRated route when no properties are available"""
        
        # Empty DataFrame case
        mock_get_top_rated_properties.return_value = pd.DataFrame()

        response = self.client.get("/property/loadTopRated")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])  # Expect an empty list
        
    @patch("Service.propertyService.get_property_info")
    def test_get_property_info_route_success(self, mock_get_property_info):
        """Test getInfo route when property info is found"""
        
        # Fake DataFrame with property details
        fake_data = pd.DataFrame([
            {"uprn": "123456", "address": "10 Downing St", "price": 1000000}
        ])
        
        mock_get_property_info.return_value = fake_data

        response = self.client.get("/property/getInfo?uprn=123456")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, fake_data.to_dict(orient="records"))

    @patch("Service.propertyService.get_property_info")
    def test_get_property_info_route_no_results(self, mock_get_property_info):
        """Test getInfo route when no property is found"""
        
        # Empty DataFrame case
        mock_get_property_info.return_value = pd.DataFrame()

        response = self.client.get("/property/getInfo?uprn=999999")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])  # Expect an empty list

    @patch("Service.propertyService.get_property_info")
    def test_get_property_info_route_missing_uprn(self, mock_get_property_info):
        """Test getInfo route when no UPRN is provided in request"""
        
        # Empty DataFrame case (same as when no property found)
        mock_get_property_info.return_value = pd.DataFrame()

        response = self.client.get("/property/getInfo")  # No uprn in query
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])  # Expect an empty list
        
    @patch("Service.propertyService.return_properties")
    def test_get_properties_page_route_success(self, mock_return_properties):
        """Test getPage route when valid properties are found"""
        
        # Fake DataFrame with property data
        fake_data = pd.DataFrame([
            {"id": 1, "address": "10 Downing St", "price": 1000000},
            {"id": 2, "address": "221B Baker St", "price": 800000}
        ])
        mock_return_properties.return_value = fake_data

        response = self.client.get("/property/getPage?pt=House&epc=A&page=1&sort_by=current_energy_rating&order=desc")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, fake_data.to_dict(orient="records"))

    @patch("Service.propertyService.return_properties")
    def test_get_properties_page_route_invalid_input(self, mock_return_properties):
        """Test getPage route when invalid query parameters are provided"""
        
        response = self.client.get("/property/getPage?min_bedrooms=invalid&page=NaN")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid numeric input", response.json["error"])

    @patch("Service.propertyService.return_properties")
    def test_get_properties_page_route_internal_error(self, mock_return_properties):
        """Test getPage route when service layer throws an unexpected error"""

        # Simulate an exception from the service
        mock_return_properties.side_effect = Exception("Database connection failed")

        response = self.client.get("/property/getPage?pt=House&epc=A&page=1")
        self.assertEqual(response.status_code, 500)
        self.assertIn("Database connection failed", response.json["error"])
        
    @patch("Service.propertyService.compare_properties")
    def test_compare_properties_route_success(self, mock_compare_properties):
        """Test /property/compare when valid UPRNs are provided"""

        # Fake DataFrame with comparison data
        fake_comparison_data = pd.DataFrame([
            {"uprn": "123456", "address": "10 Downing St", "energy_rating": "A"},
            {"uprn": "654321", "address": "221B Baker St", "energy_rating": "B"},
        ])
        mock_compare_properties.return_value = fake_comparison_data

        # Send POST request with valid UPRNs
        response = self.client.post(
            "/property/compare",
            data=json.dumps({"uprns": ["123456", "654321"]}),
            content_type="application/json",
        )

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, fake_comparison_data.to_dict(orient="records"))

    def test_compare_properties_route_invalid_uprns(self):
        """Test /property/compare when invalid UPRN list is provided"""

        # Case 1: Less than 2 UPRNs
        response = self.client.post(
            "/property/compare",
            data=json.dumps({"uprns": ["123456"]}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("You must select between 2 and 4 properties", response.json["error"])

        # Case 2: More than 4 UPRNs
        response = self.client.post(
            "/property/compare",
            data=json.dumps({"uprns": ["123", "456", "789", "101112", "131415"]}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("You must select between 2 and 4 properties", response.json["error"])

    @patch("Service.propertyService.compare_properties")
    def test_compare_properties_route_internal_error(self, mock_compare_properties):
        """Test /property/compare when service layer throws an unexpected error"""

        # Simulate an exception from the service
        mock_compare_properties.side_effect = Exception("Database error")

        response = self.client.post(
            "/property/compare",
            data=json.dumps({"uprns": ["123456", "654321"]}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 500)
        self.assertIn("Database error", response.json["error"])
        
    @patch("Service.propertyService.get_properties_from_area")
    def test_get_graph_data_route_success(self, mock_get_properties):
        """Test /property/graph when valid postcode and bedroom count are provided"""

        # Fake DataFrame with property data
        fake_property_data = pd.DataFrame([
            {"postcode": "AB1 2CD", "number_bedrooms": 3, "price": 250000},
            {"postcode": "AB1 2CD", "number_bedrooms": 3, "price": 260000},
        ])
        mock_get_properties.return_value = fake_property_data

        # Send GET request with valid parameters
        response = self.client.get("/property/graph?postcode=AB1%202CD&num_bedrooms=3")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, fake_property_data.to_dict(orient="records"))

    def test_get_graph_data_route_invalid_num_bedrooms(self):
        """Test /property/graph when `num_bedrooms` is missing or invalid"""

        # Case 1: Missing `num_bedrooms`
        response = self.client.get("/property/graph?postcode=AB1%202CD")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid or missing 'num_bedrooms' parameter", response.json["error"])

        # Case 2: Invalid `num_bedrooms` (non-numeric value)
        response = self.client.get("/property/graph?postcode=AB1%202CD&num_bedrooms=abc")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid or missing 'num_bedrooms' parameter", response.json["error"])

        # Case 3: Valid `num_bedrooms`
        response = self.client.get("/property/graph?postcode=AB1%202CD&num_bedrooms=3")
        self.assertEqual(response.status_code, 200)  # Should pass with correct parameters

    @patch("Service.propertyService.get_properties_from_area")
    def test_get_graph_data_route_internal_error(self, mock_get_properties):
        """Test /property/graph when service layer throws an unexpected error"""

        # Simulate an exception from the service
        mock_get_properties.side_effect = Exception("Database error")

        response = self.client.get("/property/graph?postcode=AB1%202CD&num_bedrooms=3")
        self.assertEqual(response.status_code, 500)
        self.assertIn("Database error", response.json["error"])
        
    @patch("Service.propertyService.return_properties")
    def test_controller_prevents_sql_injection(self, mock_service):
        """Ensure controller does not allow SQL injection-like input"""

        malicious_input = "'; DROP TABLE properties; --"

        response = self.client.get(f"/property/getPage?search={malicious_input}")

        # Ensure request was blocked at the controller level
        self.assertEqual(response.status_code, 400)  
        self.assertIn("Invalid search input", response.json["error"])

        # Ensure service was NEVER called
        mock_service.assert_not_called()

        
    @patch("Service.propertyService.return_properties")
    def test_controller_handles_special_characters(self, mock_service):
        """Ensure controller handles special characters in search input"""

        special_input = "!@#$%^&*()_+{}|:\"<>?"  # Invalid characters

        response = self.client.get(f"/property/getPage?search={special_input}")

        # Ensure the controller rejects unsafe input
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid search input", response.json["error"])

        # Ensure service was NEVER called
        mock_service.assert_not_called()

    @patch("Service.propertyService.return_properties")
    def test_controller_rejects_excessively_long_input(self, mock_service):
        """Ensure controller rejects excessively long search inputs with a 400 error"""

        MAX_SEARCH_LENGTH = 255
        long_input = "A" * (MAX_SEARCH_LENGTH + 1)  # 256 characters (exceeding limit)

        response = self.client.get(f"/property/getPage?search={long_input}")

        # Ensure request is **rejected** (400 Bad Request)
        self.assertEqual(response.status_code, 400)

        # Ensure proper error message is returned
        self.assertIn("Search input exceeds maximum length", response.json["error"])

        # Ensure the service method **is never called** (request should be blocked at controller level)
        mock_service.assert_not_called()
        
    @patch("Service.propertyService.return_properties")
    def test_controller_rejects_invalid_data_types(self, mock_service):
        """Ensure controller properly handles invalid data types"""

        invalid_inputs = [
            ("page", "abc"),  # Should be an integer
            ("min_bedrooms", "xyz"),  # Should be an integer
            ("max_bedrooms", "NaN"),  # Should be an integer
        ]

        for param, value in invalid_inputs:
            with self.subTest(param=param, value=value):
                response = self.client.get(f"/property/getPage?{param}={value}")

                self.assertEqual(response.status_code, 400)  # Should return a 400 Bad Request
                self.assertIn("Invalid numeric input", response.json["error"])
                
    @patch("Service.propertyService.return_properties")
    def test_controller_handles_service_failure(self, mock_service):
        """Ensure controller properly handles service errors"""

        mock_service.side_effect = Exception("Unexpected service error")

        response = self.client.get("/property/getPage?search=valid")

        self.assertEqual(response.status_code, 500)  # Should return a 500 Internal Server Error
        self.assertIn("error", response.json)  # Error message should be generic

if __name__ == "__main__":
    unittest.main()
