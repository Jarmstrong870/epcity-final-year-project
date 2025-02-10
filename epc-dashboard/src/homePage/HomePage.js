import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage'; // Import translations

const cities = [
  { name: "Liverpool", image: require("../assets/cities/liverpool.jpg") },
  { name: "Leeds", image: require("../assets/cities/leeds.jpg") },
  { name: "Manchester", image: require("../assets/cities/manchester.jpg") },
  { name: "Bristol", image: require("../assets/cities/bristol.jpg") },
  { name: "Sheffield", image: require("../assets/cities/sheffield.jpeg") },
  { name: "Birmingham", image: require("../assets/cities/birmingham.jpg") },
  { name: "Brighton", image: require("../assets/cities/brighton.jpg") },
  { name: "Newcastle", image: require("../assets/cities/newcastle.jpg") },
  { name: "Southampton", image: require("../assets/cities/southampton.jpeg") },
];

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
      fetchProperties(searchTerm, [], []);
      navigate(`/propertylist?search=${searchTerm}`);
    }
  };

  return (
    <>
      <div className="backgroundImageStyling">
        <div className="welcomeText">
          <div className="mainMessage">{t.welcomeMessage}</div>
          <div className="subMessage">{t.subMessage}</div>
        </div>
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

      {/* About Website Section */}
      <div className="about-website">
        <img 
          src={require('../assets/liverpool-houses.jpg')} 
          alt="Liverpool" 
          className="about-image" 
        />
        <div className="content">
          <h2>{t.aboutUsTitle}</h2>
          <p>{t.aboutUsDescription1}</p>
          <p>{t.aboutUsDescription2}</p>
        </div>
      </div>

    {/* UK Cities Section */}
    <div className="uk-cities-section">
      <h2 className="uk-cities-title">Find Your Next Dream Property</h2>
      <p className="uk-cities-subtitle">
      Explore properties in top UK cities and find the perfect home that suits your lifestyle.
       </p>
        <div className="cities-grid">
          {cities.map((city, index) => (
            <div key={index} className="city-card">
              <img src={city.image} alt={city.name} className="city-image" />
              <div className="city-overlay">
                <span className="city-name">{city.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Rated Properties Section */}
      <div className="top-rated-properties" id="top-rated-properties">
        <h2>{t.topRatedProperties}</h2>
        <div className="property-grid">
          {topRatedProperties.map((property, index) => (
            <TopRatedPropertyCard key={index} user={user} property={property} language={language} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
