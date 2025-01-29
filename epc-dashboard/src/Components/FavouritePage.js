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

    useEffect(() => {
    const fetchFavouritedProperties = async () => {
        try{
            //console.log("users email = ", user.email);
            const data = await fetch(`http://127.0.0.1:5000/favourites/getFavourites?email=${user.email}`);
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
    }, [user.email]);

    const updateFavouritedProperties = (uprn) => {
        setFavouriteProperties((currentFavourites) => {
            const updatedFavourites = [];
            for (let i = 0; i < currentFavourites.length; i++) {
                if (currentFavourites[i].uprn !== uprn) {
                    updatedFavourites.push(currentFavourites[i]);
                }
            }
            return updatedFavourites;
        });
    };

    return (
        <div className="favouritedPropertyCards">
            <h2 className="stylingTitle">{t.title}</h2>              
                <div className="property-grid">
                {favouritedProperties.map((property, index) => (
                <TopRatedPropertyCard key={index} user = {user} property={property}  language={language} favouriteStatus = {updateFavouritedProperties}/>))}
                </div>
        </div>
    );
};

    export default FavouritePage;