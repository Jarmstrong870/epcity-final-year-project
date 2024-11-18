// src/Components/PropertyList.js
import React from 'react';
import PropertyCard from './PropertyCard';

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
      <h2>Property List</h2>
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
                <Link 
                  to={`/property/${property.uprn}`}  // Use `uprn` in URL parameter
                >
                  {property.address}
                </Link>
              </td>
              <td>{property.postcode}</td>
              <td>{property.property_type}</td>
              <td>{property.current_energy_rating}</td>
              <td>{property.current_energy_efficiency}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
