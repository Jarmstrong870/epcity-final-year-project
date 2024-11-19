import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './HomePage.css';

const HomePage = ({ fetchProperties }) => {
  const [topRatedProperties, setTopRatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); // Index for carousel
  const navigate = useNavigate();

  const propertiesPerSlide = 3; // Number of properties per slide

  useEffect(() => {
    const fetchTopRatedProperties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/property/loadTopRated');
        const data = await response.json();
        setTopRatedProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedProperties();
  }, []);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchProperties(searchTerm);
      navigate('/propertylist');
    }
  };

  const nextSlide = () => {
    if (currentIndex + propertiesPerSlide < topRatedProperties.length) {
      setCurrentIndex(currentIndex + propertiesPerSlide);
    }
  };

  const prevSlide = () => {
    if (currentIndex - propertiesPerSlide >= 0) {
      setCurrentIndex(currentIndex - propertiesPerSlide);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (topRatedProperties.length === 0) {
    return <p>No top-rated properties found.</p>;
  }

  const visibleProperties = topRatedProperties.slice(
    currentIndex,
    currentIndex + propertiesPerSlide
  );

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
            placeholder="Search by property address or postcode..."
          />
          <button className="stylingSearchButton" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="carousel-container">
        <h2 className="stylingTitle">Top Rated Properties</h2>
        <div className="carousel">
          <button className="arrow left" onClick={prevSlide} disabled={currentIndex === 0}>
            &#8592;
          </button>
          <div className="carousel-content">
            {visibleProperties.map((property, index) => (
              <TopRatedPropertyCard key={index} property={property} />
            ))}
          </div>
          <button
            className="arrow right"
            onClick={nextSlide}
            disabled={currentIndex + propertiesPerSlide >= topRatedProperties.length}
          >
            &#8594;
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
