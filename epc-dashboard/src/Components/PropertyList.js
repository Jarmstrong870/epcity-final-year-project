// src/Components/PropertyList.js
import React from 'react';
import PropertyCard from './PropertyCard';
import './PropertyCard.css'

const PropertyList = ({ properties, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (properties.length === 0) {
    return <p>No properties found.</p>;
  }

  // Limit to first 3 properties
  const limitedProperties = properties.slice(0, 12);

  return (
    <div className="property-list">
      <h2>Properties</h2>
      <div className="property-cards-container">
        {limitedProperties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
