import unittest
from unittest.mock import patch, MagicMock
import json
import pandas as pd
import sys
import os
# Add the parent directory (backend/Service) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import propertyService

class TestUpdateProperties(unittest.TestCase):

    @patch("propertyService.urllib.request.urlopen")
    @patch("propertyService.repo.update_properties_in_db")
    def test_update_properties_success(self, mock_update_db, mock_urlopen):
        # Mock API Response
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps({
            "rows": [
                {
                    "uprn": "100012345678",
                    "address": "123 Test Street",
                    "postcode": "AB12 3CD",
                    "property-type": "Flat",
                    "lodgement-datetime": "2024-01-01T12:00:00",
                    "current-energy-efficiency": "80",
                    "current-energy-rating": "B",
                    "heating-cost-current": "500",
                    "hot-water-cost-current": "100",
                    "lighting-cost-current": "50",
                    "total-floor-area": "75",
                    "number-habitable-rooms": "3",
                    "energy-consumption-current": "250",
                    "local-authority": "E08000035"
                }
            ]
        }).encode()
        mock_response.getheader.return_value = None  # No pagination
        
        mock_urlopen.return_value.__enter__.return_value = mock_response
        mock_update_db.return_value = True  # Mock DB update success

        # Call function
        result = propertyService.update_properties()

        # Assertions
        self.assertTrue(result)
        mock_urlopen.assert_called()  # API was called
        mock_update_db.assert_called_once()  # DB update called once

        # Verify the DataFrame passed to update_properties_in_db
        df_passed_to_db = mock_update_db.call_args[0][0]  # Extract DataFrame
        self.assertIsInstance(df_passed_to_db, pd.DataFrame)
        self.assertEqual(len(df_passed_to_db), 1)  # Only one record processed

        # Check column transformations
        self.assertIn("property_type", df_passed_to_db.columns)  # Renamed column
        self.assertIn("lodgement_datetime", df_passed_to_db.columns)  # Converted datetime

    @patch("propertyService.urllib.request.urlopen")
    @patch("propertyService.repo.update_properties_in_db")
    def test_update_properties_api_failure(self, mock_update_db, mock_urlopen):
        """Test API failure handling"""
        mock_urlopen.side_effect = Exception("API Error")
        mock_update_db.return_value = True

        result = propertyService.update_properties()

        self.assertFalse(result)  # Should return False due to API failure
        mock_update_db.assert_not_called()  # Database should not be updated

    @patch("propertyService.urllib.request.urlopen")
    @patch("propertyService.repo.update_properties_in_db")
    def test_update_properties_empty_response(self, mock_update_db, mock_urlopen):
        """Test handling of an empty API response"""
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps({"rows": []}).encode()
        mock_response.getheader.return_value = None

        mock_urlopen.return_value.__enter__.return_value = mock_response
        mock_update_db.return_value = True

        result = propertyService.update_properties()

        self.assertFalse(result)  # Should return False when no data is retrieved
        mock_update_db.assert_not_called()  # Database should not be updated

if __name__ == "__main__":
    unittest.main()
