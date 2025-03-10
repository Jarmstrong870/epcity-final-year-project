import React, { useEffect, useContext, useState } from 'react';
import { FavouriteContext }  from '../Components/utils/favouriteContext';

  /* Favourite Star is a new component that appears within the Top Rated Property Card,
  Property Page and Property List which will allow a user to add/remove the property as a Favourite
  and can be saved into the user_properties table in the pgAdmin database */

const FavouriteStar = ({ user, property}) => {
  
  const {addFavourite, removeFavourite, isFavourited, favouriteProperties} = useContext(FavouriteContext);
  const uprn = property?.uprn ? String(property.uprn) : "";
  //const uprn = String(property?uprn ?? "")
  //const uprn = property?.uprn.toString() || "";

  const [isLoading, setIsLoading] = useState(false);
  //const [defaultPopUp, setDefaultPopUp] = useState(false);
  const [propertyFavourited, setIsPropertyFavourited] = useState(isFavourited(uprn));

  useEffect(() => {
    setIsPropertyFavourited(isFavourited(uprn));
  }, [favouriteProperties]);

  const toggleFavourite = async (e) => {
    e.stopPropagation();
    if(!user?.email || isLoading) {
      //setDefaultPopUp(true);
      return;
    }

    setIsLoading(true); 
    
      if(propertyFavourited) {
        console.log("already a favourite", uprn);
        await removeFavourite(property); // add the await in after I have fully tested-
      } else {
        console.log("adding as a favourite", uprn);
        addFavourite(property);
      }

      setIsLoading(false);

  };

  // Return statement that has been altered so that the css is now separate from the calling 
  // of the toggleFavourite once the star component has been clicked

  // Return statement that once the star has been clicked i.e. toggleFavourite, 
  // calls the colour either gold for selected and grey for unselected and will present
  // a pop up based on user selection

  return (
    <div className = "starBase">

    {/*}
      {defaultPopUp && (
        <div className="default-popup">
          <h2>You must have an account to favourite a property!!</h2> 
            <button onClick={() => navigate('/login')}> Visit our Login </button>
            <button onClick={() => setDefaultPopUp(false)}>Back to Home Page </button>
        </div>
      )} */}


      <span className = {`starComponent ${propertyFavourited ? 'gold' : 'grey'}`}
        onClick={toggleFavourite}
        title={propertyFavourited ? 'Click to unfavourite' : 'Click to favourite'}
      >
        ★
      </span>
    </div>
  );
};

export default FavouriteStar;

