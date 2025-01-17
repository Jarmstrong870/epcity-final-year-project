import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './HomePage.css';
import './PropertyCard.css'
import PropertyFilter from './FilterComponent';

const HomePage = ({ fetchProperties }) => {
  const [topRatedProperties, setTopRatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRatedProperties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/property/loadTopRated');
        const data = await response.json();
        setTopRatedProperties(data.slice(0, 3)); // Limit to top 6 properties
        console.log("Top Rated Properties:", data); // Debugging output
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
    navigate(`/propertylist?search=${searchTerm}`);
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
