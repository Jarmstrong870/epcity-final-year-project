import unittest
from unittest.mock import patch
from flask import Flask
from Controller.registrationController import register_controller


class TestRegistrationController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(register_controller)
        self.client = self.app.test_client()

    @patch("Controller.registrationController.register.register_user_service")
    def test_register_user_success(self, mock_register_user_service):
        mock_register_user_service.return_value = ({"message": "User registered"}, 201)
        payload = {
            "email": "newuser@example.com",
            "password": "password123",
            "firstname": "Test",
            "lastname": "User"
        }
        response = self.client.post("/register", json=payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["message"], "User registered")

    def test_register_user_missing_fields(self):
        payload = {"email": "incomplete@example.com", "password": "pass"}
        response = self.client.post("/register", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid input data", response.json["message"])

    @patch("Controller.registrationController.register.request_registration_otp_service")
    def test_request_registration_otp_success(self, mock_otp_service):
        mock_otp_service.return_value = ({"message": "OTP sent"}, 200)
        response = self.client.post("/request-registration-otp", json={"email": "otp@example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "OTP sent")

    def test_request_registration_otp_missing_email(self):
        response = self.client.post("/request-registration-otp", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email is required", response.json["message"])

    @patch("Controller.registrationController.register.verify_registration_otp_service")
    def test_verify_registration_otp_success(self, mock_verify_otp):
        mock_verify_otp.return_value = ({"message": "OTP verified"}, 200)
        payload = {"email": "verify@example.com", "otp": "123456"}
        response = self.client.post("/verify-registration-otp", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "OTP verified")

    def test_verify_registration_otp_missing_fields(self):
        response = self.client.post("/verify-registration-otp", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email and OTP are required", response.json["message"])

    @patch("Controller.registrationController.check_email_exists_service")
    def test_check_email_success(self, mock_check_email):
        mock_check_email.return_value = True
        response = self.client.post("/check-email", json={"email": "exists@example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["exists"])

    def test_check_email_missing(self):
        response = self.client.post("/check-email", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email is required", response.json["message"])

    @patch("Controller.registrationController.check_email_exists_service")
    def test_check_email_exception(self, mock_check_email):
        mock_check_email.side_effect = Exception("DB down")
        response = self.client.post("/check-email", json={"email": "error@example.com"})
        self.assertEqual(response.status_code, 500)
        self.assertIn("An error occurred", response.json["message"])


if __name__ == "__main__":
    unittest.main()
