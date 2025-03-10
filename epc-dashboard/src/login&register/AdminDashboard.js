import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [messagesLast24Hours, setMessagesLast24Hours] = useState(0);

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
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPropertiesCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/properties-count");
        setTotalProperties(response.data.total_properties);
      } catch (error) {
        console.error("Error fetching properties count:", error);
      }
    };
  
    fetchPropertiesCount(); // Fetch on component mount
    const interval = setInterval(fetchPropertiesCount, 60000); // Refresh every 60 seconds
  
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const fetchMessagesCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/messages-last-24-hours");
        setMessagesLast24Hours(response.data.messages_last_24_hours);
      } catch (error) {
        console.error("Error fetching messages count:", error);
      }
    };
  
    fetchMessagesCount(); // Fetch on component mount
    const interval = setInterval(fetchMessagesCount, 60000); // Refresh every 60 seconds
  
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);  

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/active-users");
        setActiveUsers(response.data.active_users);
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };
  
    fetchActiveUsers(); // Fetch on component mount
    const interval = setInterval(fetchActiveUsers, 60000); // Refresh every 60 seconds
  
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);  

  const handleUpdateProperties = async () => {
    setIsUpdating(true);
    setUpdateMessage("Updating property data, please wait...");
    try {
      console.log("Updating Property Data...");
      const response = await axios.get("http://localhost:5000/api/property/updateDB");
      console.log("Property Data Updated:", response.data);
      setUpdateMessage("Property data successfully updated!");
    } catch (error) {
      console.error("Error updating property data:", error);
      setUpdateMessage("Error updating property data. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateInflationData = async () => {
    setIsUpdating(true);
    setUpdateMessage("Updating inflation data, this may take some time...");
    try {
      console.log("Updating Inflation Data...");
      const response = await axios.get("http://localhost:5000/api/property/inflationDB");
      console.log("Inflation Data Updated:", response.data);
      setUpdateMessage("Inflation data successfully updated!");
    } catch (error) {
      console.error("Error updating inflation data:", error);
      setUpdateMessage("Error updating inflation data. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (email) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      try {
        console.log(`Attempting to delete user: ${email}`);
        await axios.delete(`http://localhost:5000/admin/delete-user/${email}`);

        setUsers(users.filter((user) => user.email !== email));
        setUpdateMessage(`User ${email} successfully deleted.`);
        console.log(`User ${email} successfully deleted.`);
      } catch (error) {
        console.error(`Error deleting user ${email}:`, error);
        setUpdateMessage(`Error deleting user ${email}. Please try again.`);
      }
    }
  };

  const handleBlockUser = async (email, isBlocked) => {
    if (window.confirm(`Are you sure you would like to ${isBlocked ? "unblock" : "block"} user ${email}?`)) {
      try {
        console.log(`Toggling block status for: ${email}, Currently Blocked: ${isBlocked}`);
        await axios.patch(`http://localhost:5000/admin/toggle-block/${email}`);

        setUsers(users.map((user) => 
          user.email === email ? { ...user, is_blocked: !isBlocked } : user
        ));

        setUpdateMessage(`User ${email} ${isBlocked ? "unblocked" : "blocked"}.`);
        console.log(`User ${email} ${isBlocked ? "unblocked" : "blocked"}.`);
      } catch (error) {
        console.error(`Error blocking/unblocking user ${email}:`, error);
        setUpdateMessage(`Error updating user status. Please try again.`);
      }
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
          <p>{totalProperties !== 0 ? totalProperties.toLocaleString() : "Loading..."}</p>
        </div>
        <div className="stat-card active-users">
          <h3>Active Users (Last 10 min)</h3>
          <p>{activeUsers}</p>
        </div>
        <div className="stat-card messages">
          <h3>Messages Sent (Last 24 Hours)</h3>
          <p>
            {messagesLast24Hours === null || messagesLast24Hours === undefined
              ? "Loading..." 
              : messagesLast24Hours === 0
              ? "No messages sent"
              : messagesLast24Hours}
          </p>
        </div>
      </div>


      <section className="property-management">
        <h2>Property Management</h2>
        <p className="section-description">
          Manage and update the latest property data and inflation values to keep information up to date.
        </p>

        <div className="property-management-buttons">
          <div className="property-button-container">
            <p className="button-description">Fetch Latest Property Data</p>
            <button className="update-property-button" onClick={handleUpdateProperties} disabled={isUpdating}>
              Update
            </button>
          </div>

          <div className="property-button-container">
            <p className="button-description">Update Inflation Data</p>
            <button className="update-inflation-button" onClick={handleUpdateInflationData} disabled={isUpdating}>
              Update
            </button>
          </div>
        </div>
      </section>

      {isUpdating && <p className="loading">⏳ {updateMessage}</p>}
      {!isUpdating && updateMessage && <p className="success-message">{updateMessage}</p>}

      {loading ? (
        <p className="loading">Loading data...</p>
      ) : (
        <section className="user-management">
          <h2>User Management</h2>
          <p className="section-description">
            View, manage, and update user roles, status, and access levels.
          </p>

          <div className="user-management-container">
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
          </div>
        </section>

      )}
    </div>
  );
};

export default AdminDashboard;