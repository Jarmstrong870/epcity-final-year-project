import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';
import translations from '../locales/translations_topratedpropertycard';
import FavoriteStar from './FavouriteStar';

const TopRatedPropertyCard = ({ property, email, language }) => {
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  const t = translations[language] || translations.en; // Load translations

  // Handle navigation to property details
  const handleClick = () => {
    navigate(`/property/${property.uprn}`, {
      state: { uprn: property.uprn, address: property.address, postcode: property.postcode },
    });
  };

  // Handle the favorite toggle callback
  const handleFavoriteToggle = (isFavorited) => {
    setPopupMessage(
      isFavorited
        ? `${property.address} has been added to your favourites.`
        : `${property.address} has been removed from your favourites.`
    );
    setShowPopup(true);

    // Hide the popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  // Ensure `property` has the required data before rendering
  if (!property || !property.uprn) {
    return <p>Property details are unavailable.</p>;
  }

  return (
    <div className="topRatedPropertyCard" onClick={handleClick}>
      {/* Popup */}
      {showPopup && <div className="popup">{popupMessage}</div>}

      {/* Property Layout */}
      <div className="propertyContent">
        {/* Property Image */}
        <div className="propertyImage">
          <StreetViewComponent address={property.address} postcode={property.postcode} />
        </div>

        {/* Property Details */}
        <div className="propertyDetails">
          <div className="propertyHeader">
            <h3 className="propertyTitle">{property.address}</h3>

            {/* FavouriteStar Component */}
            <div
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubbling to card click
              }}
            >
              <FavoriteStar
                property={property} // Pass property object
                email={email} // Pass user email
                onToggle={handleFavoriteToggle} // Callback for toggling
              />
            </div>
          </div>

          {/* Property Metadata */}
          <div className="propertyMetadata">
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
      </div>
    </div>
  );
};

export default TopRatedPropertyCard;