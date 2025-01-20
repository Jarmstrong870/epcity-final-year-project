import React from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';

const TopRatedPropertyCard = ({ property, language }) => {
  const navigate = useNavigate();

  // Translations
  const translations = {
    en: {
      postcode: 'Postcode',
      type: 'Type',
      energyRating: 'Energy Rating',
      efficiency: 'Efficiency',
    },
    fr: {
      postcode: 'Code Postal',
      type: 'Type',
      energyRating: 'Classement Énergétique',
      efficiency: 'Efficacité',
    },
    es: {
      postcode: 'Código Postal',
      type: 'Tipo',
      energyRating: 'Clasificación Energética',
      efficiency: 'Eficiencia',
    },
  };

  const t = translations[language] || translations.en;

  const handleClick = () => {
    navigate(`/property/${property.uprn}`, {
      state: { uprn: property.uprn, address: property.address, postcode: property.postcode },
    });
  };

  return (
    <div className="topRatedPropertyCard" onClick={handleClick}>
      <div className="propertyImage">
        <StreetViewComponent address={property.address} postcode={property.postcode} />
      </div>
      <div className="propertyDetails">
        <h3>{property.address}</h3>
        <p>
          <strong>{t.postcode}:</strong> {property.postcode}
        </p>
        <p>
          <strong>{t.type}:</strong> {property.property_type}
        </p>
        <p>
          <strong>{t.energyRating}:</strong> {property.current_energy_rating}
        </p>
        <p>
          <strong>{t.efficiency}:</strong> {property.current_energy_efficiency}
        </p>
      </div>
    </div>
  );
};

export default TopRatedPropertyCard;
