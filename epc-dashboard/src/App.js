import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import './Components/SearchBar.css';
import profileIcon from './assets/profileicon.png';
import epcLogo from './assets/EPCITY-LOGO-UPDATED.png';
import Login from './login&register/Login';
import Register from './login&register/Register';
import PropertyFilter from './propertySearch/FilterComponent';
import PropertyList from './propertySearch/PropertyList';
import PropertyPage from './Components/propertyPage/PropertyPage';
import EPCTable from './Components/propertyPage/EPCFullTable/EPCFullTable';
import HomePage from './homePage/HomePage';
import './homePage/HomePage.css';
import FAQs from './FAQ/FAQs';
import GlossaryPage from './FAQ/Glossarypage';
import ForgotPassword from './login&register/ForgotPassword';
import AccountOverview from './login&register/AccountOverview';
import LanguageSelector from './homePage/LanguageSelector';
import VerifyOtp from './login&register/VerifyOtp';
import ResetPassword from './login&register/resetPassword';
import Checklist from './FAQ/Checklist';
import TutorialMenu from './FAQ/TutorialMenu';
import Tutorials from './FAQ/Tutorials';
import translations from './locales/translations_app';
import Messages from './login&register/messages'; 
import FavouritePage from './Components/FavouritePage';
import { PropertyProvider } from './Components/utils/propertyContext';
import { FavouriteProvider } from './Components/utils/favouriteContext';
import ComparePage from './Components/ComparePage';
import PrivacyPolicy from './Components/PrivacyPolicy';
import AdminDashboard from './login&register/AdminDashboard'; 
import { useLocation } from "react-router-dom"; // Import to detect current page
import Aboutus from './aboutUs/aboutus';
import TermsAndConditions from './Components/TermsAndConditions';
import AboutUs from './aboutUs/aboutus';


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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // Get current page path
  const isHomePage = location.pathname === "/"; // Check if on home page

  const t = translations[language] || translations.en; // Load translations;

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

  useEffect(() => {
    if (isHomePage) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50); // If scrolled more than 50px, change header
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      setIsScrolled(true); // Keep the header dark on all other pages
    }
  }, [isHomePage]);

  return (
    <PropertyProvider>
      <FavouriteProvider user={user}>
        <div className="App">
          <div className={`header-container ${isHomePage ? (isScrolled ? "scrolled" : "transparent") : "scrolled"}`}>
            <div className={`logo-container ${isHomePage ? (isScrolled ? "scrolled" : "transparent") : "scrolled"}`}>
              <Link to="/"><img src={epcLogo} alt="EPCity Logo" className="logo-img" /></Link>      
              {isScrolled && (
              <div className="header-navigation-links">
              <Link to="/propertylist" className="navigation-button">{t.viewAllProperties}</Link>
              <Link to="/FAQs" className="navigation-button">{t.faqs}</Link>
              <Link to="/favourites" className="navigation-button">{t.favourites}</Link>
            </div>
            )}          
            </div>
          
            <div className="header-right">
              <div className="language-selector-container">
                <LanguageSelector setLanguage={handleLanguageChange} language={language} />
              </div>
              {console.log("user object:", JSON.stringify(user, null, 2))}

              <div className="profile-icon" onClick={toggleDropdown}>
                <img src={profileImage} alt="Profile" className="profile-img" />
                {dropdownVisible && (
                  <div className="dropdown-menu">

   
                    {user ? (
                      <>
                        <p className="welcome-message">Welcome, {user.firstname}</p>

                        {user.isAdmin === true && (
                          <Link to="/admin-dashboard">Admin Dashboard</Link>
                        )}
                        <Link to="/account-overview">{t.accountOverview}</Link>
                        <Link to="/property">{t.myProperties}</Link>
                        <Link to="/messages">{t.messages}</Link>

                        <button onClick={showLogoutConfirmation} className="logout-button">
                          {t.logout}
                        </button>
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
            <div className="logoutdispla-overlay">
              <div className="logoutdispla">
                <h3>{t.logoutConfirmation}</h3>
                <div className="logoutdispla-buttons">
                  <button onClick={handleLogout} className="confirm-button">{t.yes}</button>
                  <button onClick={cancelLogout} className="cancel-button">{t.no}</button>
                </div>
              </div>
            </div>
          )}

          <Routes>
            <Route
              path="/propertylist"
              element={
                <>
                  <PropertyFilter onFilterChange={fetchProperties} language={language} />
                  <PropertyList user={user} properties={properties} loading={loading} language={language} />
                </>
              }
            />
            <Route path="/" element={<HomePage user={user} language={language} />} />
            <Route path="/login" element={<Login setUser={setUser} language={language} />} />
            <Route path="/register" element={<Register language={language} />} />
            <Route path="/property/:uprn" element={<PropertyPage properties={properties} user={user} language={language} />} />
            <Route path="/FAQs" element={<FAQs language={language} />} />
            <Route path="/faq/glossary-page" element={<GlossaryPage language={language} />} />
            <Route path="/account-overview" element={<AccountOverview user={user} setUser={setUser} setProfileImage={setProfileImage} language={language} />} />
            <Route path="/forgot-password" element={<ForgotPassword language={language} />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/faq/checklist" element={<Checklist language={language} />} />
            <Route path="/tutorials/:tutorialCategory" element={<TutorialMenu language={language} />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/faq/tutorials" element={<Tutorials language={language} />} />
            <Route path="/favourites" element={<FavouritePage user={user} language={language} />} />
            <Route path="/compare-results" element={<ComparePage language={language} />} />
            <Route path="/messages" element={<Messages user={user} language={language} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy language={language} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about-us" element={<AboutUs />} />
           <Route path="/terms" element={<TermsAndConditions />} />
          </Routes>


        
          <footer className="footer-container">
            <div className="footer-content">
              {/* ===== Column 1: Brand/Logo ===== */}
              <div className="footer-column footer-brand">
                <Link to="/">
                  <img src={epcLogo} alt="EPCity Logo" className="footer-logo" />
                </Link>
                {/* Optionally, a short tagline or brand message */}
                <p className="footer-tagline">
                  {t.shortTagline || "Find your perfect place with EPCity."}
                </p>
              </div>

              {/* ===== Column 2: Quick Navigation Links ===== */}
              <div className="footer-column footer-links">
                <h4 className="footer-column-title">{t.navigation || "Navigation"}</h4>
                <Link to="/propertylist" className="footer-link">
                  {t.viewAllProperties}
                </Link>
                <Link to="/FAQs" className="footer-link">
                  {t.faqs}
                </Link>
                <Link to="/favourites" className="footer-link">
                  {t.favourites}
                </Link>
              </div>

              {/* ===== Column 3: Company/Info Pages ===== */}
              <div className="footer-column footer-info">
                <h4 className="footer-column-title">
                  {t.companyInfo || "Company"}
                </h4>
                <Link to="/about-us" className="footer-link">
                  {t.footerAboutUs}
                </Link>
                <Link to="/contact" className="footer-link">
                  {t.footerContact}
                </Link>
                <Link to="/privacy-policy" className="footer-link">
                  {t.footerPrivacyPolicy}
                </Link>
                <Link to="/terms" className="footer-link">
                  {t.footerTerms}
                </Link>
              </div>

              {/* ===== Column 4: Social & Contact ===== */}
              <div className="footer-column footer-social">
                <h4 className="footer-column-title">
                  {t.stayConnected || "Stay Connected"}
                </h4>

                <div className="footer-socials">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {t.socialFacebook}
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {t.socialTwitter}
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {t.socialInstagram}
                  </a>
                </div>

                <a href="mailto:contact@epcity.co.uk" className="footer-email">
                  {t.footerEmail}
                </a>
              </div>
            </div>
          </footer>
        </div>
      </FavouriteProvider>
    </PropertyProvider>
  );
}

export default App;
