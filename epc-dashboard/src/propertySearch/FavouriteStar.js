import React, { useEffect, useContext, useState } from 'react';
import { FavouriteContext } from '../Components/utils/favouriteContext';

const FavouriteStar = ({ user, property }) => {
  const { addFavourite, removeFavourite, isFavourited, favouriteProperties } = useContext(FavouriteContext);
  const uprn = property?.uprn ? String(property.uprn) : "";

  const [isLoading, setIsLoading] = useState(false);
  const [propertyFavourited, setIsPropertyFavourited] = useState(isFavourited(uprn));

  useEffect(() => {
    setIsPropertyFavourited(isFavourited(uprn));
  }, [favouriteProperties]);

  const toggleFavourite = async () => {
    if (!user?.email || isLoading) return;

    setIsLoading(true);

    if (propertyFavourited) {
      await removeFavourite(property);
    } else {
      addFavourite(user, property)
    }

    setIsPropertyFavourited(!propertyFavourited);
    setIsLoading(false);
  };

  return (
    <div className="starBase" onClick={toggleFavourite} title={propertyFavourited ? 'Click to unfavourite' : 'Click to favourite'}>
      <span className="heart-emoji">
        {propertyFavourited ? "❤️" : "🤍"}
      </span>
    </div>
  );
};

export default FavouriteStar;
