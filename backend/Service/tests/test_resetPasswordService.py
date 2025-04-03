import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
import sys
import os

# Ensure backend directory is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from backend.Service.resetPasswordService import ResetPasswordService


class TestResetPasswordService(unittest.TestCase):

    @patch("backend.Service.resetPasswordService.random.choices")
    def test_generate_otp(self, mock_choices):
        mock_choices.return_value = ['1', '2', '3', '4', '5', '6']
        otp = ResetPasswordService.generate_otp()
        self.assertEqual(otp, "123456")

    @patch("backend.Service.resetPasswordService.emails.NewEmail")
    @patch.dict(os.environ, {"MAILERSEND_API_KEY": "fake_key"})
    def test_send_otp_email(self, mock_email_client):
        mock_mailer = MagicMock()
        mock_email_client.return_value = mock_mailer

        ResetPasswordService.send_otp_email("test@email.com", "123456")

        mock_mailer.set_mail_from.assert_called()
        mock_mailer.set_mail_to.assert_called()
        mock_mailer.set_subject.assert_called()
        mock_mailer.set_template.assert_called()
        mock_mailer.set_personalization.assert_called()
        mock_mailer.send.assert_called()

    @patch("backend.Service.resetPasswordService.ResetPasswordService.send_otp_email")
    @patch("backend.Service.resetPasswordService.ResetPasswordRepo.save_reset_otp")
    @patch("backend.Service.resetPasswordService.ResetPasswordService.generate_otp")
    def test_request_password_reset(self, mock_generate_otp, mock_save_otp, mock_send_email):
        mock_generate_otp.return_value = "654321"
        mock_save_otp.return_value = None
        mock_send_email.return_value = None

        response, status = ResetPasswordService.request_password_reset("test@email.com")

        self.assertEqual(status, 200)
        self.assertIn("OTP has been sent", response["message"])
        mock_generate_otp.assert_called_once()
        mock_save_otp.assert_called_once()
        mock_send_email.assert_called_once()

    @patch("backend.Service.resetPasswordService.ResetPasswordRepo.get_otp")
    def test_verify_otp_success(self, mock_get_otp):
        expiry = datetime.utcnow() + timedelta(minutes=5)
        mock_get_otp.return_value = ("123456", expiry)

        valid, status = ResetPasswordService.verify_otp("test@email.com", "123456")
        self.assertTrue(valid)
        self.assertEqual(status, 200)

    @patch("backend.Service.resetPasswordService.ResetPasswordRepo.get_otp")
    def test_verify_otp_invalid(self, mock_get_otp):
        expiry = datetime.utcnow() + timedelta(minutes=5)
        mock_get_otp.return_value = ("123456", expiry)

        valid, status = ResetPasswordService.verify_otp("test@email.com", "wrongotp")
        self.assertFalse(valid)
        self.assertEqual(status, 400)

    @patch("backend.Service.resetPasswordService.ResetPasswordRepo.get_otp")
    def test_verify_otp_expired(self, mock_get_otp):
        expiry = datetime.utcnow() - timedelta(minutes=1)  # Already expired
        mock_get_otp.return_value = ("123456", expiry)

        valid, status = ResetPasswordService.verify_otp("test@email.com", "123456")
        self.assertFalse(valid)
        self.assertEqual(status, 400)

    @patch("backend.Service.resetPasswordService.ResetPasswordRepo.update_password")
    def test_reset_password_success(self, mock_update_password):
        mock_update_password.return_value = None
        response, status = ResetPasswordService.reset_password("test@email.com", "newpassword")

        self.assertEqual(status, 200)
        self.assertIn("Password reset successfully", response["message"])
        mock_update_password.assert_called_once()


if __name__ == "__main__":
    unittest.main()
