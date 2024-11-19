import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './HomePage.css';

const HomePage = () => {
  const [topRatedProperties, setTopRatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const propertiesPerSlide = 3; // Number of properties per carousel slide

  useEffect(() => {
    // Fetch initial top-rated properties
    const fetchTopRatedProperties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/property/loadTopRated');
        const data = await response.json();
        setTopRatedProperties(data); // Set all properties for the carousel
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedProperties();
  }, []);

  const fetchFilteredProperties = (searchQuery) => {
    // Fetch filtered properties based on the search query
    setLoading(true);

    let url = 'http://127.0.0.1:5000/api/property/alter?';
    if (searchQuery) {
      url += `search=${encodeURIComponent(searchQuery)}&`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTopRatedProperties(data); // Update displayed properties
      })
      .catch((error) => {
        console.error('Error fetching filtered properties:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Perform search and navigate to property list if needed
    if (searchTerm.trim()) {
      fetchFilteredProperties(searchTerm); // Fetch properties matching the search
      navigate('/propertylist', { state: { searchQuery: searchTerm } }); // Navigate to the property list
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + propertiesPerSlide < topRatedProperties.length
        ? prevIndex + propertiesPerSlide
        : 0
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - propertiesPerSlide >= 0
        ? prevIndex - propertiesPerSlide
        : Math.max(0, topRatedProperties.length - propertiesPerSlide)
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (topRatedProperties.length === 0) {
    return <p>No properties found.</p>;
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
        <h2 className="stylingTitle">Highest Rated Properties</h2>
        <button className="arrow left" onClick={prevSlide}>
          &#8592;
        </button>
        <div className="carousel">
          {visibleProperties.map((property, index) => (
            <TopRatedPropertyCard key={index} property={property} />
          ))}
        </div>
        <button className="arrow right" onClick={nextSlide}>
          &#8594;
        </button>
      </div>
    </>
  );
};

export default HomePage;
