import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Admin Dashboard Loaded, Checking User:", user);

    if (!user || !user.isAdmin) {
      console.warn("Unauthorized Access - Redirecting...");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Users & Properties...");
        const usersResponse = await axios.get("http://localhost:5000/admin/get-users");


        console.log("Users Retrieved:", usersResponse.data);


        setUsers(usersResponse.data);
      } catch (error) {
        console.error("❌ Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (email) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      try {
        console.log(`Attempting to delete user: ${email}`);
        await axios.delete(`http://localhost:5000/admin/delete-user/${email}`);

        setUsers(users.filter((user) => user.email !== email));
        console.log(`✅ User ${email} successfully deleted.`);
      } catch (error) {
        console.error(`❌ Error deleting user ${email}:`, error);
      }
    }
  };

  const handleBlockUser = async (email, isBlocked) => {
    try {
      console.log(`Toggling block status for: ${email}, Currently Blocked: ${isBlocked}`);
      await axios.patch(`http://localhost:5000/admin/toggle-block/${email}`);

      setUsers(users.map((user) => 
        user.email === email ? { ...user, is_blocked: !isBlocked } : user
      ));

      console.log(`✅ User ${email} ${isBlocked ? "unblocked" : "blocked"}.`);
    } catch (error) {
      console.error(`❌ Error blocking/unblocking user ${email}:`, error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Welcome, Admin! Manage users, properties, and monitor activity.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card users">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card properties">
          <h3>Total Properties</h3>
          <p>{properties.length}</p>
        </div>
        <div className="stat-card active-users">
          <h3>Active Users</h3>
          <p>Coming Soon...</p>
        </div>
        <div className="stat-card messages">
          <h3>Messages Sent</h3>
          <p>Coming Soon...</p>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading data...</p>
      ) : (
        <>
          {/* User Management Section */}
          <section className="admin-section">
            <h2>User Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>{user.firstname} {user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.is_admin ? "Admin" : "User"}</td>
                    <td className={user.is_blocked ? "blocked" : "active"}>
                      {user.is_blocked ? "Blocked" : "Active"}
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                      <button 
                        className={`block-button ${user.is_blocked ? "unblock" : "block"}`} 
                        onClick={() => handleBlockUser(user.email, user.is_blocked)}
                      >
                        {user.is_blocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
        </>
      )}
    </div>
  );
};

export default AdminDashboard;


