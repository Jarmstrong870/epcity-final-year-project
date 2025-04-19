import unittest
from unittest.mock import patch
from flask import Flask
from Controller.adminController import admin_controller


class TestAdminController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(admin_controller)
        self.client = self.app.test_client()

    @patch("Controller.adminController.get_all_users")
    def test_fetch_users_success(self, mock_get_all_users):
        mock_get_all_users.return_value = [{"email": "test@example.com", "blocked": False}]
        response = self.client.get("/admin/get-users")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [{"email": "test@example.com", "blocked": False}])

    @patch("Controller.adminController.toggle_user_block")
    def test_block_user_success(self, mock_toggle_user_block):
        mock_toggle_user_block.return_value = True
        response = self.client.patch("/admin/toggle-block/test@example.com")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "User block status updated")

    @patch("Controller.adminController.toggle_user_block")
    def test_block_user_failure(self, mock_toggle_user_block):
        mock_toggle_user_block.return_value = False
        response = self.client.patch("/admin/toggle-block/test@example.com")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], "Failed to update user status")

    @patch("Controller.adminController.delete_user")
    def test_delete_user_success(self, mock_delete_user):
        mock_delete_user.return_value = True
        response = self.client.delete("/admin/delete-user/test@example.com")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "User deleted")

    @patch("Controller.adminController.delete_user")
    def test_delete_user_failure(self, mock_delete_user):
        mock_delete_user.return_value = False
        response = self.client.delete("/admin/delete-user/test@example.com")
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json["message"], "Failed to delete user")

    @patch("Controller.adminController.get_active_users_count")
    def test_get_active_users_success(self, mock_active_users):
        mock_active_users.return_value = 5
        response = self.client.get("/admin/active-users")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["active_users"], 5)

    @patch("Controller.adminController.get_total_properties_count")
    def test_get_properties_count_success(self, mock_properties_count):
        mock_properties_count.return_value = 100
        response = self.client.get("/admin/properties-count")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["total_properties"], 100)

    @patch("Controller.adminController.get_messages_last_24_hours")
    def test_get_messages_last_24_hours_success(self, mock_messages):
        mock_messages.return_value = 42
        response = self.client.get("/admin/messages-last-24-hours")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["messages_last_24_hours"], 42)


if __name__ == "__main__":
    unittest.main()

