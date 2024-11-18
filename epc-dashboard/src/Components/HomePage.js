//HomePage.js
import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBarComponent';
import PropertyCard from './PropertyCard';
import {Link, useNavigate} from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent'; // Import the Street View component if you want to use it
import './HomePage.css';
import './PropertyCard.css'
import PropertyFilter from './FilterComponent';
import TopRatedPropertyCard from './TopRatedPropertyCard';

const HomePage = () => {

    const [topRatedProperties, setTopRatedProperties] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopRatedProperties = () => {
        fetch(`http://127.0.0.1:5000/api/property/loadTopRated`)
          .then((response) => response.json())
          .then((data) => {
          setTopRatedProperties(data);
          setLoading(false);
      })
      .catch(error => {
        setErrorMessage('Failed to display top-rated properties.');
        setLoading(false);
        });
    };

    fetchTopRatedProperties();
}, []);

    const handleInputChange = (method) => {
        setSearchTerm(method.target.value);
    };

    const handleSearch = () => {
        navigate(`/propertylist?search=${searchTerm}`);
};

    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (topRatedProperties.length === 0) {
      return <p>No Top Rated Properties found!</p>;
}

return (
    <>
        <div className = "backgroundImageStyling">
            <div className = "stylingSearchBar">
        <input  className = "stylingSearchInput"
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search by property address or postcode..." />
            <button className = "stylingSearchButton" onClick={handleSearch}>Search</button>
            </div>
        </div>
        
        <h2 className = "stylingTitle">Here are the Top 6 Properties</h2>    
        <div className = "homePageStyling">
            {topRatedProperties.map((property, index) => (
                <TopRatedPropertyCard key={index} property={property}/>
            ))}
        </div>
        <div className = "footer">
            EPCity - Helping make properties more efficient! c.2024
        </div>
    </>
    );
};
    export default HomePage;