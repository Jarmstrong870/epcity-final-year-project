import unittest
from unittest.mock import patch
from flask import Flask
from Controller.resetPasswordController import reset_password_controller


class TestResetPasswordController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(reset_password_controller)
        self.client = self.app.test_client()

    @patch("Controller.resetPasswordController.ResetPasswordService.request_password_reset")
    def test_request_reset_password_success(self, mock_request_reset):
        mock_request_reset.return_value = ({"message": "OTP sent"}, 200)
        response = self.client.post("/request-reset-password", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "OTP sent")

    def test_request_reset_password_missing_email(self):
        response = self.client.post("/request-reset-password", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email is required", response.json["message"])

    @patch("Controller.resetPasswordController.ResetPasswordService.request_password_reset")
    def test_request_reset_password_exception(self, mock_request_reset):
        mock_request_reset.side_effect = Exception("Service error")
        response = self.client.post("/request-reset-password", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 500)
        self.assertIn("An error occurred", response.json["message"])

    @patch("Controller.resetPasswordController.ResetPasswordService.verify_otp")
    def test_verify_otp_success(self, mock_verify_otp):
        mock_verify_otp.return_value = (True, 200)
        response = self.client.post("/verify-otp", json={"email": "test@example.com", "otp": "123456"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "OTP verified successfully.")

    @patch("Controller.resetPasswordController.ResetPasswordService.verify_otp")
    def test_verify_otp_failure(self, mock_verify_otp):
        mock_verify_otp.return_value = (False, 400)
        response = self.client.post("/verify-otp", json={"email": "test@example.com", "otp": "wrong"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["message"], "Invalid or expired OTP.")

    def test_verify_otp_missing_fields(self):
        response = self.client.post("/verify-otp", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email and OTP are required", response.json["message"])

    @patch("Controller.resetPasswordController.ResetPasswordService.verify_otp")
    def test_verify_otp_exception(self, mock_verify_otp):
        mock_verify_otp.side_effect = Exception("Unexpected error")
        response = self.client.post("/verify-otp", json={"email": "test@example.com", "otp": "123456"})
        self.assertEqual(response.status_code, 500)
        self.assertIn("An error occurred", response.json["message"])

    @patch("Controller.resetPasswordController.ResetPasswordService.reset_password")
    def test_reset_password_success(self, mock_reset_password):
        mock_reset_password.return_value = ({"message": "Password reset successful"}, 200)
        payload = {"email": "test@example.com", "newPassword": "newpass123"}
        response = self.client.post("/reset-password", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Password reset successful")

    def test_reset_password_missing_fields(self):
        response = self.client.post("/reset-password", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email and new password are required", response.json["message"])

    @patch("Controller.resetPasswordController.ResetPasswordService.reset_password")
    def test_reset_password_exception(self, mock_reset_password):
        mock_reset_password.side_effect = Exception("Something broke")
        payload = {"email": "test@example.com", "newPassword": "newpass123"}
        response = self.client.post("/reset-password", json=payload)
        self.assertEqual(response.status_code, 500)
        self.assertIn("An error occurred", response.json["message"])


if __name__ == "__main__":
    unittest.main()
