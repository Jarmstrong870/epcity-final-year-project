import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Routes, Route, Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // For navigation
import './App.css';
import profileIcon from './assets/profileicon.png';
import epcLogo from './assets/EPCITY-LOGO-UPDATED.png';
import Login from './Login';
import Register from './Register';
import PropertyFilter from './Components/FilterComponent';
import PropertyList from './Components/PropertyList';
import PropertyPage from './Components/PropertyPage';
import GlossaryPage from './Components/Glossarypage';
import EPCTable from './Components/EPCTable';
import HomePage from './Components/HomePage';
import './Components/HomePage.css';
import AccountOverview from './Components/AccountOverview';

function App() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(profileIcon); // State for the profile image
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const showLogoutConfirmation = () => {
    setLogoutConfirmVisible(true);
  };

  const handleLogout = () => {
    setUser(null);
    setProfileImage(profileIcon); // Reset to default image
    setDropdownVisible(false);
    setLogoutConfirmVisible(false);
  };

  const cancelLogout = () => {
    setLogoutConfirmVisible(false);
  };

  // Function to fetch properties from backend
  const fetchProperties = async (query = '', propertyTypes = [], epcRatings = [], pageNumber, sortValue) => {
    setLoading(true);
  
    try {
      // Build the property search URL
      let url = query || propertyTypes.length || epcRatings.length 
        ? `http://127.0.0.1:5000/api/property/alter?` 
        : `http://127.0.0.1:5000/api/property/loadCSV`;
  
      if (query) url += `search=${query}&`;
      if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
      if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
  
      // Fetch property search results
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch property data');
      const data = await response.json();
      setProperties(data);
  
      // Build and fetch paginated results
      const pageUrl = `http://127.0.0.1:5000/api/property/paginate?pageNumber=${pageNumber}`;
      const pageResponse = await fetch(pageUrl);
      if (!pageResponse.ok) throw new Error('Failed to fetch pagination data');
      const pageData = await pageResponse.json();
      setProperties(pageData);

      const sortUrl = `http://127.0.0.1:5000/api/property/sort?attribute=${sortValue}`;
      const sortResponse = await fetch(sortUrl);
      if (!sortResponse.ok) throw new Error('Failed to fetch sort data');
      const sortData = await sortResponse.json();
      setProperties(sortData);
      
    } catch (error) {
      console.error('There was an error fetching the property data!', error);
    } finally {
      setLoading(false);
    }
  };
//if user is logged in, get current profile image.
   const fetchProfileImage = async () => {
    if (!user || !user.email) return;

    try {
      const response = await fetch(`http://localhost:5000/get-user/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.profile_image_url || profileIcon);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileImage(); // Fetch the profile image when the user logs in/ page loads
    }
  }, [user]);

  
  useEffect(() => {
    fetchProperties();
  }, []);
  



  return (

    <div className="App">
      <div className="header-container">
        <Link to="/"><img src={epcLogo} alt="EPCity Logo" className="logo-img" /></Link>
        <div className="navigationLinks">
          <a href="/propertylist">View All Properties</a>
        </div>
        <div className="profile-icon" onClick={toggleDropdown}>
          <img src={profileImage} alt="Profile" className="profile-img" />
          {dropdownVisible && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <p>Welcome, {user.firstname}</p>
                  <Link to="/account-overview">Account Overview</Link>
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
                <PropertyFilter onFilterChange={fetchProperties} />
              </div>
              <PropertyList properties={properties} loading={loading} />
            </>
          }
        />
        <Route path="/" element={<HomePage fetchProperties={fetchProperties} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/property/:uprn" element={<PropertyPage />} />
        <Route path="/propertylist" element={<PropertyList />} />
        <Route path="/property/:address" element={<PropertyPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/account-overview" element={<AccountOverview user={user} setUser={setUser} setProfileImage={setProfileImage}/>} />
      </Routes>
    </div>
  );
}

export default App;


