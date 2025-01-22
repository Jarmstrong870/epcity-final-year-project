import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';

const TopRatedPropertyCard = ({ property, language }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false); // State for favorite status
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

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
    alignItems: 'center', // Ensures vertical alignment
    justifyContent: 'space-between', // Pushes the address to the left and the star to the right
    position: 'relative',
    width: '100%', // Ensures full width of the container
  }}
>
  <h3
    style={{
      margin: 0,
      whiteSpace: 'nowrap', // Prevents address from wrapping
      overflow: 'hidden', // Hides any overflow text
      textOverflow: 'ellipsis', // Adds ellipsis for long addresses
    }}
  >
    {property.address}
  </h3>
  <span
    style={{
      fontSize: '2rem', // Adjust size as needed
      cursor: 'pointer',
      color: isFavorited ? 'gold' : 'gray',
      position: 'relative', // Enables top adjustment
      top: '-2px', // Moves the star slightly upward
      marginLeft: '10px', // Adds some space between the address and the star
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
