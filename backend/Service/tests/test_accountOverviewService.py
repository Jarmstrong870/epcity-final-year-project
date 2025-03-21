import unittest
from unittest.mock import patch, MagicMock
from bcrypt import hashpw, gensalt
from dotenv import load_dotenv
import sys
import os

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv(env_path)

# Add the backend folder to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from backend.Service.accountOverviewService import AccountOverviewService


class TestAccountOverviewService(unittest.TestCase):

    @patch("Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    @patch("Service.accountOverviewService.AccountOverviewRepo.update_password")
    def test_change_password_success(self, mock_update_password, mock_get_password_hash):
        # The user’s current password is 'oldpass'
        stored_hash = hashpw("oldpass".encode('utf-8'), gensalt()).decode('utf-8')
        mock_get_password_hash.return_value = stored_hash
        mock_update_password.return_value = True

        data = {
            "email": "test@example.com",
            "current_password": "oldpass",
            "new_password": "newpassword"
        }
        response, status = AccountOverviewService.change_password(data)

        self.assertEqual(status, 200)
        self.assertIn("Password changed successfully!", response["message"])
        mock_get_password_hash.assert_called_once_with("test@example.com")
        mock_update_password.assert_called_once()

    def test_change_password_missing_fields(self):
        data = {"email": "test@example.com", "current_password": "onlycurrent"}  # new_password missing
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 400)
        self.assertIn("All fields must be entered.", response["message"])

    def test_change_password_short_new_password(self):
        data = {
            "email": "test@example.com",
            "current_password": "oldpass",
            "new_password": "123"
        }
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 400)
        self.assertIn("must be at least 7 characters", response["message"])

    @patch("Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    def test_change_password_no_user_found(self, mock_get_hash):
        mock_get_hash.return_value = None
        data = {
            "email": "nouser@example.com",
            "current_password": "whatever",
            "new_password": "newpass123"
        }
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 404)
        self.assertIn("No account found", response["message"])

    @patch("Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    def test_change_password_incorrect_current(self, mock_get_hash):
        # Stored hash for actual password 'realpass'
        stored_hash = hashpw("realpass".encode('utf-8'), gensalt()).decode('utf-8')
        mock_get_hash.return_value = stored_hash

        data = {
            "email": "test@example.com",
            "current_password": "wrongpass",
            "new_password": "newpass123"
        }
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 401)
        self.assertIn("Current password is incorrect", response["message"])

    @patch("Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    @patch("Service.accountOverviewService.AccountOverviewRepo.update_password")
    def test_change_password_db_failure(self, mock_update_pass, mock_get_hash):
        stored_hash = hashpw("oldpass".encode('utf-8'), gensalt()).decode('utf-8')
        mock_get_hash.return_value = stored_hash
        mock_update_pass.return_value = False

        data = {
            "email": "test@example.com",
            "current_password": "oldpass",
            "new_password": "newpass123"
        }
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 500)
        self.assertIn("Failed to update password", response["message"])

    @patch("Service.accountOverviewService.AccountOverviewRepo.delete_user")
    def test_delete_account_success(self, mock_delete_user):
        mock_delete_user.return_value = True
        data = {"email": "user@example.com"}

        response, status = AccountOverviewService.delete_account(data)
        self.assertEqual(status, 200)
        self.assertIn("Account deleted successfully!", response["message"])
        mock_delete_user.assert_called_once_with("user@example.com")

    def test_delete_account_missing_email(self):
        data = {}
        response, status = AccountOverviewService.delete_account(data)
        self.assertEqual(status, 400)
        self.assertIn("Email is required", response["message"])

    @patch("Service.accountOverviewService.AccountOverviewRepo.delete_user")
    def test_delete_account_failure(self, mock_delete_user):
        mock_delete_user.return_value = False
        data = {"email": "fail@example.com"}

        response, status = AccountOverviewService.delete_account(data)
        self.assertEqual(status, 500)
        self.assertIn("Failed to delete account", response["message"])

    @patch("Service.accountOverviewService.AccountOverviewRepo.update_user_details")
    def test_edit_details_success(self, mock_update_user_details):
        mock_update_user_details.return_value = True
        data = {
            "email": "test@example.com",
            "firstname": "John",
            "lastname": "Doe"
        }

        response, status = AccountOverviewService.edit_details(data)
        self.assertEqual(status, 200)
        self.assertIn("User details updated successfully!", response["message"])
        mock_update_user_details.assert_called_once_with("test@example.com", "John", "Doe")

    def test_edit_details_missing_fields(self):
        data = {"email": "test@example.com", "firstname": "OnlyMe"}  # missing 'lastname'
        response, status = AccountOverviewService.edit_details(data)
        self.assertEqual(status, 400)
        self.assertIn("All fields must be provided", response["message"])

    @patch("Service.accountOverviewService.AccountOverviewRepo.update_user_details")
    def test_edit_details_failure(self, mock_update_user_details):
        mock_update_user_details.return_value = False
        data = {
            "email": "fail@example.com",
            "firstname": "Fail",
            "lastname": "Case"
        }

        response, status = AccountOverviewService.edit_details(data)
        self.assertEqual(status, 500)
        self.assertIn("Failed to update user details", response["message"])

  
    @patch("Service.accountOverviewService.supabase")
    def test_upload_profile_image_success(self, mock_supabase):
        mock_file = MagicMock()
        mock_file.filename = "test.png"
        mock_file.read.return_value = b"fake_file_data"

        mock_bucket = MagicMock()
        mock_bucket.upload.return_value = True
        mock_bucket.get_public_url.return_value = "https://example.com/test.png"
        mock_supabase.storage.from_.return_value = mock_bucket

        public_url = AccountOverviewService.upload_profile_image(mock_file, "user@example.com")
        self.assertEqual(public_url, "https://example.com/test.png")

    @patch("Service.accountOverviewService.supabase")
    def test_upload_profile_image_failure(self, mock_supabase):
        mock_file = MagicMock()
        mock_file.filename = "test.png"
        mock_file.read.return_value = b"fake_file_data"

        mock_bucket = MagicMock()
        mock_bucket.upload.return_value = False
        mock_bucket.get_public_url.return_value = None
        mock_supabase.storage.from_.return_value = mock_bucket

        public_url = AccountOverviewService.upload_profile_image(mock_file, "fail@example.com")
        self.assertIsNone(public_url)


    @patch("Service.accountOverviewService.AccountOverviewRepo.update_profile_image_url")
    def test_update_profile_image(self, mock_update):
        mock_update.return_value = True
        result = AccountOverviewService.update_profile_image("test@example.com", "https://example.com/pic.png")
        self.assertTrue(result)
        mock_update.assert_called_once_with("test@example.com", "https://example.com/pic.png")

   
    @patch("Service.accountOverviewService.AccountOverviewRepo.get_user_details")
    def test_get_user_success(self, mock_get_user_details):
        mock_get_user_details.return_value = ("John", "Doe", "john.doe@example.com", "http://example.com/profile.jpg")

        response, status = AccountOverviewService.get_user("john.doe@example.com")
        self.assertEqual(status, 200)
        self.assertEqual(response["firstname"], "John")
        self.assertEqual(response["lastname"], "Doe")
        self.assertEqual(response["email"], "john.doe@example.com")
        self.assertEqual(response["profile_image_url"], "http://example.com/profile.jpg")

    @patch("Service.accountOverviewService.AccountOverviewRepo.get_user_details")
    def test_get_user_not_found(self, mock_get_user_details):
        mock_get_user_details.return_value = None

        response, status = AccountOverviewService.get_user("nobody@example.com")
        self.assertEqual(status, 404)
        self.assertIn("User not found", response["message"])

if __name__ == '__main__':
    unittest.main()
