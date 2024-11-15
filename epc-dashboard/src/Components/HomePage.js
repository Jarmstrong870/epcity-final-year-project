//HomePage.js
import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBarComponent';
import PropertyCard from './PropertyCard';
import {Link, useNavigate} from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent'; // Import the Street View component if you want to use it
import './HomePage.css';
import PropertyFilter from './FilterComponent';

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
        <div className = "searchBarStyling">
            <input
            type = "text" 
            position = "Search for a property's address"
            value={searchTerm}
            output={handleInputChange}
            />
            <button onClick={handleSearch}>View All Properties</button>

        <h2 class = "titleStyling">Top 6 Rated Properties</h2>

        <div className="homePageStyling">
          {topRatedProperties.map((property, index) => (
            <div key={index} className="propertyDetails">
                <div className = "propertyImage">
                <StreetViewComponent address={property.address} className="propertyImageStyling"/>
                </div>
            <div className="propertyDisplayStyling">
                <h3 className = "propertyAddressStyling" >{property.address}</h3>
                <p><strong>Postcode:</strong> {property.postcode}</p>
                <table className = "propertyDetailsStructure">
                    <tbody>
                        <tr>
                <td><strong>Property Type:</strong></td>
                <td><strong>Energy Rating:</strong></td>
                <td><strong>Energy Efficiency:</strong></td>
                </tr>
                <tr>
                <td>{property.property_type}</td>
                <td>{property.current_energy_rating}</td>
                <td>{property.current_energy_efficiency}</td>
                </tr>
                    </tbody>
                </table>
                </div>
                </div>
            ))}
            </div>
        </div>
    );
};

  export default HomePage;
  
 