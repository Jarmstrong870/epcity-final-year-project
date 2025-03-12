import unittest
from unittest.mock import patch, MagicMock
import json
import pandas as pd
from Service import propertyService

class TestPropertyService(unittest.TestCase):

    @patch("Service.propertyService.urllib.request.urlopen")  # Mock external API call
    @patch("Service.propertyService.repo.update_properties_in_db")  # Mock DB update function
    def test_update_properties_success(self, mock_update_db, mock_urlopen):
        """Test successful update of properties when API returns valid data"""

        # Simulate API response with valid JSON data
        fake_api_response = {
            "rows": [
                {
                    "uprn": "123456",
                    "address": "123 Fake St",
                    "postcode": "AB1 2CD",
                    "property-type": "House",
                    "lodgement-datetime": "2024-01-01",
                    "current-energy-efficiency": 75,
                    "current-energy-rating": "C",
                    "heating-cost-current": 100,
                    "hot-water-cost-current": 50,
                    "lighting-cost-current": 20,
                    "total-floor-area": 100.0,
                    "number-habitable-rooms": 3,
                    "energy-consumption-current": 250,
                    "local-authority": "E08000035"
                }
            ]
        }
        fake_api_response_json = json.dumps(fake_api_response).encode("utf-8")

        # Mock urllib.request.urlopen to return the fake response
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_api_response_json
        mock_urlopen.return_value.__enter__.return_value.getheader.return_value = None  # No pagination

        # Mock DB update function to return True
        mock_update_db.return_value = True

        # Call function
        result = propertyService.update_properties()

        # Assertions
        self.assertTrue(result)  # Function should return True
        # Ensure that update_properties_in_db was called at least once
        self.assertGreaterEqual(mock_update_db.call_count, 1)

        # Verify the expected number of calls
        expected_calls = 9  # Adjust this based on the expected number of authorities
        self.assertEqual(mock_update_db.call_count, expected_calls)
        
    @patch("Service.propertyService.urllib.request.urlopen")
    def test_update_properties_api_failure(self, mock_urlopen):
        """Test API failure (e.g., network error)"""

        # Simulate an exception when making API request
        mock_urlopen.side_effect = Exception("API request failed")

        # Call function
        result = propertyService.update_properties()

        # Assertions
        self.assertFalse(result)  # Should return False on API failure

    @patch("Service.propertyService.urllib.request.urlopen")
    def test_update_properties_empty_api_response(self, mock_urlopen):
        """Test case when API returns no property data"""

        # Simulate an API response with an empty "rows" list
        fake_api_response_json = json.dumps({"rows": []}).encode("utf-8")
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_api_response_json
        mock_urlopen.return_value.__enter__.return_value.getheader.return_value = None  # No pagination

        # Call function
        result = propertyService.update_properties()

        # Assertions
        self.assertFalse(result)  # Should return False when API has no data

    @patch("Service.propertyService.urllib.request.urlopen")
    @patch("Service.propertyService.repo.update_properties_in_db")
    def test_update_properties_partial_failure(self, mock_update_db, mock_urlopen):
        """Test rollback when database update fails"""

        # Simulate API response with valid data
        fake_api_response = {
            "rows": [
                {
                    "uprn": "123456",
                    "address": "123 Fake St",
                    "postcode": "AB1 2CD",
                    "property-type": "House",
                    "lodgement-datetime": "2024-01-01",
                    "current-energy-efficiency": 75,
                    "current-energy-rating": "C",
                    "heating-cost-current": 100,
                    "hot-water-cost-current": 50,
                    "lighting-cost-current": 20,
                    "total-floor-area": 100.0,
                    "number-habitable-rooms": 3,
                    "energy-consumption-current": 250,
                    "local-authority": "E08000035"
                }
            ]
        }
        fake_api_response_json = json.dumps(fake_api_response).encode("utf-8")

        # Mock urllib.request.urlopen to return the fake response
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_api_response_json
        mock_urlopen.return_value.__enter__.return_value.getheader.return_value = None  # No pagination

        # Mock DB update function to return False (simulating failure)
        mock_update_db.return_value = False

        # Call function
        result = propertyService.update_properties()

        # Assertions
        self.assertFalse(result)  # Should return False on DB failure
        mock_update_db.assert_called_once()  # Ensure DB update was attempted
        
    @patch("Service.propertyService.repo.get_top_rated_from_db")  # Mock DB function
    def test_get_top_rated_properties_success(self, mock_get_top_rated):
        """Test successful retrieval of top 6 rated properties"""

        # Fake property data
        fake_data = pd.DataFrame({
            "id": [1, 2, 3, 4, 5, 6],
            "name": ["House A", "House B", "House C", "House D", "House E", "House F"],
            "current_energy_efficiency": [95, 92, 90, 88, 87, 85]
        })

        # Mock return value from repository
        mock_get_top_rated.return_value = fake_data

        # Call function
        result = propertyService.get_top_rated_properties()

        # Assertions
        pd.testing.assert_frame_equal(result, fake_data)  # Ensure DataFrame matches expected output
        mock_get_top_rated.assert_called_once()  # Ensure repo method was called

    @patch("Service.propertyService.repo.get_top_rated_from_db")
    def test_get_top_rated_properties_empty(self, mock_get_top_rated):
        """Test function when no properties exist in the database"""

        # Mock empty DataFrame response
        mock_get_top_rated.return_value = pd.DataFrame()

        # Call function
        result = propertyService.get_top_rated_properties()

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame
        mock_get_top_rated.assert_called_once()  # Ensure repo method was called
        
    @patch("Service.propertyService.repo.get_data_from_db")  # Mock DB function
    def test_return_properties_success(self, mock_get_data):
        """Test successful retrieval of properties with default parameters"""

        # Fake property data
        fake_data = pd.DataFrame({
            "id": [1, 2, 3],
            "address": ["123 Fake St", "456 Real Rd", "789 Test Ave"],
            "postcode": ["AB1 2CD", "EF3 4GH", "XY5 6ZW"],
            "property_type": ["House", "Apartment", "Flat"],
            "current_energy_rating": ["A", "B", "C"],
            "number_bedrooms": [3, 2, 1]
        })

        # Mock return value from repository
        mock_get_data.return_value = fake_data

        # Call function
        result = propertyService.return_properties()

        # Assertions
        pd.testing.assert_frame_equal(result, fake_data)  # Ensure DataFrame matches expected output
        mock_get_data.assert_called_once()  # Ensure repo method was called

    @patch("Service.propertyService.repo.get_data_from_db")
    def test_return_properties_filtered(self, mock_get_data):
        """Test retrieval of properties with specific filters"""

        # Fake filtered property data
        fake_filtered_data = pd.DataFrame({
            "id": [4, 5],
            "address": ["111 Green St", "222 Blue Rd"],
            "postcode": ["ZZ1 2XY", "YY3 4WX"],
            "property_type": ["House", "House"],
            "current_energy_rating": ["A", "A"],
            "number_bedrooms": [3, 4]
        })

        # Mock return value
        mock_get_data.return_value = fake_filtered_data

        # Call function with specific filters
        result = propertyService.return_properties(
            property_types=["House"], 
            energy_ratings=["A"], 
            min_bedrooms=3, 
            max_bedrooms=5, 
            sort_by="current_energy_rating", 
            order="desc", 
            page=2, 
            local_authority="E08000035"
        )

        # Assertions
        pd.testing.assert_frame_equal(result, fake_filtered_data)
        mock_get_data.assert_called_once_with(
            ["House"], 
            ["A"], 
            None, 
            3, 
            5, 
            "current_energy_rating", 
            "desc", 
            2, 
            "E08000035"
)

    @patch("Service.propertyService.repo.get_data_from_db")
    def test_return_properties_empty(self, mock_get_data):
        """Test function when no properties exist in the database"""

        # Mock empty DataFrame response
        mock_get_data.return_value = pd.DataFrame()

        # Call function
        result = propertyService.return_properties()

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame
        mock_get_data.assert_called_once()  # Ensure repo method was called
        
    @patch("Service.propertyService.urllib.request.urlopen")  # Mock external API call
    @patch("Service.propertyService.calculate_inflation_rate")  # Mock inflation rate function
    @patch("Service.propertyService.adjust_cost")  # Mock cost adjustment function
    def test_get_property_info_success(self, mock_adjust_cost, mock_inflation_rate, mock_urlopen):
        """Test successful retrieval and processing of property information"""

        # Fake API response JSON
        fake_api_response = {
            "rows": [
                {
                    "uprn": "123456",
                    "address": "123 Fake St",
                    "postcode": "AB1 2CD",
                    "property-type": "House",
                    "lodgement-datetime": "2024-01-01",
                    "current-energy-efficiency": 75,
                    "current-energy-rating": "C",
                    "heating-cost-current": 100,
                    "hot-water-cost-current": 50,
                    "lighting-cost-current": 20,
                    "total-floor-area": 100.0,
                    "number-habitable-rooms": 3,
                    "energy-consumption-current": 250
                }
            ]
        }
        fake_api_response_json = json.dumps(fake_api_response).encode("utf-8")

        # Mock urllib.request.urlopen to return the fake response
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_api_response_json

        # Mock inflation rate function
        mock_inflation_rate.return_value = 1.02  # 2% inflation

        # Mock cost adjustment function
        mock_adjust_cost.side_effect = lambda x, _: x * 1.02  # Simulate a 2% increase

        # Expected processed DataFrame
        expected_df = pd.DataFrame({
            "uprn": [123456],
            "address": ["123 Fake St"],
            "postcode": ["AB1 2CD"],
            "property_type": ["House"],
            "lodgement_datetime": [pd.to_datetime("2024-01-01").date()],
            "current_energy_efficiency": [75],
            "current_energy_rating": ["C"],
            "heating_cost_current": [102],  # Adjusted for inflation
            "hot_water_cost_current": [51],  # Adjusted for inflation
            "lighting_cost_current": [20.4],  # Adjusted for inflation
            "total_floor_area": [100.0],
            "number_habitable_rooms": [3],
            "energy_consumption_current": [250],
            "number_bedrooms": [2],  # Adjusted from habitable rooms
            "energy_consumption_cost": [250 * ((0.2542 * 0.2) + (0.0699 * 0.8)) * 100.0],  # Computed cost
        })

        # Call function
        result = propertyService.get_property_info("123456")

        # Assertions
        pd.testing.assert_frame_equal(result[expected_df.columns], expected_df, check_dtype=False)
        mock_urlopen.assert_called_once()  # Ensure API request was made
        mock_inflation_rate.assert_called_once()  # Ensure inflation rate was retrieved
        mock_adjust_cost.assert_called()  # Ensure cost adjustments were applied

    @patch("Service.propertyService.urllib.request.urlopen")
    def test_get_property_info_api_failure(self, mock_urlopen):
        """Test API failure (e.g., network error)"""

        # Simulate an exception when making API request
        mock_urlopen.side_effect = Exception("API request failed")

        # Call function
        result = propertyService.get_property_info("123456")

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame

    @patch("Service.propertyService.urllib.request.urlopen")
    def test_get_property_info_empty_response(self, mock_urlopen):
        """Test case when API returns no data"""

        # Simulate an API response with an empty "rows" list
        fake_api_response_json = json.dumps({"rows": []}).encode("utf-8")
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_api_response_json

        # Call function
        result = propertyService.get_property_info("123456")

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame

    @patch("Service.propertyService.urllib.request.urlopen")
    @patch("Service.propertyService.calculate_inflation_rate")
    def test_get_property_info_no_inflation(self, mock_inflation_rate, mock_urlopen):
        """Test behavior when inflation data is unavailable"""

        # Fake API response JSON
        fake_api_response = {
            "rows": [
                {
                    "uprn": "123456",
                    "lodgement-datetime": "2024-01-01",
                    "heating-cost-current": 100,
                    "hot-water-cost-current": 50,
                    "lighting-cost-current": 20,
                }
            ]
        }
        fake_api_response_json = json.dumps(fake_api_response).encode("utf-8")

        # Mock urllib.request.urlopen to return the fake response
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_api_response_json

        # Mock inflation rate function to return None (API failure)
        mock_inflation_rate.return_value = None

        # Call function
        result = propertyService.get_property_info("123456")

        # Assertions
        self.assertEqual(result["heating_cost_current"].iloc[0], 100)  # Cost remains unchanged
        self.assertEqual(result["hot_water_cost_current"].iloc[0], 50)
        self.assertEqual(result["lighting_cost_current"].iloc[0], 20)
        
    @patch("Service.propertyService.urllib.request.urlopen")  # Mock external CSV fetch
    @patch("Service.propertyService.repo.update_inflation_data_in_db")  # Mock DB update function
    def test_fetch_cpih_data_success(self, mock_update_db, mock_urlopen):
        """Test successful fetching and processing of CPIH data"""

        # Fake CSV data (matching ONS format)
        fake_csv_data = """Time,Aggregate,v4_0
Mar-24,04.1 Actual rentals for housing,120.5
Feb-24,04.1 Actual rentals for housing,119.8
Jan-24,04.1 Actual rentals for housing,118.7
"""

        # Mock urllib.request.urlopen to return fake CSV data
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_csv_data.encode("utf-8")  # Convert string to bytes

        # Expected processed DataFrame
        expected_df = pd.DataFrame({
            "date": pd.to_datetime(["2024-03-01", "2024-02-01", "2024-01-01"]),
            "cpih_value": [120.5, 119.8, 118.7]
            }).sort_values(by="date", ascending=False)

        # Mock DB update function to return True
        mock_update_db.return_value = True

        # Call function
        result = propertyService.fetch_cpih_data()

        # Assertions
        self.assertTrue(result)  # Should return True on success
        mock_update_db.assert_called_once()  # Ensure DB update was called

        # Verify DataFrame transformation (mocking prevents checking exact call argument)
        called_df = mock_update_db.call_args[0][0]
        pd.testing.assert_frame_equal(
            called_df.reset_index(drop=True),  # Ensure index alignment
            expected_df.reset_index(drop=True),
            check_dtype=False  # Ignore small dtype mismatches
        )

    @patch("Service.propertyService.urllib.request.urlopen")
    def test_fetch_cpih_data_api_failure(self, mock_urlopen):
        """Test API failure (e.g., network error)"""

        # Simulate an exception when making API request
        mock_urlopen.side_effect = Exception("CSV request failed")

        # Call function
        result = propertyService.fetch_cpih_data()

        # Assertions
        self.assertFalse(result)  # Should return False on failure

    @patch("Service.propertyService.urllib.request.urlopen")
    @patch("Service.propertyService.repo.update_inflation_data_in_db")
    def test_fetch_cpih_data_empty_response(self, mock_update_db, mock_urlopen):
        """Test case when API returns an empty CSV"""

        # Simulate an empty CSV response
        fake_csv_data = "Time,Aggregate,v4_0\n"
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_csv_data

        # Call function
        result = propertyService.fetch_cpih_data()

        # Assertions
        self.assertFalse(result)  # Should return False due to missing data
        mock_update_db.assert_not_called()  # DB update should NOT be attempted

    @patch("Service.propertyService.urllib.request.urlopen")
    @patch("Service.propertyService.repo.update_inflation_data_in_db")
    def test_fetch_cpih_data_invalid_csv_format(self, mock_update_db, mock_urlopen):
        """Test behavior when the CSV format is incorrect"""

        # Fake CSV with missing columns
        fake_csv_data = "Time,WrongColumn,v4_0\nMar-24,Something,120.5\n"

        # Mock urllib.request.urlopen to return fake CSV data
        mock_urlopen.return_value.__enter__.return_value.read.return_value = fake_csv_data

        # Call function
        result = propertyService.fetch_cpih_data()

        # Assertions
        self.assertFalse(result)  # Should return False due to missing expected columns
        mock_update_db.assert_not_called()  # DB update should NOT be attempted
        
    @patch("Service.propertyService.get_property_info")  # Mock API call
    def test_compare_properties_success(self, mock_get_property_info):
        """Test comparing properties with multiple valid UPRNs"""

        # Fake property data for different UPRNs
        fake_data_1 = pd.DataFrame({
            "uprn": [123456],
            "address": ["123 Fake St"],
            "current_energy_rating": ["A"]
        })
        
        fake_data_2 = pd.DataFrame({
            "uprn": [654321],
            "address": ["456 Real Rd"],
            "current_energy_rating": ["B"]
        })

        # Mock return values for different UPRNs
        mock_get_property_info.side_effect = [fake_data_1, fake_data_2]

        # Call function with two UPRNs
        result = propertyService.compare_properties(["123456", "654321"])

        # Expected combined DataFrame
        expected_df = pd.concat([fake_data_1, fake_data_2], ignore_index=True)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_df, check_dtype=False)
        self.assertEqual(mock_get_property_info.call_count, 2)  # Ensure function was called twice

    @patch("Service.propertyService.get_property_info")
    def test_compare_properties_some_empty(self, mock_get_property_info):
        """Test comparing properties when some UPRNs return empty data"""

        # Fake data for first UPRN, empty for second
        fake_data = pd.DataFrame({
            "uprn": [123456],
            "address": ["123 Fake St"],
            "current_energy_rating": ["A"]
        })

        mock_get_property_info.side_effect = [fake_data, pd.DataFrame()]

        # Call function
        result = propertyService.compare_properties(["123456", "654321"])

        # Expected output (should only contain data for UPRN 123456)
        expected_df = fake_data

        # Assertions
        pd.testing.assert_frame_equal(result, expected_df, check_dtype=False)
        self.assertEqual(mock_get_property_info.call_count, 2)  # Ensure both UPRNs were checked

    @patch("Service.propertyService.get_property_info")
    def test_compare_properties_all_empty(self, mock_get_property_info):
        """Test comparing properties when all UPRNs return empty data"""

        # Mock return value as empty DataFrame for all UPRNs
        mock_get_property_info.return_value = pd.DataFrame()

        # Call function
        result = propertyService.compare_properties(["123456", "654321"])

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame
        self.assertEqual(mock_get_property_info.call_count, 2)  # Ensure both UPRNs were checked

    @patch("Service.propertyService.get_property_info")
    def test_compare_properties_empty_list(self, mock_get_property_info):
        """Test behavior when an empty list of UPRNs is provided"""

        # Call function with an empty list
        result = propertyService.compare_properties([])

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame
        mock_get_property_info.assert_not_called()  # Ensure function was never called
        
    @patch("Service.propertyService.repo.get_latest_and_lodgement_cpih")  # Mock DB function
    def test_calculate_inflation_rate_success(self, mock_get_cpih):
        """Test successful inflation rate calculation"""

        # Fake CPIH data
        fake_cpih_data = pd.DataFrame({
            "date": pd.to_datetime(["2024-03-01", "2023-03-01"]),
            "cpih_value": [120.0, 100.0]  # Latest = 120, Lodgement = 100
        })

        # Mock return value from repository
        mock_get_cpih.return_value = fake_cpih_data

        # Call function
        result = propertyService.calculate_inflation_rate("2023-03-01")

        # Expected inflation rate: ((120 - 100) / 100) * 100 = 20.0
        self.assertEqual(result, 20.0)

    @patch("Service.propertyService.repo.get_latest_and_lodgement_cpih")
    def test_calculate_inflation_rate_insufficient_data(self, mock_get_cpih):
        """Test when CPIH data is insufficient (less than 2 rows)"""

        # Fake CPIH data with only one row
        fake_cpih_data = pd.DataFrame({
            "date": pd.to_datetime(["2024-03-01"]),
            "cpih_value": [120.0]  # Only one CPIH value
        })

        mock_get_cpih.return_value = fake_cpih_data

        # Call function
        result = propertyService.calculate_inflation_rate("2023-03-01")

        # Assertions
        self.assertIsNone(result)  # Should return None due to insufficient data

    @patch("Service.propertyService.repo.get_latest_and_lodgement_cpih")
    def test_calculate_inflation_rate_nan_values(self, mock_get_cpih):
        """Test when CPIH values contain NaN"""

        # Fake CPIH data with NaN values
        fake_cpih_data = pd.DataFrame({
            "date": pd.to_datetime(["2024-03-01", "2023-03-01"]),
            "cpih_value": [None, 100.0]  # Latest CPIH is NaN
        })

        mock_get_cpih.return_value = fake_cpih_data

        # Call function
        result = propertyService.calculate_inflation_rate("2023-03-01")

        # Assertions
        self.assertIsNone(result)  # Should return None due to NaN values

    @patch("Service.propertyService.repo.get_latest_and_lodgement_cpih")
    def test_calculate_inflation_rate_zero_division(self, mock_get_cpih):
        """Test when lodgement CPIH value is zero (avoiding division by zero)"""

        # Fake CPIH data with a lodgement CPIH of 0
        fake_cpih_data = pd.DataFrame({
            "date": pd.to_datetime(["2024-03-01", "2023-03-01"]),
            "cpih_value": [120.0, 0]  # Lodgement CPIH is zero
        })

        mock_get_cpih.return_value = fake_cpih_data

        # Call function
        result = propertyService.calculate_inflation_rate("2023-03-01")

        # Assertions
        self.assertIsNone(result)  # Should return None due to zero CPIH value
        
    @patch("Service.propertyService.repo.get_area_data_from_db")  # Mock DB function
    @patch("Service.propertyService.calculate_inflation_rate")  # Mock inflation rate function
    @patch("Service.propertyService.adjust_cost")  # Mock cost adjustment function
    def test_get_properties_from_area_success(self, mock_adjust_cost, mock_inflation_rate, mock_get_data):
        """Test successful retrieval and adjustment of properties"""

        # Fake property data
        fake_data = pd.DataFrame({
            "postcode": ["AB1 2CD"],
            "number_bedrooms": [3],
            "lodgement_datetime": ["2023-01-01"],
            "hot_water_cost_current": [100],
            "heating_cost_current": [200],
            "lighting_cost_current": [50]
        })

        # Mock return value from repository
        mock_get_data.return_value = fake_data

        # Mock inflation rate function to return a 5% inflation
        mock_inflation_rate.return_value = 5.0

        # Mock cost adjustment function (increases by 5%)
        mock_adjust_cost.side_effect = lambda x, _: x * 1.05

        # Expected processed DataFrame
        expected_df = fake_data.copy()
        expected_df["lodgement_datetime"] = pd.to_datetime(expected_df["lodgement_datetime"]).dt.date
        expected_df["hot_water_cost_current"] *= 1.05
        expected_df["heating_cost_current"] *= 1.05
        expected_df["lighting_cost_current"] *= 1.05

        # Call function
        result = propertyService.get_properties_from_area("AB1 2CD", 3)

        # Assertions
        pd.testing.assert_frame_equal(result, expected_df, check_dtype=False)
        mock_get_data.assert_called_once_with("AB1 2CD", 3)
        mock_inflation_rate.assert_called_once()
        mock_adjust_cost.assert_called()

    @patch("Service.propertyService.repo.get_area_data_from_db")
    def test_get_properties_from_area_empty(self, mock_get_data):
        """Test when no properties are found"""
        expected_columns = ["postcode", "number_bedrooms", "lodgement_datetime",
                        "hot_water_cost_current", "heating_cost_current", "lighting_cost_current"]

        # Mock return value as empty DataFrame
        mock_get_data.return_value = pd.DataFrame(columns=expected_columns)

        # Call function
        result = propertyService.get_properties_from_area("AB1 2CD", 3)

        # Assertions
        self.assertTrue(result.empty)  # Should return an empty DataFrame
        mock_get_data.assert_called_once_with("AB1 2CD", 3)

    @patch("Service.propertyService.repo.get_area_data_from_db")
    @patch("Service.propertyService.calculate_inflation_rate")
    def test_get_properties_from_area_inflation_failure(self, mock_inflation_rate, mock_get_data):
        """Test when inflation rate calculation fails"""

        # Fake property data
        fake_data = pd.DataFrame({
            "postcode": ["AB1 2CD"],
            "number_bedrooms": [3],
            "lodgement_datetime": ["2023-01-01"],
            "hot_water_cost_current": [100],
            "heating_cost_current": [200],
            "lighting_cost_current": [50]
        })

        mock_get_data.return_value = fake_data

        # Mock inflation rate function to return None
        mock_inflation_rate.return_value = None

        # Call function
        result = propertyService.get_properties_from_area("AB1 2CD", 3)

        # Assertions
        pd.testing.assert_frame_equal(result, fake_data, check_dtype=False)
        mock_inflation_rate.assert_called_once()
        
    def test_adjust_cost_success(self):
        """Test cost adjustment with a valid inflation rate"""

        # Expected: 100 * (1 + 5/100) = 105.00
        result = propertyService.adjust_cost(100, 5)
        self.assertEqual(result, 105.00)

    def test_adjust_cost_no_inflation(self):
        """Test case when inflation rate is None"""

        result = propertyService.adjust_cost(100, None)
        self.assertEqual(result, 100)  # Should return original cost

    def test_adjust_cost_zero_inflation(self):
        """Test when inflation rate is 0%"""

        result = propertyService.adjust_cost(100, 0)
        self.assertEqual(result, 100)  # Cost should remain unchanged

    def test_adjust_cost_negative_inflation(self):
        """Test when inflation rate is negative (deflation scenario)"""

        # Expected: 100 * (1 - 5/100) = 95.00
        result = propertyService.adjust_cost(100, -5)
        self.assertEqual(result, 95.00)

    def test_adjust_cost_invalid_cost(self):
        """Test handling of invalid cost values"""

        result = propertyService.adjust_cost(None, 5)  # None as cost
        self.assertIsNone(result)  # Should return None (or original cost)

        result = propertyService.adjust_cost("invalid", 5)  # String as cost
        self.assertEqual(result, "invalid")  # Should return original cost

    def test_adjust_cost_invalid_inflation_rate(self):
        """Test handling of invalid inflation rate values"""

        result = propertyService.adjust_cost(100, "invalid")  # String as inflation rate
        self.assertEqual(result, 100)  # Should return original cost

        result = propertyService.adjust_cost(100, None)  # None as inflation rate
        self.assertEqual(result, 100)  # Should return original cost

if __name__ == "__main__":
    unittest.main()
