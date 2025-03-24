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
import TermsAndConditions from './Components/TermsAndConditions';
import AboutUs from './aboutUs/aboutus';
import CustomAlgorithm from './customAlgorithm/CustomAlgorithm';
import LandlordDashboard from './login&register/LandlordDashboard';
import TextToSpeech from './Components/utils/TextToSpeech'; // Import the TextToSpeech component

function App() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(profileIcon);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [showPopUp, setPopUpStatus] = useState(false);
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
    console.log("button displayed");
  };

  const popUpMessageStatus = (e, userMessage) => {
    e.preventDefault();
    setPopUpMessage(userMessage);
    setPopUpStatus(true);
    setTimeout(() => setPopUpStatus(false), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    setProfileImage(profileIcon);
    setDropdownVisible(false);
    setLogoutConfirmVisible(false);
    setTimeout(() => {
      window.alert(t.logoutConfirmation);  // Translated text
      navigate('/');
    }, 1000);
  };

  const cancelLogout = () => {
    setLogoutConfirmVisible(false);
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
          {logoutConfirmVisible && (
            <div className="logout-confirmation-modal">
              <div className="logout-modal-content">
                <p>{t.logoutConfirmation}</p> {/* Translated text */}
                <div className="modal-buttons">
                  <button onClick={handleLogout} className="confirm-button">{t.yes}</button> {/* Translated text */}
                  <button onClick={cancelLogout} className="cancel-button">{t.no}</button> {/* Translated text */}
                </div>
              </div>
            </div>
          )}

          {showPopUp && (
            <div className="popupMessage">
              {popUpMessage}
            </div>
          )}
          
          <div className={`header-container ${isHomePage ? (isScrolled ? "scrolled" : "transparent") : "scrolled"}`}>
            <div className="header-base">
            <div className="logo-container">
              <Link to="/"><img src={epcLogo} alt="EPCity Logo" className="logo-img" /></Link>
            </div>
              
              {isScrolled && (
                <div className="header-navigation-links">
                  <Link to="/propertylist" className="navigation-button">{t.viewAllProperties}</Link>
                  <Link to="/FAQs" className="navigation-button">{t.faqs}</Link>

                {user ? (
                  <Link to="/favourites" className="navigation-button">{t.favourites}</Link>
                ) : (
                  <a href = "#" 
                     className="navigation-button" 
                     onClick={(e) => popUpMessageStatus(e, "Please login to view My Favourites")}
                  >{t.favourites}
                  </a>
                )}

                {user ? (
                  <Link to="/custom-algorithm" className="navigation-button">My Property Finder</Link>
                ) : (
                  <a href = "#" 
                     className="navigation-button" 
                     onClick={(e) => popUpMessageStatus(e, "Please login to use my Property Finder")}
                  >My Property Finder
                  </a>
                )}

                {user ? (
                  <Link to="/messages" className="navigation-button">My Group Chats</Link>
                ) : (
                  <a href = "#" 
                     className="navigation-button" 
                     onClick={(e) => popUpMessageStatus(e, "Please login to use My Group Chats")}
                  >My Group Chats
                  </a>
                )}  
              </div>
            )}
            
          
            <div className="header-right">
              {/* Add TextToSpeech toggle button here before language selector */}
              <div className="language-selector-container">
                <LanguageSelector setLanguage={handleLanguageChange} language={language} />
              </div>

              <div className="profile-icon" onClick={toggleDropdown}>
                <img src={profileImage} alt="Profile" className="profile-img" />
                {dropdownVisible && (
                  <div className="dropdown-menu">
                    {user ? (
                      <>
                        <p className="welcome-message">{t.welcomeMessage} {user.firstname}</p> {/* Translated text */}
                        {user.typeUser === "landlord" && (
                          <Link to="/landlord-dashboard">{t.landlordView}</Link> 
                        )}
                        <Link to="/account-overview">{t.accountOverview}</Link>
                        {user.typeUser === "landlord" && (
                          <Link to="/favourites">{t.savedProperties}</Link> 
                        )}
                        {user.typeUser !== "landlord" && (
                          <Link to="/favourites">{t.favouritedProperties}</Link> 
                        )}
                        <Link to="/messages">{t.messages}</Link>

                        {/* Add TextToSpeech toggle just above Logout */}
                        <div className="tts-toggle-container" onClick={(e) => e.stopPropagation()}>
                          <TextToSpeech text={t.epcInformation} language={language} />
                        </div>

                        <button onClick={showLogoutConfirmation} className="logout-button">
                          {t.logout}
                        </button>
                        <p 
                          className={`user-role-label ${
                            user.isAdmin 
                              ? 'user-role-label-admin' 
                              : user.typeUser === 'landlord' 
                                ? 'user-role-label-landlord' 
                                : 'user-role-label-student'
                          }`}
                        >
                          {user.isAdmin 
                            ? t.adminUser 
                            : user.typeUser === 'landlord' 
                              ? t.landlordUser 
                              : t.studentUser
                          }
                        </p>
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

          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage user={user} language={language} />} />
            <Route path="/propertylist" element={
              <>
                <PropertyFilter language={language} setLoading={setLoading} />
                <PropertyList user={user} properties={properties} loading={loading} language={language} />
              </>
            } />
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
            <Route path="/landlord-dashboard" element={<LandlordDashboard user={user}/>} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/custom-algorithm" element={<CustomAlgorithm />} />
          </Routes>

          {/* Footer */}
          <footer className="footer-container">
            <div className="footer-content">
              {/* ===== Column 1: Brand/Logo ===== */}
              <div className="footer-column footer-brand">
                <Link to="/">
                  <img src={epcLogo} alt="EPCity Logo" className="footer-logo" />
                </Link>
                <p className="footer-tagline">
                  {t.shortTagline || "Find your perfect place with EPCity."} {/* Translated text */}
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
