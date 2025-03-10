import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage';
import CitySection from "../homePage/CitySection"; 
import liverpoolVideo from '../assets/liverpool.mp4'; 
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png'; 
import TextToSpeech from '../Components/utils/TextToSpeech';
import CustomAlgorithm from '../customAlgorithm/CustomAlgorithm';

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
            <button className="stylingSearchButton" onClick={handleSearch}>
              {t.searchButton}
            </button>
          </div>
          
          <button className = "scrollingArrow" onClick={() => clickableArrow("cityGrid")}>
            <span class="scrollDownArrow"> {"\u2193"} </span>
          </button>

        </div>
      </div>

{/* About Website Section */}
<div className="about-website">
        <img 
          src={require('../assets/liverpool-houses.jpg')} 
          alt="Liverpool" 
          className="about-image" 
        />
        <div className="content">
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h2 style={{ display: 'inline-block', marginRight: '10px' }}>
              {t.epcInformation}
            </h2>
            <TextToSpeech 
              text={`${t.epcInformation}. ${t.epcInformationDescription1} ${t.epcInformationDescription2}`} 
              language={language} 
            />
          </div>
          <p>{t.epcInformationDescription1}</p>
          <p>{t.epcInformationDescription2}</p>
          </div>
        </div>
      <div>
    </div>


      <pageSection id ="cityGrid">
      {/* City Section */}
      <CitySection language={language} />
      </pageSection>

      {/* Custom Algorithm Section */}
      <div className="custom-algorithm-section">
        <img src={require('../assets/dream property.jpg')} alt="dream-property" className="custom-algorithm-icon" />
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
          <p>{t.customAlgorithmDescription}</p>
        
          <div>
              <button className="custom-algorithm-button" onClick={togglePopUp}> Go to Custom Algorithm </button>
                {customAlgorithmPopUp && <CustomAlgorithm closePopUp={togglePopUp}/>}
          </div>
          </div>
        </div>


      
      {/* Top Rated Properties Section */}
      <div className="most-efficient-properties">
        <h2>{t.mostEfficientProperties}</h2>
        <div className="property-grid">
          {topRatedProperties.map((property, index) => (
            <TopRatedPropertyCard key={index} user={user} property={property} language={language} />
          ))}
        </div>
      </div>

      {/* About Website Section */}
      <div className="about-website">
        <img 
          src={require('../assets/liverpool-houses.jpg')} 
          alt="Liverpool" 
          className="about-image" 
        />
        <div className="content">
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h2 style={{ display: 'inline-block', marginRight: '10px' }}>
              {t.aboutUsTitle}
            </h2>
            <TextToSpeech 
              text={`${t.aboutUsTitle}. ${t.aboutUsDescription1} ${t.aboutUsDescription2}`} 
              language={language} 
            />
          </div>
          <p>{t.aboutUsDescription1}</p>
          <p>{t.aboutUsDescription2}</p>
          </div>
        </div>
      <div>
    </div>
  </>
  );
};

export default HomePage;
