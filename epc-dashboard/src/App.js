import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import profileIcon from './assets/profileicon.png';
import epcLogo from './assets/EPCITY-LOGO-UPDATED.png';
import Login from './Login';
import Register from './Register';
import PropertyFilter from './Components/FilterComponent';
import PropertyList from './Components/PropertyList';
import PropertyPage from './Components/PropertyPage';
import GlossaryPage from './Components/Glossarypage';
import HomePage from './Components/HomePage';
<<<<<<< HEAD
import './Components/HomePage.css';
import FAQs from './Components/FAQs';
import GlossaryPage from './Components/Glossarypage';
import Tutorials from './Components/Tutorials';
import EICalculator from './Components/EICalculator';
import Checklist from './Components/Checklist';
import SocialMedia from './Components/Social Media';
import PropertyFinder from './Components/PropertyFinder';
import TutorialMenu  from './Components/TutorialMenu';
=======
import ForgotPassword from './Components/ForgotPassword';
import AccountOverview from './Components/AccountOverview';
import LanguageSelector from './Components/LanguageSelector';
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d

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

  const fetchProperties = async (query = '', propertyTypes = [], epcRatings = [], pageNumber, sortValue) => {
    setLoading(true);

    try {
      let url = query || propertyTypes.length || epcRatings.length 
        ? `http://127.0.0.1:5000/api/property/alter?` 
        : `http://127.0.0.1:5000/api/property/loadCSV`;

      if (query) url += `search=${query}&`;
      if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
      if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch property data');
      const data = await response.json();
      setProperties(data);

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
      fetchProfileImage();
    }
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
<<<<<<< HEAD
    <Router>
      <div className="App">
        <div className="header-container">
          <Link to="/"><img src={epcLogo} alt="EPCity Logo" className="logo-img" /></Link>
          <div className="navigationLinks">
            <Link to="/propertylist" className="navigation-button">View All Properties</Link>
            <Link to="/FAQs" className="navigation-button">Frequently Asked Questions</Link>
=======
    <div className="App">
      <div className="header-container">
        <Link to="/">
          <img src={epcLogo} alt="EPCity Logo" className="logo-img" />
        </Link>
        <div className="navigationLinks">
          <a href="/propertylist">View All Properties</a>
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
        </div>
        <div className="header-right">
          <LanguageSelector setLanguage={handleLanguageChange} language={language} />
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src={profileImage} alt="Profile" className="profile-img" />
            {dropdownVisible && (
              <div className="dropdown-menu">
                {user ? (
                  <>
                    <p>Welcome, {user.firstname}</p>
                    <Link to="/account-overview">Account Overview</Link>
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

<<<<<<< HEAD
        <Routes>
          <Route
            path="/propertylist"
            element={
              <>
                <div className="search-bar-container">
                  <PropertyFilter onFilterChange={fetchProperties} />
                </div>
                {/*<EPCTable />*/}
                <PropertyList properties={properties} loading={loading} />
              </>
            }
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:uprn" element={<PropertyPage />} /> {/* New route for property details */}
          <Route path="/propertylist" element={<PropertyList />} />
          <Route path="/property/:address" element={<PropertyPage />} />
          <Route path="/FAQs" element={<FAQs/>} />
          <Route path="/faq/glossary-page" element={<GlossaryPage/>} />
          <Route path="/faq/tutorials" element={<Tutorials/>} />
          <Route path="/faq/property-finder" element={<PropertyFinder/>} />
          <Route path="/faq/environmental-impact-calculator" element={<EICalculator/>} />
          <Route path="/faq/checklist" element={<Checklist/>} />
          <Route path="/faq/socialmedia" element={<SocialMedia/>} />
          <Route path="/tutorials/:tutorialCategory" element={<TutorialMenu/>} />
        </Routes>
      </div>
    </Router>
=======
      <Routes>
        <Route
          path="/propertylist"
          element={
            <>
              <div className="search-bar-container">
                <h3>Search for Properties</h3>
                <PropertyFilter onFilterChange={fetchProperties} language={language} />
              </div>
              <PropertyList properties={properties} loading={loading} language={language} />
            </>
          }
        />
        <Route path="/" element={<HomePage fetchProperties={fetchProperties} language={language} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/property/:uprn"
          element={<PropertyPage properties={properties} loading={loading} language={language} />}
        />
        <Route path="/glossary" element={<GlossaryPage language={language} />} />
        <Route
          path="/account-overview"
          element={<AccountOverview user={user} setUser={setUser} setProfileImage={setProfileImage} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<resetPassword />} />
      </Routes>
    </div>
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
  );
}

export default App;
