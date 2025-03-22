import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import PropertyCard from '../homePage/PropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage';
import CitySection from "./CitySection"; 
import liverpoolVideo from '../assets/liverpool.mp4'; 
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png'; 
import CustomAlgorithm from '../customAlgorithm/CustomAlgorithm';
import PropertyCarousel from '../homePage/PropertyCarousel';
import EPCSection from './EPCSection';
import AboutUs from '../aboutUs/aboutus';
//import FAQs from '../FAQ/FAQ';

const HomePage = ({ user, language }) => {
  const [customAlgorithmPopUp, setCustomAlgorithmPopUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
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

    if (location.search.includes("scrollToCustomAlgorithm=true")) {
      console.log("Redirect detected!"); // ✅ Debugging
  
      if (window.location.pathname !== "/") {
        console.log("Redirecting back to home...");
        navigate("/?scrollToCustomAlgorithm=true");
      } else {
        setTimeout(() => {
          const homePageSection = document.getElementById("customAlgorithmSection");
          if (homePageSection) {
            console.log("Scrolling to section...");
            homePageSection.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              setCustomAlgorithmPopUp(true);
            }, 400);
          }
        }, 300);
      }
    }
  }, [location, navigate]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFavouritesCheck = () => {
    navigate(user ? "/favourites" : "/login");
  };

  const handleGroupChatsCheck = () => {
    navigate(user ? "/messages" : "/login");
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
            <h1 className="mainMessage">{t.welcomeMessage}</h1>
            <p className="subMessage">{t.subMessage}</p>
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

          <button className="scrollingArrow" onClick={() => clickableArrow("cityGrid")}>
            <span className="scrollDownArrow"> {"\u2193"} </span>
          </button>
        </div>
      </div>

{/* About Website Section */}
    <section className="background-section1">
      <EPCSection  />
    </section>  
      


      <section id ="cityGrid" className="background-section2">
      {/* City Section */}
      <CitySection language={language} />
      </section>

    <section className="background-section1">
      <div className="functionality-container">
      <h1 className="functionality-bar-header">Your Essential Property Resources</h1>

      <div className="functionalityBar">
          {/* Favouriting Section */}
          <div className="functionality-column">
            <div className="functionality-header">
              <span className="functionality-icon heart">{"\u2661"}</span>
              <span>Want a place to keep your Favourite properties?</span>
            </div>
            <div className="functionality-content">
              <p>{"\u{2B50}"} Never lose track of an amazing, highly efficient property!</p>
              <p>{"\u{1F3E0}"} Add properties to your 'Favourites' and access them with just one click at any time</p>
            </div>
            <button className="functionality-button" onClick={handleFavouritesCheck}>
              Visit Favourites Page
            </button>
          </div>

          {/* Group Chat Section */}
          <div className="functionality-column">
            <div className="functionality-header">
              <span className="functionality-icon">{"\u2709"}</span>
              <span>Fancy checking out our Group Chats?</span>
            </div>
            <div className="functionality-content">
              <p>{"\u{1F4E2}"} Saved and Share to stay connected!</p>
              <p>{"\u{1F4CC}"} Share properties, discuss options and plan your next 'humble abode' with your friends!</p>
            </div>
            <button className="functionality-button" onClick={handleGroupChatsCheck}>
              Visit Group Chats
            </button>
          </div>

          {/* FAQ Section */}
          <div className="functionality-column">
            <div className="functionality-header">
              <span className="functionality-icon">{"\u2754"}</span>
              <span>Need help understanding the 'Property Lingo'?</span>
            </div>
            <div className="functionality-content">
              <p>{"\u{1F92F}"} Don't let the professional 'property' jargon stop you from getting your dream property!</p>
              <p>{"\u{1F4DA}"} Learn about property efficiency by visiting our Glossary of Terms, FAQs with tutorials!</p>
            </div>
            <button className="functionality-button" onClick={() => navigate("/FAQs")}>
              Visit FAQs Page
            </button>
          </div>
        </div>
      </div>
    </section>  

      {/* Custom Algorithm Section */}
    <section className="background-section2">
      <div className="custom-algorithm-section">
        <div className="custom-algorithm-left">
          <img src={require('../assets/property.jpg')} alt="dream-property" className="custom-algorithm-icon" />
        </div>

      <div className="custom-algorithm-right">
            <h2 className="custom-algorithm-title">
              {t.customAlgorithmTitle}

              <div className="custom-algorithm-subtitle">
                Tells us what matters most to you, and let our smart algorithm match you with your Perfect Property!
              </div>

            </h2>

            <div className="property-type-sublist"> 
              {"\u{1F446}"} What type of property are you looking for?  
            </div>

                <ul className="properties-list">
                  <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> House </li>
                  <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> Apartment </li>
                  <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> Bungalow </li>   
                  <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> Maisonette</li>   
                </ul>

              <ul className="custom-algorithm-list">
                <li> <strong> {"\u{1F331}"}  How important to you is a property's energy efficiency? </strong> </li>
                <li> <strong> {"\u{1F6CC}"}  How many bedrooms do you need? </strong> </li>
                <li> <strong> {"\u{1F686}"} How far do you want to travel for university? </strong> </li>
              </ul>

            <div className="custom-algorithm-subtitle">
              {"\u{1F3AF}"} Start Now and discover your perfect property - it is that quick and easy!

            <div className="custom-algorithm-button">
              <button className="button" onClick={togglePopUp}> 
                Start Now and Find Your Match!
              </button>

                {customAlgorithmPopUp && <CustomAlgorithm closePopUp={togglePopUp}/>}
                </div>
          </div>
          </div>
        </div>
      </section>


      
      {/* Top Rated Properties Section */}
    <section className="background-section1">
      <PropertyCarousel topRatedProperties={topRatedProperties} user={user} language={language} />
    </section>

      {/* About Website Section */}
    <section className="background-section2">
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

          <div className="about-us-button-block">
            <h2 className="about-us-button-header"> {"\u{1F4A1}"} Want to find out more?</h2>
            <p> 
            <button className="about-us-page-button" onClick={() => navigate("/about-us")}>
              Visit Our About Us Page
            </button>
            </p>
          </div>
          
        </div>
      </div>    
    </section>
  </>
  );
};

export default HomePage;
