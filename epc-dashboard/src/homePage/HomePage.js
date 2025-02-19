import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage';
import CitySection from "../homePage/CitySection"; 
import liverpoolVideo from '../assets/liverpool.mp4'; 
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png'; 


const HomePage = ({ user, language }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { fetchTopRatedProperties, topRatedProperties, fetchProperties } = useContext(PropertyContext);

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
          {/* 🔹 Logo & Header Overlay */}

          {/* 🔹 Welcome Text */}
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
            <button className="stylingSearchButton" onClick={handleSearch}>
              {t.searchButton}
            </button>
          </div>
        </div>
      </div>

      {/* City Section */}
      <CitySection />

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
          <h2>A bit about us..</h2>
          <p>
            EPCity is designed to help you find your perfect property in Liverpool. 
            Whether you're a student, professional, or a landlord, we offer an intuitive 
            platform to search, compare, and evaluate which property is right for you in Liverpool.
          </p>
          <p>Use our search bar above to get started or explore some of Liverpool's top-rated properties below!</p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
