import React, {useEffect, useState} from 'react';
import "./FavouritePage.css";
import TopRatedPropertyCard from './TopRatedPropertyCard';

const FavouritePage = ({userID}) => {
    const [favouriteProperties, setFavouriteProperties] = useState([]);

    const fetchFavouriteProperties = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/favourites/getFavourites?user_id=${userID}`);
            if(!response.ok){
                throw new Error("Unable to fetch favourited properties");
            }
            const data = await response.json();
            setFavouriteProperties(data);
        } catch (e) {
            console.error("Unable to fetch favourite properties", e);
        }
    };

    const handleToggleClick = async (property, isPropertyFavourited) => {
        try {
            if(isPropertyFavourited) {
                await fetch(`http://127.0.0.1:5000/api/favourites/addFavourite?user_id=${userID}&uprn=${property.uprn}`, {
                    method: 'POST',
                });
              } else {
                await fetch(`http://127.0.0.1:5000/api/favourites/removeFavourite?user_id=${userID}&uprn=${property.uprn}`, {
                    method: 'DELETE',
                });
              }

              fetchFavouriteProperties();
            
          } catch (e) {
            console.error("Unable to update favourites", e);
          }
    };


    useEffect(() => {
        fetchFavouriteProperties();
    }, []);


   return (
        <div> 
            <h1 className = "stylingTitle">Your Favourite Properties</h1>
                <div className = "propertiesList">
                    {favouriteProperties.map((property) => (
                        <TopRatedPropertyCard
                            key = {property.uprn}
                            property = {property}
                            isPropertyFavourited={true}
                        />
                    ))}
                </div>
        </div>
   );
};

export default FavouritePage;