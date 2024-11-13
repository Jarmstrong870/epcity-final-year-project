// PropertyList.js
import React from 'react';
import { Link } from 'react-router-dom';

const PropertyList = ({ properties, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (properties.length === 0) {
    return <p>No properties found.</p>;
  }

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
    </div>
  );
};

export default PropertyList;
