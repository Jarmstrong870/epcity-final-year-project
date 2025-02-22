import React, { useState } from 'react';
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
      isFavourited
        ? `${property.address} has been unfavourited.`
        : `${property.address} has been favourited.`
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
        <StreetViewComponent 
          address={property.address} 
          postcode={property.postcode} 
          propertyType={property.property_type} // Pass property type for placeholder images
        />
      </div>
      
      <div className="propertyDetails">
        <h3> {property.address} 
          <div className="starComponent"> {/* Favourite Star Component */}
            <div onClick={toggleFavourite}>
              <FavouriteStar user={user} property={property} />
            </div> 
          </div>   
        </h3>
      </div>

      <p> {/* Top 4 details presented on card view */}
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
      <p>
        <strong>{"Number of Bedrooms"}:</strong> {property.number_bedrooms}
      </p>
    </div>
  );
};

export default TopRatedPropertyCard;
