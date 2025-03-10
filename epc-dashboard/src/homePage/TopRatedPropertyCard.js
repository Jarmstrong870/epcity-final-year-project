import React, { useState, useContext } from 'react';
import { FavouriteContext } from '../Components/utils/favouriteContext';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';
import '../propertySearch/FavouriteStar.css';
import FavouriteStar from '../propertySearch/FavouriteStar';
import translations from '../locales/translations_topratedpropertycard'; // Import translations

/*
  Top Rated Property Card is a card view displaying the specified four key details: postcode, type, 
  energyRating, and efficiency. Once selected, it navigates to the Property Page.
  The card also includes the Favourite Star component for saving properties to the Favourites Page.
*/ 

const TopRatedPropertyCard = ({ user, property, language }) => {
  const navigate = useNavigate();
  const {favouriteProperties} = useContext(FavouriteContext);
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  const t = translations[language] || translations.en; // Load translations

  const handleClick = () => {
    navigate(`/property/${property.uprn}`, {
      state: { uprn: property.uprn, address: property.address, postcode: property.postcode },
    });
  };
    

  return (
    <div className="topRatedPropertyCard" onClick={handleClick}>

      {/* Popup */}
      {showPopup && <div className="popup">{popupMessage}</div>}

      <div className="propertyImage">
        <StreetViewComponent 
          address={property.address} 
          postcode={property.postcode} 
          propertyType={property.property_type} // Pass property type for placeholder images
        />
      </div>
      
      <div className="propertyDetails">
        <div className="propertyHeader">
          <h3 className="propertyTitle"> {property.address} </h3>
            <div className="starComponent" onClick={(e) => e.stopPropagation()}>
              <FavouriteStar user={user} property={property} key={favouriteProperties.length} />
            </div> 
        </div>  
    
          <p className="propertyPostcode"> {/* Top 4 details presented on card view */}
            {t.postcode}: {property.postcode}
          </p>

        <div className="summaryPropertyDetails">
              <div className="property-title"><strong>{t.type}</strong></div>
              <div className="property-title"> <strong>{t.energyRating}:</strong></div>
              <div className="property-title"> <strong>{t.efficiency}:</strong></div>
              </div>
          </div>

          <div className="summaryDetails values">
              <div className="property-value"><span>{property.property_type}</span></div>
              <div className="property-value"><span>{property.current_energy_rating}</span></div>
              <div className="property-value"><span>{property.current_energy_efficiency}</span></div>
          </div>
        </div>
  );
};

export default TopRatedPropertyCard;

