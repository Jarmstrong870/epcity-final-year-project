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
    <>
        <div className = "stylingSearchBar">
            <button onceClicked={handleSearch}>View All Properties</button>
        </div>
        <h2 className = "stylingTitle">Here are the Top 6 Properties</h2>    
        <div className = "homePageStyling">
            {topRatedProperties.map((property, index) => (
                <div key = {index} className = "stylingPropertiesDetails">
                    <div className = "stylingPropertyImage">
                        <StreetViewComponent address = {property.address}/>
                    </div>
                <div className = "displayingProperties">
                    <h3 className = "propertyAddressStyling">{property.address}</h3>
                    <p><strong>Postcode</strong>{property.postcode}</p>
                    <table className = "importantPropertyDetails">
                            <tr>
                                <td><strong>Property Type:</strong></td>
                                <td><strong>Energy Rating:</strong></td>
                                <td><strong>Energy Efficiency:</strong></td>
                            </tr>
                            <tr>
                                <td><italic>{property.property_type}</italic></td>
                                <td><italic>{property.current_energy_rating}</italic></td>
                                <td><italic>{property.current_energy_efficiency}</italic></td>
                            </tr>
                    </table>
                </div>
            </div>
        ))}
        </div>
        <div className = "footer">
            EPCity - Helping make properties more efficient! c.2024
        </div>
    </>
    );
};
    export default HomePage;