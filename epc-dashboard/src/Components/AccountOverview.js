import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AccountOverview.css';
import defaultProfileImage from '../assets/profileicon.png'; // default image

function AccountOverview({ user, setUser, setProfileImage, language }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setLocalProfileImage] = useState(defaultProfileImage);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const navigate = useNavigate();

  // Translations object
  const translations = {
    en: {
      welcome: 'Welcome',
      accountOverview: 'Account Overview',
      myProperties: 'My Properties',
      logout: 'Logout',
      editDetails: 'Edit Your Details',
      saveChanges: 'Save Changes',
      firstName: 'First Name:',
      lastName: 'Last Name:',
      email: 'Email:',
      changePassword: 'Change Password',
      currentPassword: 'Current Password:',
      newPassword: 'New Password:',
      deleteAccount: 'Delete Account',
      deleteConfirm: 'Are you sure you want to delete your account?',
      deleteYes: 'Yes',
      deleteNo: 'No',
      chooseFile: 'Choose File',
      updatingDetails: 'Updating your details...',
      updatingPassword: 'Updating your password...',
      updatingProfileImage: 'Updating your profile image...',
      profileUpdated: 'Profile updated successfully!',
    },
    fr: {
      welcome: 'Bienvenue',
      accountOverview: 'Vue d’ensemble du compte',
      myProperties: 'Mes Propriétés',
      logout: 'Se déconnecter',
      editDetails: 'Modifier vos détails',
      saveChanges: 'Enregistrer les modifications',
      firstName: 'Prénom :',
      lastName: 'Nom de famille :',
      email: 'E-mail :',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel :',
      newPassword: 'Nouveau mot de passe :',
      deleteAccount: 'Supprimer le compte',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer votre compte ?',
      deleteYes: 'Oui',
      deleteNo: 'Non',
      chooseFile: 'Choisir un fichier',
      updatingDetails: 'Mise à jour de vos informations...',
      updatingPassword: 'Mise à jour de votre mot de passe...',
      updatingProfileImage: 'Mise à jour de votre image de profil...',
      profileUpdated: 'Profil mis à jour avec succès !',
    },
    es: {
      welcome: 'Bienvenido',
      accountOverview: 'Resumen de la cuenta',
      myProperties: 'Mis Propiedades',
      logout: 'Cerrar sesión',
      editDetails: 'Editar tus detalles',
      saveChanges: 'Guardar cambios',
      firstName: 'Nombre:',
      lastName: 'Apellido:',
      email: 'Correo electrónico:',
      changePassword: 'Cambiar la contraseña',
      currentPassword: 'Contraseña actual:',
      newPassword: 'Nueva contraseña:',
      deleteAccount: 'Eliminar cuenta',
      deleteConfirm: '¿Estás seguro de que deseas eliminar tu cuenta?',
      deleteYes: 'Sí',
      deleteNo: 'No',
      chooseFile: 'Seleccionar archivo',
      updatingDetails: 'Actualizando tus detalles...',
      updatingPassword: 'Actualizando tu contraseña...',
      updatingProfileImage: 'Actualizando tu imagen de perfil...',
      profileUpdated: '¡Perfil actualizado con éxito!',
    },
  };

  const t = translations[language] || translations.en;

  /// Fetch user details
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-user/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setFirstName(data.firstname || '');
          setLastName(data.lastname || '');
          setEmail(data.email || '');
          setLocalProfileImage(data.profile_image_url || defaultProfileImage); // Update profile image
          setProfileImage(profileImage);
        } else {
          console.error('Failed to fetch user data. Default values will be used.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) fetchUserProfile();
  }, [profileImage, user]);

  const handleSaveChanges = async () => {
    if (!firstName || !lastName || !email) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/edit-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname: firstName, lastname: lastName, email }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || 'Details updated successfully!');
        setUser({ ...user, firstname: firstName, lastname: lastName, email });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update user details.');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setMessage('An error occurred while saving your changes. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProfileMessage('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', user.email); // Send email to backend

    try {
      const response = await fetch('http://localhost:5000/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileMessage(data.message || 'Profile image updated successfully!');
        setLocalProfileImage(data.url); // Update local image
        setProfileImage(data.url); // Update App.js navigation bar profile image
      } else {
        const errorData = await response.json();
        setProfileMessage(errorData.message || 'Failed to update profile image.');
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      setProfileMessage('An error occurred while updating your profile image.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('http://localhost:5000/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeleteMessage(data.message || 'Account deleted successfully!');
        setUser(null); // Clear user session
        navigate('/'); // Redirect to homepage
      } else {
        const errorData = await response.json();
        setDeleteMessage(errorData.message || 'Failed to delete account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteMessage('An error occurred while deleting your account.');
    }
  };


  return (
    <div className="account-overview">
      {/* Navigation */}
      <div className="nav-bar">
        <Link to="/account-overview" className="nav-item">{t.accountOverview}</Link>
        <Link to="/property" className="nav-item">{t.myProperties}</Link>
        <button className="nav-item logout-button" onClick={() => setUser(null)}>{t.logout}</button>
      </div>

      {/* Main Content */}
      <div className="account-content">
        <h1>{t.welcome}, {firstName || 'User'}!</h1>

        {/* Profile Image */}
        <div className="profile-section">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <div className="file-input-wrapper">
            <button className="custom-file-button">{t.chooseFile}</button>
            <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          </div>
          {profileMessage && <p className="profile-message">{profileMessage}</p>}
        </div>

        {/* Edit Details */}
        <div className="form-section">
          <h2>{t.editDetails}</h2>
          {message && <p className="account-message">{message}</p>}
          <div className="form-group">
            <label>{t.firstName}</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t.lastName}</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t.email}</label>
            <input type="email" value={email} readOnly className="read-only-input" />
          </div>
          <button className="save-button" onClick={handleSaveChanges}>{t.saveChanges}</button>
        </div>

        {/* Change Password */}
        <div className="form-section">
          <h2>{t.changePassword}</h2>
          {passwordMessage && <p className="account-message">{passwordMessage}</p>}
          <div className="form-group">
            <label>{t.currentPassword}</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t.newPassword}</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button className="save-button" onClick={handleChangePassword}>{t.changePassword}</button>
        </div>

        {/* Delete Account */}
        <div className="form-section">
          <h2>{t.deleteAccount}</h2>
          {deleteMessage && <p className="account-message">{deleteMessage}</p>}
          <button className="delete-button" onClick={() => setDeleteConfirmVisible(true)}>{t.deleteAccount}</button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.deleteConfirm}</h3>
            <button onClick={handleDeleteAccount} className="confirm-button">{t.deleteYes}</button>
            <button onClick={() => setDeleteConfirmVisible(false)} className="cancel-button">{t.deleteNo}</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AccountOverview;
