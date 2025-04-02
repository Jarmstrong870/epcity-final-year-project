import unittest
from unittest.mock import patch
from bcrypt import hashpw, gensalt
import sys
import os

# Add backend path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from backend.Service.accountOverviewService import AccountOverviewService


class TestAccountOverviewService(unittest.TestCase):

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.update_password")
    def test_change_password_success(self, mock_update_password, mock_get_password_hash):
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

    def test_change_password_missing_fields(self):
        data = {"email": "test@example.com", "current_password": "onlycurrent"}
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 400)

    def test_change_password_short_new_password(self):
        data = {
            "email": "test@example.com",
            "current_password": "oldpass",
            "new_password": "123"
        }
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 400)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    def test_change_password_no_user_found(self, mock_get_hash):
        mock_get_hash.return_value = None
        data = {
            "email": "nouser@example.com",
            "current_password": "whatever",
            "new_password": "newpass123"
        }
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 404)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    def test_change_password_incorrect_current(self, mock_get_hash):
        stored_hash = hashpw("realpass".encode('utf-8'), gensalt()).decode('utf-8')
        mock_get_hash.return_value = stored_hash

        data = {
            "email": "test@example.com",
            "current_password": "wrongpass",
            "new_password": "newpass123"
        }
        response, status = AccountOverviewService.change_password(data)
        self.assertEqual(status, 401)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.get_password_hash")
    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.update_password")
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

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.delete_user")
    def test_delete_account_success(self, mock_delete_user):
        mock_delete_user.return_value = True
        data = {"email": "user@example.com"}

        response, status = AccountOverviewService.delete_account(data)
        self.assertEqual(status, 200)

    def test_delete_account_missing_email(self):
        data = {}
        response, status = AccountOverviewService.delete_account(data)
        self.assertEqual(status, 400)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.delete_user")
    def test_delete_account_failure(self, mock_delete_user):
        mock_delete_user.return_value = False
        data = {"email": "fail@example.com"}

        response, status = AccountOverviewService.delete_account(data)
        self.assertEqual(status, 500)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.update_user_details")
    def test_edit_details_success(self, mock_update_user_details):
        mock_update_user_details.return_value = True
        data = {
            "email": "test@example.com",
            "firstname": "John",
            "lastname": "Doe"
        }

        response, status = AccountOverviewService.edit_details(data)
        self.assertEqual(status, 200)

    def test_edit_details_missing_fields(self):
        data = {"email": "test@example.com", "firstname": "OnlyMe"}
        response, status = AccountOverviewService.edit_details(data)
        self.assertEqual(status, 400)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.update_user_details")
    def test_edit_details_failure(self, mock_update_user_details):
        mock_update_user_details.return_value = False
        data = {
            "email": "fail@example.com",
            "firstname": "Fail",
            "lastname": "Case"
        }

        response, status = AccountOverviewService.edit_details(data)
        self.assertEqual(status, 500)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.update_profile_image_url")
    def test_update_profile_image(self, mock_update):
        mock_update.return_value = True
        result = AccountOverviewService.update_profile_image("test@example.com", "https://example.com/pic.png")
        self.assertTrue(result)

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.get_user_details")
    def test_get_user_success(self, mock_get_user_details):
        mock_get_user_details.return_value = ("John", "Doe", "john.doe@example.com", "http://example.com/profile.jpg")

        response, status = AccountOverviewService.get_user("john.doe@example.com")
        self.assertEqual(status, 200)
        self.assertEqual(response["firstname"], "John")

    @patch("backend.Service.accountOverviewService.AccountOverviewRepo.get_user_details")
    def test_get_user_not_found(self, mock_get_user_details):
        mock_get_user_details.return_value = None

        response, status = AccountOverviewService.get_user("nobody@example.com")
        self.assertEqual(status, 404)


if __name__ == '__main__':
    unittest.main()

