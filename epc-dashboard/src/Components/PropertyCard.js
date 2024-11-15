import React from 'react';
import StreetViewComponent from './StreetViewComponent'; // Import the Street View component if you want to use it

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      {/* Optional: Display the Google Street View image */}
      <div className="property-image">
        <StreetViewComponent address={property.address} />
      </div>
      <div className="property-details">
        <h3>{property.address}</h3>
        <p><strong>Postcode:</strong> {property.postcode}</p>
        <p><strong>Property Type:</strong> {property.property_type}</p>
        <p><strong>Energy Rating:</strong> {property.current_energy_rating}</p>
        <p><strong>Energy Efficiency:</strong> {property.current_energy_efficiency}</p>
      </div>
    </div>
  );
};

export default PropertyCard;

