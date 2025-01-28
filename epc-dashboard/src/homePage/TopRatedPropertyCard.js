import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';
import FavouriteStar from '../propertySearch/FavouriteStar';
import translations from '../locales/translations_topratedpropertycard'; // Import translations

const TopRatedPropertyCard = ({ user, property, language }) => {
  const navigate = useNavigate();
  const [isFavourited, setIsFavourited] = useState(false); // State for favorite status
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  const t = translations[language] || translations.en; // Load translations

  const handleClick = () => {
    navigate(`/property/${property.uprn}`, {
      state: { uprn: property.uprn, address: property.address, postcode: property.postcode },
    });
  };

  const toggleFavourite = (event) => {
    event.stopPropagation(); // Prevent triggering the card click
    setIsFavourited(!isFavourited);
    setPopupMessage(
      !isFavourited
        ? `${property.address} has been favorited.`
        : `${property.address} has been unfavorited.`
    );
    setShowPopup(true);

    // Hide the popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  return (
    <div className="topRatedPropertyCard" onClick={handleClick}>
      {/* Popup */}
      {showPopup && <div className="popup">{popupMessage}</div>}

      <div className="propertyImage">
        <StreetViewComponent address={property.address} postcode={property.postcode} />
      </div>
      <div className="propertyDetails">
          <h3> {property.address} 
            <div className = "starComponent">
              <div onClick={toggleFavourite}>
                <FavouriteStar user={user} property = {property}/> 
              </div> 
            </div>   
          </h3>
      </div>

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
  );
};

export default TopRatedPropertyCard;
