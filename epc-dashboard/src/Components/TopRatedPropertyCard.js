import React from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';

const TopRatedPropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${encodeURIComponent(property.address)}`, {
      state: { address: property.address, postcode: property.postcode },
    });
  };

  return (
    <div className="topRatedPropertyCard" onClick={handleClick}>
      <div className="propertyImage">
        <StreetViewComponent address={property.address} postcode={property.postcode} />
      </div>
      <div className="propertyDetails">
        <h3>{property.address}</h3>
        <p><strong>Postcode:</strong> {property.postcode}</p>
        <p><strong>Type:</strong> {property.property_type}</p>
        <p><strong>Energy Rating:</strong> {property.current_energy_rating}</p>
        <p><strong>Efficiency:</strong> {property.current_energy_efficiency}</p>
      </div>
    </div>
  );
};

export default TopRatedPropertyCard;
