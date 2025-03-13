import React, { useContext, useState, useEffect } from 'react';
import PropertyCard from '../homePage/PropertyCard';
import './FavouritePage.css';
import translations from '../locales/translations_favouritepage'; // Import translations
import { FavouriteContext } from './utils/favouriteContext';

/*
    Favourite Page is called once a property has been favourited, the 
    property card will appear on this page under a 'My Favourites' and once 
    unfavourited the property will be removed from this page
*/ 

const FavouritePage = ({user, language}) => {
    const { favouriteProperties, fetchFavouritedProperties } = useContext(FavouriteContext);

    const t = translations[language] || translations.en; // Load translations

    useEffect(() => {
        fetchFavouritedProperties();
    }, [user]);

    return (
        <div className="favouritedPropertyCards">
            <h2 className="stylingTitle">{t.title}</h2>              
                <div className="property-grid">
                {favouriteProperties.length === 0 ? (
                    <p>No properties have been favourited yet </p>
                ) : (
                    favouriteProperties.map((property) => (
                    <PropertyCard   /* calling Top Rated Property Card component */
                        key={property.uprn} 
                        user = {user} 
                        property={property}  
                        language={language} 
                    />
                ))
            )}
            </div>
        </div>
    );
};

    export default FavouritePage;
