import React from 'react';
import './PropertyCard.css'; // Ensure this file exists for styling

const TopRatedPropertyCard = ({ property }) => {
  const { address, postcode, property_type, current_energy_rating, current_energy_efficiency } = property;

  const generateStreetViewImageUrl = (address, postcode, size = '400x400') => {
    const apiKey = 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c';
    const location = `${encodeURIComponent(address)},${encodeURIComponent(postcode)}`;
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${location}&fov=90&heading=235&pitch=10&key=${apiKey}`;
  };

  const streetViewURL = generateStreetViewImageUrl(address, postcode);

  return (
    <div className="propertyCard">
      <div className="propertyImage">
        <img src={streetViewURL} alt="Street View" />
      </div>
      <div className="propertyDetails">
      <h3>Property Address: {address}</h3>
      <table>
      <tr>
          <td><strong>Postcode:</strong> </td>
          <td><strong>Property Type:</strong></td>
          <td><strong>Energy Rating:</strong></td>
          <td><strong>Energy Efficiency:</strong></td>
        </tr>
        <tr>
          <td><i>{property.postcode}</i></td>
          <td><i>{property.property_type}</i></td>
          <td><i>{property.current_energy_rating}</i></td>
          <td><i>{property.current_energy_efficiency}</i></td>
        </tr>      
        </table>
        </div>
    </div>
  );
};

export default TopRatedPropertyCard;
