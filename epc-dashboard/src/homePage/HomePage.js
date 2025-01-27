import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import '../homePage/HomePage.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_homepage'; // Import translations


const HomePage = ({  language }) => {
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { fetchTopRatedProperties, topRatedProperties, fetchProperties} = useContext(PropertyContext)

  const t = translations[language] || translations.en; // Load translations

  useEffect(() => {
    const fetchTopProperties = async () => {
      try {
        fetchTopRatedProperties();
        const data = topRatedProperties;
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
      fetchProperties(searchTerm);
      navigate(`/propertylist?search=${searchTerm}`);
    }
  };


  
  
  return (
    <>
      
      {/* Search Bar Section */}
      <div className="backgroundImageStyling">
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

      {/* Top Rated Properties Section */}
      <div className="top-rated-properties">
        <h2 className="stylingTitle">{t.topRatedProperties}</h2>
        <div className="property-grid">
          {topRatedProperties.map((property, index) => (
            <TopRatedPropertyCard key={index} property={property} language={language} />
          ))}
        </div>
      </div>
    </>
  );

};

export default HomePage;
