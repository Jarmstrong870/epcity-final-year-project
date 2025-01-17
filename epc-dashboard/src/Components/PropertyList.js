import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './PropertyList.css';
import { PropertyContext }  from './propertyContext';

const PropertyList = ({  loading }) => {
  const [viewMode, setViewMode] = useState('table'); // State to toggle between 'table' and 'card' views
  const [pageNumber, setPageNumber] = useState(1);
  const [sortValue, setSortValue] = useState("current_energy_rating");
  const  { properties, changePage, sortProperties} = useContext(PropertyContext);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (properties.length === 0) {
    return <p>No properties found.</p>;
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setPageNumber(newPage);
      changePage(newPage);
    }
  }

  const handleSortChange = (event) => {
    const newSortValue = event.target.value;
    setSortValue(newSortValue); // Update state
  
    // Call the sorting function from PropertyContext if available
    sortProperties(newSortValue);
  };

  // Limit to first 12 properties for the card view
  const limitedProperties = properties.slice(0, 12);

  return (
    <div className="property-list">
      <div className="property-list-header">
        <h2>Property List</h2>

        {/* Sort Dropdown */}
        <div className="sort-container">
          <label>Sort By:</label>
          <select value={sortValue} onChange={handleSortChange}>
            <option value="address">Address</option>
            <option value="postcode">Postcode</option>
            <option value="property_type">Property Type</option>
            <option value="current_energy_rating">Current Energy Rating</option>
            <option value="current_energy_efficiency">Current Energy Efficiency</option>
          </select>
        </div>
      </div>


      
      {/* View Mode Toggle */}
      <div className="view-toggle">
        <button 
          onClick={() => setViewMode('table')} 
          className={viewMode === 'table' ? 'active' : ''}
        >
          Table View
        </button>
        <button 
          onClick={() => setViewMode('card')} 
          className={viewMode === 'card' ? 'active' : ''}
        >
          Card View
        </button>
      </div>

      {/* Conditional Rendering Based on View Mode */}
      {viewMode === 'table' ? (
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Postcode</th>
              <th>Property Type</th>
              <th>Current Energy Rating</th>
              <th>Current Energy Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/property/${property.uprn}`}>{property.address}</Link>
                </td>
                <td>{property.postcode}</td>
                <td>{property.property_type}</td>
                <td>{property.current_energy_rating}</td>
                <td>{property.current_energy_efficiency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="property-cards-container">
          {limitedProperties.map((property, index) => (
            <TopRatedPropertyCard property={property} key={index}  />
          ))}
        </div>
      )}
      <div className="pagination">
        <button onClick={() => handlePageChange(pageNumber-1)}>back page</button>
        <button onClick={() => handlePageChange(pageNumber+1)}>forward page</button>
      </div>
        
    </div>
    
  );
};

export default PropertyList;
