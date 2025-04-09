import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyCard from '../homePage/PropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage';
import CitySection from "./CitySection"; 
import liverpoolVideo from '../assets/liverpool.mp4'; 
import CustomAlgorithm from '../customAlgorithm/CustomAlgorithm';
import PropertyCarousel from '../homePage/PropertyCarousel';
import EPCSection from './EPCSection';
import AboutUs from '../aboutUs/aboutus';

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
      if (window.location.pathname !== "/") {
        navigate("/?scrollToCustomAlgorithm=true");
      } else {
        setTimeout(() => {
          const homePageSection = document.getElementById("customAlgorithmSection");
          if (homePageSection) {
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
    if (pageSection) {
      pageSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={liverpoolVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay">
          <div className="welcomeText">
            <h1 className="mainMessage">{t.welcomeMessage}</h1>
            <p className="subMessage">{t.subMessage}</p>
          </div>

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
            <span className="scrollDownArrow">↓</span>
          </button>
        </div>
      </div>

      <section className="background-section1">
        <EPCSection language={language} />
      </section>

      <section id="cityGrid" className="background-section2">
        <CitySection language={language} />
      </section>

      <section className="background-section1">
        <div className="functionality-container">
          <h1 className="functionality-bar-header">{t.functionalityHeader}</h1>

          <div className="functionalityBar">
            <div className="functionality-column">
              <div className="functionality-header">
                <span className="functionality-icon heart"></span>
                <span>{t.favouritesHeader}</span>
              </div>
              <div className="functionality-content">
                <p>{t.favouritesLine1}</p>
                <p>{t.favouritesLine2}</p>
              </div>
              <button className="functionality-button" onClick={handleFavouritesCheck}>
                {t.visitFavourites}
              </button>
            </div>

            <div className="functionality-column">
              <div className="functionality-header">
                <span className="functionality-icon"></span>
                <span>{t.groupChatsHeader}</span>
              </div>
              <div className="functionality-content">
                <p>{t.groupChatsInfo1}</p>
                <p>{t.groupChatsInfo2}</p>
              </div>
              <button className="functionality-button" onClick={handleGroupChatsCheck}>
                {t.visitGroupChats}
              </button>
            </div>

            <div className="functionality-column">
              <div className="functionality-header">
                <span className="functionality-icon"></span>
                <span>{t.propertyLingoHeader}</span>
              </div>
              <div className="functionality-content">
                <p>{t.propertyLingoInfo1}</p>
                <p>{t.propertyLingoInfo2}</p>
              </div>
              <button className="functionality-button" onClick={() => navigate("/FAQs")}>
                {t.visitFAQsPage}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="background-section2" id="customAlgorithmSection">
        <div className="custom-algorithm-section">
          <div className="custom-algorithm-left">
            <img src={require('../assets/property.jpg')} alt="dream-property" className="custom-algorithm-icon" />
          </div>

          <div className="custom-algorithm-right">
            <h2 className="custom-algorithm-title">{t.customAlgorithmTitle}</h2>
            <div className="custom-algorithm-subtitle">{t.customAlgorithmSubtitle}</div>
            <div className="property-type-sublist">{t.propertyTypeQuestion}</div>

            <ul className="properties-list">
              <li className="property">{t.house}</li>
              <li className="property">{t.apartment}</li>
              <li className="property">{t.bungalow}</li>
              <li className="property">{t.maisonette}</li>
            </ul>

            <ul className="custom-algorithm-list">
              <li><strong>{t.energyEfficiencyQuestion}</strong></li>
              <li><strong>{t.bedroomsQuestion}</strong></li>
              <li><strong>{t.travelDistanceQuestion}</strong></li>
            </ul>

            <div className="custom-algorithm-subtitle">
              {t.startNow}
            </div>

            <div className="custom-algorithm-button">
              <button className="custom-algorithm-button-homepage" onClick={togglePopUp}>
                {t.startNowButton}
              </button>

              {customAlgorithmPopUp && <CustomAlgorithm closePopUp={togglePopUp} />}
            </div>
          </div>
        </div>
      </section>

      <section className="background-section1">
        <PropertyCarousel topRatedProperties={topRatedProperties} user={user} language={language} />
      </section>

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
              <h2>{t.aboutUsHeader}</h2>
              <p className="about-us-subtitle">
                <strong>{t.aboutUsSubtitle}</strong>
              </p>

              <ul className="about-us-list">
                <li>{t.studentProfessionalLandlord}</li>
                <li>{t.accurateEPCRatings}</li>
                <li>{t.smartFilters}</li>
                <li>{t.greenCostEffective}</li>
              </ul>
            </div>

            <div className="about-us-button-block">
              <h2 className="about-us-button-header">{t.wantToFindOutMore}</h2>
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
