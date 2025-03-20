import React, { useState, useContext } from 'react';
import { FavouriteContext } from '../Components/utils/favouriteContext';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './PropertyCard.css';
import '../propertySearch/FavouriteStar.css';
import FavouriteStar from '../propertySearch/FavouriteStar';
import translations from '../locales/translations_topratedpropertycard'; // Import translations

/*
  PropertyCard is a card view displaying key property details:
  address, postcode, property type, energy rating, efficiency, and number of bedrooms.
  It also includes the Favourite Star component for saving properties.
  Clicking on the card navigates to the Property Page.
*/

const PropertyCard = ({ user, property, language }) => {
  const navigate = useNavigate();
  const { favouriteProperties } = useContext(FavouriteContext);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const t = translations[language] || translations.en;

  const handleClick = () => {
    navigate(`/property/${property.uprn}`, {
      state: { uprn: property.uprn, address: property.address, postcode: property.postcode },
    });
  };
  

  
  

  return (
    <div className="property-card" onClick={handleClick}>
      {showPopup && <div className="popup">{popupMessage}</div>}

      {/* Image Container */}
      <div className="property-card__image-container">
        <StreetViewComponent 
          address={property.address} 
          postcode={property.postcode} 
          propertyType={property.property_type}
        />
      </div>

      {/* Information Section */}
      <div className="property-card__info">
        <div >
          <h4 >{property.address}</h4>
        </div>
        
        <div className="property-card__postcode-star-line">
          <p className="property-card__postcode">
            {t.postcode}: {property.postcode}
          </p>
          <div className="property-card__star" >
            <FavouriteStar user={user} property={property} key={favouriteProperties.length} />
          </div>
        </div>


        <div className="property-card__details">
          <div className="detail-item">
            <span className="detail-label">{t.type}:</span>
            <span className="detail-value">{property.property_type}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t.energyRating}:</span>
            <span className="detail-value">{property.current_energy_rating}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t.efficiency}:</span>
            <span className="detail-value">{property.current_energy_efficiency}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Bedrooms:</span>
            <span className="detail-value">{property.number_bedrooms}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
