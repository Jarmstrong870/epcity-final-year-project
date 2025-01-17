import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './PropertyList.css';

const PropertyList = ({ properties, loading }) => {
  const [viewMode, setViewMode] = useState('table'); // State to toggle between 'table' and 'card' views

  if (loading) {
    return <p>Loading...</p>;
  }

  if (properties.length === 0) {
    return <p>No properties found.</p>;
  }

  // Limit to first 12 properties for the card view
  const limitedProperties = properties.slice(0, 12);

  return (
    <div className="property-list">
      <h2>Property List</h2>
      
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
    </div>
  );
};

export default PropertyList;
