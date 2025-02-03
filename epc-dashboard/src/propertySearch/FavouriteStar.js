import React, { useState, useContext } from 'react';
import { FavouriteContext }  from '../Components/utils/favouriteContext';
import './FavouriteStar.css';

  /* Favourite Star is a new component that appears within the Top Rated Property Card,
  Property Page and Property List which will allow a user to add/remove the property as a Favourite
  and can be saved into the user_properties table in the pgAdmin database */

const FavouriteStar = ({ user = {}, property = {}}) => {
  
  const {addFavourite, removeFavourite, isFavourited} = useContext(FavouriteContext);
  const uprn = String(property.uprn || "");

  const toggleFavorite = async () => {
    
      if(isFavourited(uprn)) {
        console.log("already a favourite", uprn);
        removeFavourite(user, property);
      } else {
        console.log("adding as a favourite", uprn);
        addFavourite(user, property);

      }
  };

  // Return statement that has been altered so that the css is now separate from the calling 
  // of the toggleFavourite once the star component has been clicked

  // Return statement that once the star has been clicked i.e. toggleFavourite, 
  // calls the colour either gold for selected and grey for unselected and will present
  // a pop up based on user selection

  return (
    <div className = "starBase">
      <span className = {`starComponent ${isFavourited(property.uprn) ? 'gold' : 'grey'}`}
        onClick={toggleFavorite}
        title={isFavourited(property.uprn) ? 'Click to unfavourite' : 'Click to favourite'}
      >
        ★
      </span>
    </div>
  );
};

export default FavouriteStar;
