import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AccountOverview.css';
import defaultProfileImage from '../assets/profile.jpg'; // Import default profile image

function AccountOverview({ user, setUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstname || '');
      setLastName(user.lastname || '');
      setEmail(user.email || '');
      setProfileImage(user.profileImage || defaultProfileImage);
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!firstName || !lastName || !email) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/edit-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || 'Details updated successfully!');
        setUser({
          ...user,
          firstname: firstName,
          lastname: lastName,
          email,
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update user details.');
      }
    } catch (error) {
      console.error('Error updating user details:', error.message || error);
      setMessage('An error occurred while saving your changes. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, 
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPasswordMessage(data.message || 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const errorData = await response.json();
        setPasswordMessage(errorData.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage('An error occurred while changing your password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('http://localhost:5000/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });

      if (response.ok) {
        const data = await response.json();
        setDeleteMessage(data.message || 'Account deleted successfully!');
        setUser(null); // Log out the user
        navigate('/'); // Redirect to the home page
      } else {
        const errorData = await response.json();
        setDeleteMessage(errorData.message || 'Failed to delete account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteMessage('An error occurred while deleting your account.');
    }
  };

  const cancelDeleteAccount = () => {
    setDeleteConfirmVisible(false);
  };

  const confirmDeleteAccount = () => {
    setDeleteConfirmVisible(true);
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProfileMessage("No file selected.");
      return;
    }
  
    if (!user || !user.id || !user.token) {
      setProfileMessage("User is not authenticated.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user.id); // Include user ID for backend
  
    try {
      const response = await fetch('http://localhost:5000/api/upload-profile-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`, // Token for authenticated requests
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setProfileMessage(data.message || 'Profile image updated successfully!');
        setProfileImage(data.url); // Use the public URL returned from the backend
      } else {
        const errorData = await response.json();
        setProfileMessage(errorData.message || 'Failed to update profile image.');
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      setProfileMessage('An error occurred while updating your profile image.');
    }
  };  

  return (
    <div className="account-overview">
      {/* Navigation Bar */}
      <div className="nav-bar">
        <Link to="/account-overview" className="nav-item">
          Account Overview
        </Link>
        <Link to="/property" className="nav-item">
          My Properties
        </Link>
        <button className="nav-item logout-button" onClick={() => setUser(null)}>
          Logout
        </button>
      </div>

      {/* Content Section */}
      <div className="account-content">
        <h1>Welcome, {firstName || 'User'}!</h1>

        {/* Profile Image Section */}
        <div className="profile-section">
          <img
            src={profileImage || defaultProfileImage}
            alt="Profile"
            className="profile-image"
          />
          <div className="file-input-wrapper">
            <button className="custom-file-button">Choose File</button>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </div>
          <span className="file-input-label">No file chosen</span>
          {profileMessage && <p className="profile-message">{profileMessage}</p>}
        </div>

        {/* Edit Details Section */}
        <div className="form-section">
          <h2>Edit Your Details</h2>
          {message && <p className="account-message">{message}</p>}
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              className="read-only-input"
              placeholder="Email cannot be changed"
            />
          </div>
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>

        {/* Change Password Section */}
        <div className="form-section">
          <h2>Change Password</h2>
          {passwordMessage && <p className="account-message">{passwordMessage}</p>}
          <div className="form-group">
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new password"
            />
          </div>
          <button className="save-button" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="form-section">
          <h2>Delete Account</h2>
          {deleteMessage && <p className="account-message">{deleteMessage}</p>}
          <p>
            If you delete your account, all your data will be permanently
            removed. This action cannot be undone.
          </p>
          <button
            className="delete-button"
            onClick={confirmDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete your account?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteAccount} className="confirm-button">
                Yes
              </button>
              <button onClick={cancelDeleteAccount} className="cancel-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountOverview;
