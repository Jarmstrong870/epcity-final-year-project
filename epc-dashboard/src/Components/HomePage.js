import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './HomePage.css';

const HomePage = () => {
  const [topRatedProperties, setTopRatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRatedProperties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/property/loadTopRated');
        const data = await response.json();
        setTopRatedProperties(data.slice(0, 6)); // Fetch only the top 6 properties
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
      <h2 className="stylingTitle">Six Highest Rated Properties</h2>
      <div className="homePageGrid">
        {topRatedProperties.map((property, index) => (
          <TopRatedPropertyCard key={index} property={property} />
        ))}
      </div>
    </>
  );
};

export default HomePage;
