import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavouriteContext } from '../Components/utils/favouriteContext';
import './FavouriteStar.css';

const FavouriteStar = ({ user, property }) => {
  const { addFavourite, removeFavourite, isFavourited, favouriteProperties } = useContext(FavouriteContext);
  const navigate = useNavigate();
  const uprn = property?.uprn ? String(property.uprn) : "";
  const [isLoading, setIsLoading] = useState(false);
  const [propertyFavourited, setIsPropertyFavourited] = useState(isFavourited(uprn));
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setIsPropertyFavourited(isFavourited(uprn));
  }, [favouriteProperties, uprn, isFavourited]);

  const toggleFavourite = async (e) => {
    e.stopPropagation();
    if (!user?.email) {
      setPopupMessage(
        <>
          Please log in or sign up
          <br />
          to favourite properties
        </>
      );
      
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    if (propertyFavourited) {
      await removeFavourite(property);
    } else {
      await addFavourite(user, property);
    }
    setIsPropertyFavourited(!propertyFavourited);
    setIsLoading(false);
  };

  return (
    <div className="starBase" onClick={toggleFavourite} title={propertyFavourited ? 'Click to unfavourite' : 'Click to favourite'}>
      {showPopup && <div className="popup">{popupMessage}</div>}
      <span className="heart-emoji">
        {propertyFavourited ? "❤️" : "🤍"}
      </span>
    </div>
  );
};

export default FavouriteStar;
