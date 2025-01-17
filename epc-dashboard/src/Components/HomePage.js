import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './HomePage.css';
import {PropertyContext } from './propertyContext'

const HomePage = () => {
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { fetchTopRatedProperties, topRatedProperties, fetchProperties} = useContext(PropertyContext)
  

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
      navigate('/propertylist?search=${searchTerm}');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (topRatedProperties.length === 0) {
    return <p>No top-rated properties found.</p>;
  }

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

      {/* Top Rated Properties Section */}
      <div className="top-rated-properties">
        <h2 className="stylingTitle">Top Rated Properties</h2>
        <div className="property-grid">
          {topRatedProperties.map((property, index) => (
            <TopRatedPropertyCard key={index} property={property} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
