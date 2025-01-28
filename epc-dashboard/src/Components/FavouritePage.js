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
    const navigate = useNavigate();
    const [favouritedProperty, setFavouriteProperties] = useState([]);
    const [loading, setLoading] = useState();
    
    const t = translations[language] || translations.en; // Load translations

    const fetchFavouritedProperties = async () => {
        try {
            if(!fetchFavouritedProperties){
                const fetchedFavourite = await fetch(`http://127.0.0.1:5000/api/favourites/getFavourites?email=${user.email}`);
                console.log(fetchedFavourite);
                setFavouriteProperties(fetchedFavourite);
            } else {
                console.error("Unable to fetch favourited properties");
            }
        } catch (err) {
            console.error("Error fetching properties")
        }
            setLoading(false); 
        }

    useEffect(() => {
        fetchFavouritedProperties();
    }, []);

    return (
        <div className="favouritedPropertyCards" /*onClick={handleClick}*/>
            <h2 className="stylingTitle">{t.title}</h2>              
            <div className="propertyDetails">
                <h3 className = "propertyDetails">
                    {favouritedProperty.address}
                </h3>
                {favouritedProperty.map((favouritedProperty, index) => (
                <TopRatedPropertyCard user = {user} key={index} property={favouritedProperty} language={language} /> ))}
            </div>

            
        </div>
    );
};

    export default FavouritePage;