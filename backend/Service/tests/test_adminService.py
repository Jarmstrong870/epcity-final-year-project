import unittest
from unittest.mock import patch, MagicMock
from backend.Service.adminService import (
    get_all_users,
    toggle_user_block,
    delete_userr,
    get_active_users_count,
    get_total_properties_count,
    get_messages_last_24_hours
)

class TestAdminService(unittest.TestCase):
    
    @patch("backend.Service.adminService.fetch_users_from_db")
    def test_get_all_users_success(self, mock_fetch_users):
        mock_fetch_users.return_value = [{"email": "user@example.com", "status": "active"}]
        result = get_all_users()
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["email"], "user@example.com")

    @patch("backend.Service.adminService.fetch_users_from_db")
    def test_get_all_users_empty(self, mock_fetch_users):
        mock_fetch_users.return_value = []
        result = get_all_users()
        self.assertEqual(result, [])

    @patch("backend.Service.adminService.update_user_block_status")
    def test_toggle_user_block_success(self, mock_toggle):
        mock_toggle.return_value = True
        result = toggle_user_block("test@example.com")
        self.assertTrue(result)

    @patch("backend.Service.adminService.update_user_block_status")
    def test_toggle_user_block_failure(self, mock_toggle):
        mock_toggle.return_value = False
        result = toggle_user_block("fail@example.com")
        self.assertFalse(result)

    @patch("backend.Service.adminService.delete_user")
    def test_delete_user_success(self, mock_delete):
        mock_delete.return_value = True
        result = delete_userr("user@example.com")
        self.assertTrue(result)

    @patch("backend.Service.adminService.delete_user")
    def test_delete_user_failure(self, mock_delete):
        mock_delete.return_value = False
        result = delete_userr("fail@example.com")
        self.assertFalse(result)

    @patch("backend.Service.adminService.fetch_active_users_count")
    def test_get_active_users_count_success(self, mock_active_users):
        mock_active_users.return_value = 5
        result = get_active_users_count()
        self.assertEqual(result, 5)

    @patch("backend.Service.adminService.fetch_active_users_count")
    def test_get_active_users_count_zero(self, mock_active_users):
        mock_active_users.return_value = 0
        result = get_active_users_count()
        self.assertEqual(result, 0)

    @patch("backend.Service.adminService.fetch_total_properties_count")
    def test_get_total_properties_count_success(self, mock_total_properties):
        mock_total_properties.return_value = 100
        result = get_total_properties_count()
        self.assertEqual(result, 100)

    @patch("backend.Service.adminService.fetch_total_properties_count")
    def test_get_total_properties_count_zero(self, mock_total_properties):
        mock_total_properties.return_value = 0
        result = get_total_properties_count()
        self.assertEqual(result, 0)

    @patch("backend.Service.adminService.fetch_messages_last_24_hours")
    def test_get_messages_last_24_hours_success(self, mock_messages):
        mock_messages.return_value = 30
        result = get_messages_last_24_hours()
        self.assertEqual(result, 30)

    @patch("backend.Service.adminService.fetch_messages_last_24_hours")
    def test_get_messages_last_24_hours_zero(self, mock_messages):
        mock_messages.return_value = 0
        result = get_messages_last_24_hours()
        self.assertEqual(result, 0)

if __name__ == "__main__":
    unittest.main()


