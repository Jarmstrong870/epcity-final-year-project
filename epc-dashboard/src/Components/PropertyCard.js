import React from 'react';
import StreetViewComponent from './StreetViewComponent'; // Import the Street View component if you want to use it
import './PropertyCard.css'

const PropertyCard = ({ property }) => {
  return (
    <div className="propertyCard">
      {/* Optional: Display the Google Street View image */}
      <div className="propertyImage">
        <StreetViewComponent address={property.address} />
      </div>
      <h3> Property Address: {property.address}</h3>
      <table>
      <div className="propertyDetails">
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
      </div>
    </table>
  </div>
  );
};

export default PropertyCard;

