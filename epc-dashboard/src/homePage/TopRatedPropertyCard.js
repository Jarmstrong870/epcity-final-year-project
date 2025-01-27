import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';
import translations from '../locales/translations_topratedpropertycard'; // Import translations

const TopRatedPropertyCard = ({ property, language }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false); // State for favorite status
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  const t = translations[language] || translations.en; // Load translations

  const handleClick = () => {
    navigate(`/property/${property.uprn}`, {
      state: { uprn: property.uprn, address: property.address, postcode: property.postcode },
    });
  };

  const toggleFavorite = (event) => {
    event.stopPropagation(); // Prevent triggering the card click
    setIsFavorited(!isFavorited);
    setPopupMessage(
      !isFavorited
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            width: '100%',
          }}
        >
          <h3
            style={{
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {property.address}
          </h3>
          <span
            style={{
              fontSize: '2rem',
              cursor: 'pointer',
              color: isFavorited ? 'gold' : 'gray',
              position: 'relative',
              top: '-2px',
              marginLeft: '10px',
            }}
            onClick={toggleFavorite}
            title={isFavorited ? 'Unfavorite' : 'Favorite'}
          >
            ★
          </span>
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
    </div>
  );
};

export default TopRatedPropertyCard;
