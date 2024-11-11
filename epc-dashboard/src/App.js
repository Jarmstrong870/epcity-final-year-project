// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import profileIcon from './assets/profileicon.png';
import epcLogo from './assets/EPCITY-LOGO-UPDATED.png';
import Login from './Login';
import Register from './Register';
import PropertyPage from './Components/PropertyPage';
import EPCTable from './Components/EPCTable'; // Import EPCTable component

function App() {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    setUser(null);
    setDropdownVisible(false);
  };

  return (
    <Router>
      <div className="App">
        <div className="header-container">
          <Link to="/"><img src={epcLogo} alt="EPCity Logo" className="logo-img" /></Link>
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src={profileIcon} alt="Profile" className="profile-img" />
            {dropdownVisible && (
              <div className="dropdown-menu">
                {user ? (
                  <>
                    <p>Welcome, {user.firstname}</p>
                    <Link to="/property">My Properties</Link>
                    <button onClick={handleLogout}>Logout</button>
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

        <Routes>
          <Route path="/" element={<EPCTable />} /> {/* Render EPCTable on the home page */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property" element={<PropertyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
