import React from 'react';
import './TopRatedPropertyCard.css'; // Ensure this file exists for styling

const TopRatedPropertyCard = ({ property }) => {
  const { address, postcode, property_type, current_energy_rating, current_energy_efficiency } = property;

  const generateStreetViewImageUrl = (address, postcode, size = '400x400') => {
    const apiKey = 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c';
    const location = `${encodeURIComponent(address)},${encodeURIComponent(postcode)}`;
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${location}&fov=90&heading=235&pitch=10&key=${apiKey}`;
  };

  const streetViewURL = generateStreetViewImageUrl(address, postcode);

  return (
    <div className="topRatedPropertyCard">
      <div className="propertyImage">
        <img src={streetViewURL} alt="Street View" />
      </div>
      <div className="propertyDetails">
        <h3>{address}</h3>
        <p><strong>Postcode:</strong> {postcode}</p>
        <p><strong>Type:</strong> {property_type}</p>
        <p><strong>Energy Rating:</strong> {current_energy_rating}</p>
        <p><strong>Efficiency:</strong> {current_energy_efficiency}</p>
      </div>
    </div>
  );
};

export default TopRatedPropertyCard;
