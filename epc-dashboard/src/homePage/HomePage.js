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
  <EPCSection language={language} />
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
                <span>{t.groupChatsHeader}</span>
              </div>
              <div className="functionality-content">
                <p>{"\u{1F4E2}"} {t.groupChatsInfo1}</p>
                <p>{"\u{1F4CC}"} {t.groupChatsInfo2}</p>
              </div>
              <button className="functionality-button" onClick={handleGroupChatsCheck}>
                {t.visitGroupChats}
              </button>
            </div>

            {/* FAQ Section */}
            <div className="functionality-column">
              <div className="functionality-header">
                <span className="functionality-icon">{"\u2754"}</span>
                <span>{t.propertyLingoHeader}</span>
              </div>
              <div className="functionality-content">
                <p>{"\u{1F92F}"} {t.propertyLingoInfo1}</p>
                <p>{"\u{1F4DA}"} {t.propertyLingoInfo2}</p>
              </div>
              <button className="functionality-button" onClick={() => navigate("/FAQs")}>
                {t.visitFAQsPage}
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
              {t.customAlgorithmSubtitle}
            </div>

            <div className="property-type-sublist"> 
              {t.propertyTypeQuestion}
            </div>

            <ul className="properties-list">
              <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> {t.house}</li>
              <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> {t.apartment}</li>
              <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> {t.bungalow}</li>   
              <li className="property"><span className="ca-icon">{"\u{1F3E0}"}</span> {t.maisonette}</li>   
            </ul>

            <ul className="custom-algorithm-list">
              <li> <strong> {"\u{1F331}"} {t.energyEfficiencyQuestion} </strong> </li>
              <li> <strong> {"\u{1F6CC}"} {t.bedroomsQuestion} </strong> </li>
              <li> <strong> {"\u{1F686}"} {t.travelDistanceQuestion} </strong> </li>
            </ul>

            <div className="custom-algorithm-subtitle">
              {"\u{1F3AF}"} {t.startNow}
            </div>

            <div className="custom-algorithm-button">
              <button className="custom-algorithm-button-homepage" onClick={togglePopUp}> 
                Start Now and Find Your Match!
              </button>

              {customAlgorithmPopUp && <CustomAlgorithm closePopUp={togglePopUp}/>}
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
              <h2> {"\u{1F3E0}"} {t.aboutUsHeader}</h2>
              <p className="about-us-subtitle">
                <strong>{t.aboutUsSubtitle}</strong>
              </p>

              <ul className="about-us-list">
                <li> {"\u{1F393}"} {t.studentProfessionalLandlord}</li>
                <li> {"\u{1F3C6}"} {t.accurateEPCRatings}</li>
                <li> {"\u{1F50E}"} {t.smartFilters}</li>
                <li> {"\u{1F331}"} {t.greenCostEffective}</li>
              </ul>
            </div>

            <div className="about-us-button-block">
              <h2 className="about-us-button-header"> {"\u{1F4A1}"} {t.wantToFindOutMore}</h2>
              <button className="about-us-page-button" onClick={() => navigate("/about-us")}>
                {t.visitAboutUsPage}
              </button>
            </div>
          </div>
        </div>    
      </section>
    </>
  );
};

export default HomePage;
