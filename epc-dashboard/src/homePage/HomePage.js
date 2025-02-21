import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage';
import CitySection from "../homePage/CitySection"; 
import liverpoolVideo from '../assets/liverpool.mp4'; 
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png'; 
import TextToSpeech from '../Components/utils/TextToSpeech';import CustomAlgorithm from '../homePage/CustomAlgorithm';
//import CustomAlgorithmStarRating from '../homePage/StarRatingComponent';
import SliderComponent from '../homePage/SliderComponent';



const HomePage = ({ user, language }) => {
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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/propertylist?search=${encodeURIComponent(searchTerm)}`);
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

          <h1 className = "scrollDownMessage"> Scroll down to find out more </h1>
          <span class="scrollDownArrow"> {"\u2193"} </span>

        </div>
      </div>


      {/* City Section */}
      <CitySection language={language} />

      {/*<CustomAlgorithmStarRating />*/}

      <SliderComponent minValue={1} maxValue={5} process={1} startValue={1}/>

      <CustomAlgorithm />

      {/* Top Rated Properties Section */}
      <div className="top-rated-properties">
        <h2>{t.topRatedProperties}</h2>
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
            {/* Existing content */}
            <button onClick={() => navigate('/customAlgorithm')}>
              Go to Custom Algorithm
            </button>
          </div>
    </>
  );
};

export default HomePage;
