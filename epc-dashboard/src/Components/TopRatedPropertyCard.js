import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from './StreetViewComponent';
import './TopRatedPropertyCard.css';
import FavoriteStar from './FavoriteStar';

const TopRatedPropertyCard = ({ property, isPropertyFavourited, language, onToggle}) => {
  const navigate = useNavigate();
  const [propertyFavourited, setIsFavorited] = useState(false); // State for favorite status
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

  useEffect(() => {
    setIsFavorited(isPropertyFavourited);
  }, [isPropertyFavourited]);

  const handleClick = () => {
    navigate(`/property/${property.uprn}`, {
      state: { uprn: property.uprn, address: property.address, postcode: property.postcode },
    });
  };

  const toggleFavorite = async (event) => {
    event.stopPropagation(); // Prevent triggering the card click
    const x = !propertyFavourited;
    setIsFavorited(x);
    setPopupMessage(
      !propertyFavourited
        ? `${property.address} has been favourited.`
        : `${property.address} has been unfavourited.`
    );
    setShowPopup(true);

    try {
        await onToggle(property, x);
    } catch (e) {
      console.error("Failed to updated favourite property", e);
      setIsFavorited(!x);
    }

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
        <div className="propertyDetailsHeading">
          <h3 className = "propertyAddressHeader">{property.address}</h3>
          <FavoriteStar
            isPropertyFavorited={propertyFavourited}
            onClick={toggleFavorite}/>
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
