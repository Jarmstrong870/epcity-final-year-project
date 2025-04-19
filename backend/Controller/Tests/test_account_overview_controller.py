import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from Controller.accountOverviewController import account_overview_controller

class TestAccountOverviewController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(account_overview_controller)
        self.client = self.app.test_client()

    @patch("Service.accountOverviewService.AccountOverviewService.change_password")
    def test_change_password_success(self, mock_change_password):
        mock_change_password.return_value = ({"message": "Password updated"}, 200)

        payload = {
            "email": "test@example.com",
            "current_password": "oldpass",
            "new_password": "newpass"
        }
        response = self.client.put("/change-password", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Password updated")

    def test_change_password_missing_fields(self):
        response = self.client.put("/change-password", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid input", response.json["message"])

    @patch("Service.accountOverviewService.AccountOverviewService.delete_account")
    def test_delete_account_success(self, mock_delete_account):
        mock_delete_account.return_value = ({"message": "Account deleted"}, 200)

        response = self.client.delete("/delete-account", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Account deleted")

    def test_delete_account_missing_email(self):
        response = self.client.delete("/delete-account", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid input", response.json["message"])

    @patch("Service.accountOverviewService.AccountOverviewService.edit_details")
    def test_edit_details_success(self, mock_edit_details):
        mock_edit_details.return_value = ({"message": "Details updated"}, 200)
        payload = {
            "email": "test@example.com",
            "firstname": "John",
            "lastname": "Doe"
        }
        response = self.client.put("/edit-details", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Details updated")

    def test_edit_details_missing_fields(self):
        payload = {"email": "test@example.com", "firstname": "John"}  # missing lastname
        response = self.client.put("/edit-details", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid input", response.json["message"])

    def test_upload_profile_image_missing_file(self):
        response = self.client.post("/upload-profile-image", data={"email": "test@example.com"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("No file provided", response.json["message"])

    def test_upload_profile_image_missing_email(self):
        from io import BytesIO
        data = {
            "file": (BytesIO(b"image content"), "profile.png")
        }

        response = self.client.post("/upload-profile-image", data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email and file are required", response.json["message"])

    @patch("Service.accountOverviewService.AccountOverviewService.get_user")
    def test_get_user_success(self, mock_get_user):
        mock_get_user.return_value = ({"email": "test@example.com", "firstname": "John"}, 200)

        response = self.client.get("/get-user/test@example.com")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["email"], "test@example.com")

    @patch("Service.accountOverviewService.AccountOverviewService.get_user")
    def test_get_user_not_found(self, mock_get_user):
        mock_get_user.return_value = ({"message": "User not found"}, 404)

        response = self.client.get("/get-user/unknown@example.com")
        self.assertEqual(response.status_code, 404)
        self.assertIn("User not found", response.json["message"])


if __name__ == "__main__":
    unittest.main()
