import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StreetViewComponent from '.././homePage/StreetViewComponent';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import './FavouritePage.css';
import translations from '../locales/translations_favouritepage'; // Import translations

/*
    Favourite Page is called once a property has been favourited, the 
    property card will appear on this page under a 'My Favourites' and once 
    unfavourited the property will be removed from this page
*/ 

const FavouritePage = ({user, language}) => {
    const [favouritedProperties, setFavouriteProperties] = useState([]);
    const [loading, setLoading] = useState(true);


    const t = translations[language] || translations.en; // Load translations

    /*
        fetchFavouritedProperties uses the fetch the data from the backend API getFavourites method based on the 
        user's email and will populate the favouritedProperties array with the response data.
    */

    useEffect(() => {
    const fetchFavouritedProperties = async () => {
        try{
            //console.log("users email = ", user.email);
            const email = encodeURIComponent(user.email);
            const data = await fetch(`http://127.0.0.1:5000/favourites/getFavourites?email=${email}`);
            if (!data.ok) {
                throw new Error('Failed to fetch property data');
            }
            const favouriteData = await data.json();
            setFavouriteProperties(favouriteData); 
            console.log(favouritedProperties);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        }
    };

        fetchFavouritedProperties();
    }, [user?.email]);

    /* 
        updateFavouriteProperties is called to remove a property based on their specifc uprn. If the property's
        uprn that has been chosen to be removed does not match one that is already found in the currentFavourites array,
        that property will be successfully added to the array and the updatedFavourites array is returned with 
        this change.
    */ 

    const updateFavouritedProperties = (uprn) => {
        const updatedFavourites = [];
        setFavouriteProperties((currentFavourites) => {
            for (let i = 0; i < currentFavourites.length; i++) {
              if (currentFavourites[i].uprn !== uprn) {
                    updatedFavourites.push(currentFavourites[i]);
                }
            }
            return updatedFavourites;
        });
        return updatedFavourites;
    };

    return (
        <div className="favouritedPropertyCards">
            <h2 className="stylingTitle">{t.title}</h2>              
                <div className="property-grid">
                {favouritedProperties.map((property, index) => (
                <TopRatedPropertyCard   /* calling Top Rated Property Card component */
                    key={index} 
                    user = {user} 
                    property={property}  
                    language={language} 
                    favouriteStatus = {(uprn, isFavourited) => {
                        if(!isFavourited) {
                            updateFavouritedProperties(uprn);
                        }
                    }}/>))}
                </div>
        </div>
    );
};

    export default FavouritePage;
