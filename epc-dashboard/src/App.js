import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import profileIcon from './assets/profileicon.png';
import epcLogo from './assets/EPCITY-LOGO-UPDATED.png';
import Login from './Login';
import Register from './Register';
import SearchBar from './Components/SearchBarComponent';
import PropertyList from './Components/PropertyList';

function App() {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Function to fetch properties from backend
  const fetchProperties = (query = '') => {
    setLoading(true);
    const url = query
      ? `http://127.0.0.1:5000/api/property/search?query=${query}`
      : 'http://127.0.0.1:5000/api/property/loadCSV';

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
      })
      .catch((error) => {
        console.error('There was an error fetching the property data!', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load properties when the component is mounted
  useEffect(() => {
    fetchProperties();
  }, []);

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

        <div className='search-bar'>
          <h3>Search for Properties</h3>
          <SearchBar onSearch={fetchProperties} />
          <PropertyList properties={properties} loading={loading} />
        </div>

        <div className="table-container">
          <h2>Table Area</h2>
          <div className="table-border">
            <table>
              <thead>
                <tr>
                  <th>Header 1</th>
                  <th>Header 2</th>
                  <th>Header 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Row 1 Col 1</td>
                  <td>Row 1 Col 2</td>
                  <td>Row 1 Col 3</td>
                </tr>
                <tr>
                  <td>Row 2 Col 1</td>
                  <td>Row 2 Col 2</td>
                  <td>Row 2 Col 3</td>
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

