import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../homePage/PropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage';
import CitySection from "./CitySection"; 
import liverpoolVideo from '../assets/liverpool.mp4'; 
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png'; 
import TextToSpeech from '../Components/utils/TextToSpeech';
import CustomAlgorithm from '../customAlgorithm/CustomAlgorithm';
import PropertyCarousel from '../homePage/PropertyCarousel';
import EPCSection from './EPCSection';
import {FaArrowRight} from 'react-icons/fa';

const HomePage = ({ user, language }) => {
  const [customAlgorithmPopUp, setCustomAlgorithmPopUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { fetchTopRatedProperties, topRatedProperties } = useContext(PropertyContext);

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchTopProperties = async () => {
      try {
        fetchTopRatedProperties();
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProperties();
  }, []);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const togglePopUp = () => {
    setCustomAlgorithmPopUp(!customAlgorithmPopUp);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/propertylist?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const clickableArrow = (pageId) => {
    const pageSection = document.getElementById(pageId);
    if(pageSection) {
      pageSection.scrollIntoView({behavior: "smooth"});
    }
  };

  return (
    <>
      {/* 🎥 Video Background Section */}
      <div className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={liverpoolVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🔹 Dark Overlay */}
        <div className="hero-overlay">
          <div className="welcomeText">
            <h1 className="mainMessage">
              {t.welcomeMessage}
            </h1>
            <p className="subMessage">
              {t.subMessage}
            </p>
          </div>

          {/* 🔍 Search Bar */}
          <div className="stylingSearchBar">
            <input
              className="stylingSearchInput"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder={t.searchPlaceholder}
            />
          </div>
            <button className="stylingSearchButton" onClick={handleSearch}>
              {t.searchButton}
            </button>
          
          
          <button className = "scrollingArrow" onClick={() => clickableArrow("cityGrid")}>
            <span className="scrollDownArrow"> {"\u2193"} </span>
          </button>

        </div>
      </div>

{/* About Website Section */}
      <EPCSection  />
      
      


      <pageSection id ="cityGrid">
      {/* City Section */}
      <CitySection language={language} />
      </pageSection>

      <div className="functionality-container">
      <h1 className="functionality-bar-header">Your Essential Property Resources</h1>

      <div className="functionalityBar">
          {/* Column 1 */}
          <div className="functionality-column">
            <div className="functionality-header">
              <span className="functionality-icon heart">{"\u2764"}</span>
              <span className="functionality-title">Want a place to keep your Favourite properties?</span>
            </div>
            <div className="functionality-content">
              <p>{"\u{2B50}"} Never lose track of an amazing, highly efficient property!</p>
              <p>{"\u{1F3E0}"} Add properties to your 'Favourites' and access them with just one click at any time</p>
            </div>
            <a href="#" className="functionality-button">Visit Favourites Page</a>
          </div>

          {/* Column 2 */}
          <div className="functionality-column">
            <div className="functionality-header">
              <span className="functionality-icon">{"\u2709"}</span>
              <span className="functionality-title">Fancy checking out our Group Chats?</span>
            </div>
            <div className="functionality-content">
              <p>{"\u{1F4E2}"} Saved and Share to stay connected!</p>
              <p>{"\u{1F4CC}"} Share properties, discuss options and plan your next 'humble abode' with your friends!</p>
            </div>
            <a href="#" className="functionality-button">Visit Group Chats</a>
          </div>

          {/* Column 3 */}
          <div className="functionality-column">
            <div className="functionality-header">
              <span className="functionality-icon">{"\u2754"}</span>
              <span className="functionality-title">Need help understanding the 'Property Lingo'?</span>
            </div>
            <div className="functionality-content">
              <p>{"\u{1F92F}"} Don't let the professional 'property' jargon stop you from getting your dream property!</p>
              <p>{"\u{1F4DA}"} Learn about property efficiency by visiting our Glossary of Terms, FAQs with tutorials!</p>
            </div>
            <a href="#" className="functionality-button">Visit FAQs</a>
          </div>
      </div>
    </div>

      {/* Custom Algorithm Section */}
      <div className="custom-algorithm-section">
        <img src={require('../assets/property.jpg')} alt="dream-property" className="custom-algorithm-icon" />
        <div className="custm-algorithm-description">
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h2 style={{ display: 'inline-block', marginRight: '10px' }}>
              {t.customAlgorithmTitle}
            </h2>
            <TextToSpeech 
              text={`${t.customAlgorithmTitle}. ${t.customAlgorithmDescription}`} 
              language={language} 
            />
          </div>
          <p>{t.customAlgorithmDescription1}</p>
          <p>{t.customAlgorithmDescription2}</p>
        
          <div>
              <button className="custom-algorithm-button" onClick={togglePopUp}> Take the quiz now!! </button>
                {customAlgorithmPopUp && <CustomAlgorithm closePopUp={togglePopUp}/>}
          </div>
          </div>
        </div>


      
      {/* Top Rated Properties Section */}
      <PropertyCarousel topRatedProperties={topRatedProperties} user={user} language={language} />

      {/* About Website Section */}
      <div className="about-us-section">
        <div className="about-us-section__left">
          <img 
            src={require('../assets/liverpool-houses.jpg')}  
            alt="Property Sky View" 
            className="about-us__image" 
          />
        </div>

        <div className="about-us-section__right">
          <div className="about-us-block">
            <h2> {"\u{1F3E0}"} Your Ideal Energy-Efficient Home Awaits!!</h2>
            <p className="about-us-subtitle">
              <strong>
                Finding your perfect property has never been easier! Whether you are:
              </strong>
            </p>

            <ul className="about-us-list">
              <li> {"\u{1F393}"} A student, professional, or a landlord -- We have got you covered!</li>
              <li> {"\u{1F3C6}"} Wanting accurate EPC ratings to compare properties energy efficiencies</li>
              <li> {"\u{1F50E}"} Using Smart filters to quickly search for your perfect property</li>
              <li> {"\u{1F331}"} Making greener and cost effective housing choices</li>
            </ul>
          </div>

          <div className="about-us-block">
            <h2 className="about-us-button-header"> {"\u{1F4A1}"} Want to find out more?</h2>
            <p> 
              <button className="about-us-page-button">
                Learn More About EPCity
              </button>
            </p>
          </div>
          
        </div>
      </div>    
  </>
  );
};

export default HomePage;
