import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, Router } from 'react-router-dom';
import './App.css';
import profileIcon from './assets/profileicon.png';
import epcLogo from './assets/EPCITY-LOGO-UPDATED.png';
import Login from './Login';
import Register from './Register';
import PropertyFilter from './Components/FilterComponent';
import PropertyList from './Components/PropertyList';
import PropertyPage from './Components/PropertyPage';
import EPCTable from './Components/EPCTable';
import HomePage from './Components/HomePage';
import './Components/HomePage.css';
import { PropertyProvider } from './Components/propertyContext';

function App() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(profileIcon); 
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  
  
 

  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const navigate = useNavigate();

  // Persist language selection in localStorage
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const showLogoutConfirmation = () => {
    setLogoutConfirmVisible(true);
  };

  const handleLogout = () => {
    setUser(null);
    setProfileImage(profileIcon); 
    setDropdownVisible(false);
    setLogoutConfirmVisible(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setLogoutConfirmVisible(false);
  };

  



  return (
    <PropertyProvider>
      <Router>
        <div className="App">
          <div className="header-container">
            <Link to="/">
              <img src={epcLogo} alt="EPCity Logo" className="logo-img" />
            </Link>
            <div className="navigationLinks">
              <a href="/propertylist">View All Properties</a>
            </div>
            <div className="profile-icon" onClick={toggleDropdown}>
              <img src={profileIcon} alt="Profile" className="profile-img" />
              {dropdownVisible && (
                <div className="dropdown-menu">
                  {user ? (
                    <>
                      <p>Welcome, {user.firstname}</p>
                      <Link to="/property">My Properties</Link>
                      <button onClick={showLogoutConfirmation}>Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/register">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {logoutConfirmVisible && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Are you sure you want to log out?</h3>
                <div className="modal-buttons">
                  <button onClick={handleLogout} className="confirm-button">
                    Yes
                  </button>
                  <button onClick={cancelLogout} className="cancel-button">
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          <Routes>
            <Route
              path="/propertylist"
              element={
                <>
                  <div className="search-bar-container">
                    <h3>Search for Properties</h3>
                    <PropertyFilter />
                  </div>
                  <div>
                    <PropertyList />
                  </div>
                  
                </>
              }
            />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/property/:uprn" element={<PropertyPage />} /> {/* New route for property details */}
            <Route path="/propertylist" element={<PropertyList />} />
            <Route path="/property/:address" element={<PropertyPage />} />
            <Route path="/glossary" element={<GlossaryPage />} /> {/* Add glossary route */}
          </Routes>
        </div>
      </Router>
    </PropertyProvider>
  );
};

export default App;
