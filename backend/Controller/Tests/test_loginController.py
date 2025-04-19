import unittest
from unittest.mock import patch
from flask import Flask
from Controller.loginController import login_controller


class TestLoginController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(login_controller)
        self.client = self.app.test_client()

    @patch("Controller.loginController.login.login_user_service")
    def test_login_success(self, mock_login_service):
        mock_login_service.return_value = ({"message": "Login successful"}, 200)
        
        payload = {
            "email": "user@example.com",
            "password": "securepassword"
        }
        response = self.client.post("/login", json=payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Login successful")

    @patch("Controller.loginController.login.login_user_service")
    def test_login_failure(self, mock_login_service):
        mock_login_service.return_value = ({"message": "Invalid credentials"}, 401)
        
        payload = {
            "email": "user@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post("/login", json=payload)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json["message"], "Invalid credentials")

    def test_login_invalid_input_missing_fields(self):
        # Missing password
        payload = {"email": "user@example.com"}
        response = self.client.post("/login", json=payload)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid input data", response.json["message"])

        # Missing email
        payload = {"password": "pass123"}
        response = self.client.post("/login", json=payload)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid input data", response.json["message"])

        # Empty body
        response = self.client.post("/login", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid input data", response.json["message"])


if __name__ == "__main__":
    unittest.main()
