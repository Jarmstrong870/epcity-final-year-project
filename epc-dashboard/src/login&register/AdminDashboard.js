import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Redirect if not admin
  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/"); // Redirect non-admins to homepage
    }
  }, [user, navigate]);

  // ✅ Fetch all users & properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:5000/admin/get-users");
        const propertiesResponse = await axios.get("http://localhost:5000/admin/get-properties");
        setUsers(usersResponse.data);
        setProperties(propertiesResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Delete a user
  const handleDeleteUser = async (email) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      try {
        await axios.delete(`http://localhost:5000/admin/delete-user/${email}`);
        setUsers(users.filter((user) => user.email !== email)); // Remove from UI
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // ✅ Render Admin Dashboard
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Manage users and properties below.</p>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* User Management Section */}
          <div className="admin-section">
            <h2>User Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>{user.firstname} {user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.is_admin ? "Admin" : "User"}</td>
                    <td>
                      <button className="delete-button" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Property Management Section */}
          <div className="admin-section">
            <h2>Property Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>Location</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>{property.name}</td>
                    <td>{property.location}</td>
                    <td>{property.owner_email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
