import React, { useState } from 'react';

  /* Favourite Star is a new component that has been newly altered so that the
  css is now separate from the calling of the toggleFavourite once the star
  component has been clicked */

const FavouriteStar = ({ user, property, favouriteStatus}) => {
  
  const [isFavourited, setIsFavourited] = useState(true); // is default set to true i.e. not favourited

  const toggleFavorite = async () => {
    
    try {
      if(isFavourited) {
        await fetch(`http://127.0.0.1:5000/favourites/removeFavourite?email=${user.email}&uprn=${property.uprn}`);
        console.log("property removed");
        console.log("removed:", user.email);
        console.log("removed:", property.uprn);
        setIsFavourited(false);
        favouriteStatus(property.uprn);
      } else {
        await fetch(`http://127.0.0.1:5000/favourites/addFavourite?email=${user.email}&uprn=${property.uprn}`);
        console.log("property added");
        console.log("added:", user.email);
        console.log("added:", property.uprn);
        setIsFavourited(true);
      }

    } catch (error) {
        console.error("Unable to fetch properties", error);
    }
  };

  // Return statement that has been altered so that the css is now separate from the calling 
  // of the toggleFavourite once the star component has been clicked

  return (
    <div className = "starBase">
      <span className = {`starComponent ${isFavourited ? 'grey' : 'gold'}`}
        onClick={toggleFavorite}
        title={isFavourited ? 'Click to favourite' : 'Click to unfavourite'}
      >
        ★
      </span>
    </div>
  );
};

export default FavouriteStar;
