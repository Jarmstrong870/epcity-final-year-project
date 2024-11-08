import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import profileIcon from './assets/profileicon.png'; // Adjust path as needed
import Login from './Login'; // Make sure these paths are correct
import Register from './Register';
import PropertyPage from './Components/PropertyPage'; // Add the PropertyPage import

function App() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <Router>
      <div className="App">
        <div className="header-container">
          <h1 className="app-title">EP<i>City</i></h1>
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src={profileIcon} alt="Profile" className="profile-img" />
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>

        <nav className="navbar">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property" element={<PropertyPage />} /> {/* Add the route for PropertyPage */}
        </Routes>

        <div className="table-container">
          <h2>Property Information</h2>
          <div className="table-border">
            <table>
              <tbody>
                <tr>
                  <td>
                    {/* Pass the address as state to PropertyPage */}
                    <Link to="/property" state={{ address: "44 Gladstone Court, Spring Drive SG2 8AY" }}>
                      30 Sep 2024
                    </Link>
                  </td>
                  <td>
                    <Link to="/property" state={{ address: "44 Gladstone Court, Spring Drive SG2 8AY" }}>
                      44 Gladstone Court, Spring Drive SG2 8AY
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
