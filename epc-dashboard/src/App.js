import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, Router } from 'react-router-dom';
import './App.css';
import './Components/SearchBar.css';
import profileIcon from './assets/profileicon.png';
import epcLogo from './assets/EPCITY-LOGO-UPDATED.png';
import Login from './login&register/Login';
import Register from './login&register/Register';
import PropertyFilter from './propertySearch/FilterComponent';
import PropertyList from './propertySearch/PropertyList';
import PropertyPage from './Components/propertyPage/PropertyPage';
import EPCTable from './Components/propertyPage/EPCFullTable';
import HomePage from './homePage/HomePage';
import './homePage/HomePage.css';
import FAQs from './FAQ/FAQs';
import GlossaryPage from './FAQ/Glossarypage';
import ForgotPassword from './login&register/ForgotPassword';
import AccountOverview from './login&register/AccountOverview';
import LanguageSelector from './homePage/LanguageSelector';
import VerifyOtp from './login&register/VerifyOtp';
import ResetPassword from './login&register/resetPassword';
import PropertyFinder from './FAQ/PropertyFinder';
import EICalculator from './FAQ/EICalculator';
import Checklist from './FAQ/Checklist';
import SocialMedia from './FAQ/SocialMedia';
import TutorialMenu from './FAQ/TutorialMenu';
import Tutorials from './FAQ/Tutorials';
import translations from './locales/translations_app';
import { PropertyProvider } from './Components/utils/propertyContext';



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

  const t = translations[language] || translations.en; // Load translations

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
        : `http://127.0.0.1:5000/api/property/loadDB`;

      if (query) url += `search=${query}&`;
      if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
      if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch property data');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('There was an error fetching the property data!', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchProfileImage = async () => {
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

      fetchProfileImage();
    }
  }, [user]);

  return (
    <PropertyProvider>
    <div className="App">
      <div className="header-container">
        <Link to="/"><img src={epcLogo} alt="EPCity Logo" className="logo-img" /></Link>
        <div className="navigationLinks">
          <Link to="/propertylist" className="navigation-button">{t.viewAllProperties}</Link>
          <Link to="/FAQs" className="navigation-button">{t.faqs}</Link>
          <Link to="/favourites" className="navigation-button">{t.favourites}</Link>
        </div>
        <div className="header-right">
          <div className="language-selector-container">
            <LanguageSelector setLanguage={handleLanguageChange} language={language} />
          </div>
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src={profileImage} alt="Profile" className="profile-img" />
            {dropdownVisible && (
              <div className="dropdown-menu">
                {user ? (
                  <>
                    <p>Welcome, {user.firstname}</p>
                    <Link to="/account-overview">{t.accountOverview}</Link>
                    <Link to="/property">{t.myProperties}</Link>
                    <button onClick={handleLogout}>{t.logout}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login">{t.login}</Link>
                    <Link to="/register">{t.register}</Link>
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
        <Route path="/" element={<HomePage language={language} />} />
        <Route path="/login" element={<Login setUser={setUser} language={language} />} />
        <Route path="/register" element={<Register language={language} />} />
        <Route path="/property/:uprn" element={<PropertyPage properties={properties} loading={loading} language={language} />} />
        <Route path="/FAQs" element={<FAQs language={language} />} />
        <Route path="/glossary" element={<GlossaryPage language={language} />} />
        <Route path="/account-overview" element={<AccountOverview user={user} setUser={setUser} setProfileImage={setProfileImage} language={language} />} />
        <Route path="/forgot-password" element={<ForgotPassword language={language} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/faq/property-finder" element={<PropertyFinder language={language} />} />
        <Route path="/faq/glossary-page" element={<GlossaryPage language={language} />} />
        <Route path="/faq/budget-calculator" element={<EICalculator language={language} />} />
        <Route path="/faq/checklist" element={<Checklist language={language} />} />
        <Route path="/faq/socialmedia" element={<SocialMedia />} />
        <Route path="/tutorials/:tutorialCategory" element={<TutorialMenu language={language} />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/faq/tutorials" element={<Tutorials language={language} />} />
      </Routes>

      <footer className="footer-container">
        <div className="footer-content">
          <Link to="/"><img src={epcLogo} alt="EPCity Logo" className="logo-img" /></Link>
          <div className="navigationLinks">
            <Link to="/propertylist" className="navigation-button">{t.viewAllProperties}</Link>
            <Link to="/FAQs" className="navigation-button">{t.faqs}</Link>
          </div>
          <nav className="footer-nav">
            <Link to="/about-us">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </nav>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
    </PropertyProvider>
  );
}

export default App;
