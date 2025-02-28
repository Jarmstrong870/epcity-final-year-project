import React, {createContext, useEffect, useState } from 'react' ;

export const FavouriteContext = createContext();

export function FavouriteProvider ({ children, user }) {
    const [favouriteProperties, setFavouriteProperties] = useState([]);
    
    /*
       fetchFavouritedProperties uses the fetch the data from the backend API getFavourites method based on the 
       user's email and will populate the favouritedProperties array with the response data.
    */
       
    const fetchFavouritedProperties = async () => {
        if(!user?.email)
            return;

        try{
            //console.log("users email = ", user.email);
            const email = encodeURIComponent(user.email);
            const data = await fetch(`http://127.0.0.1:5000/favourites/getFavourites?email=${email}`);
            if (!data.ok) {
                throw new Error('Failed to fetch property data');
            }

            const favouriteData = await data.json();
            setFavouriteProperties(favouriteData || []); 
            console.log(favouriteProperties);

            setTimeout(() => console.log("updated favourites", favouriteData), 100);

        } catch (error) {
            console.error('Failed to fetch properties:', error);
            setFavouriteProperties([]);
        }
    };

    useEffect(() => {
        fetchFavouritedProperties();
    }, [favouriteProperties]);


    /* 
        add uses the await fetch to make a request to the favouriteController backend and once 
        fetch is successfuly currentFavourites array is set. 
        
        newFavourites has been set to contain the contents already within currentFavourites array.
        
        nF and status has been definied in order for the for loop to go through the currentFavourites array, 
        matching the property's uprn within currentProperties to the selected property's uprn. If there isn't a uprn matched,
        the property is added to newFavourites array, esle it is can't be added to avoid duplication based on status. 

        updatedFavourites is the newly refreshed array once a property has been added successfully
    */

    const addFavourite = async (property) => {
        if(!user?.email)
            return;

        setFavouriteProperties((previousProperties) => [...previousProperties, property]);

        try {
            const added = await fetch(`http://127.0.0.1:5000/favourites/addFavourite?email=${user.email}&uprn=${property.uprn}`);
            console.log("property added");
            console.log("added:", user.email);
            console.log("added:", property.uprn);
            if (added.ok){
                await fetchFavouritedProperties();
                
                //setFavouriteProperties((currentFavourites) => 
                    //[...currentFavourites, property]);
            } else {
                setFavouriteProperties((previousFavourites) => previousFavourites.filter(previousFavourites => 
                    previousFavourites.uprn !== property.uprn));
            }
        } catch (e){
            console.log("error adding property", e);
        }
    };

    /* 
        removeFavourite uses the await fetch to make a request to the favouriteController backend and once 
        fetch is successfuly currentFavourites array is set as the number of properties currently favourited. 
        
        newFavourites has been definied in order for the for loop to go through the currentFavourites array, 
        matching the property's uprn within currentProperties to the selected property's uprn. If there isn't a uprn matched,
        the property is added to newFavourites array, esle it is to be removed. 

        updatedFavourites is the newly refreshed array once a property has been removed successfully
    */

    const removeFavourite = async (property) => {
        if(!user?.email)
            return;

        setFavouriteProperties((previous) => previous.filter(favouriteProperties => 
            favouriteProperties.uprn !== property.uprn));

        try {
            const removed = await fetch(`http://127.0.0.1:5000/favourites/removeFavourite?email=${user.email}&uprn=${property.uprn}`);
            console.log("property removed");
            console.log("removed:", user.email);
            console.log("removed:", property.uprn);
            if (!removed.ok){
                throw new Error("Unable to remove favourite");
                //setFavouriteProperties((currentFavourites) => 
                    //currentFavourites.filter((favourite) => favourite.uprn !== property.uprn));
            } 
            
            await fetchFavouritedProperties();

        } catch (e){
            console.log("error removing property", e);
        }
    };

    

    /*
        isFavourited will iterate through the favouriteProperties array and check if a 
        property uprn already exists in the array
    */

    const isFavourited = (uprn) => {
        return favouriteProperties.some((favourite) => String(favourite.uprn) === String(uprn));
        //for(let i = 0; i < favouriteProperties.length; i++){
            //if(String(favouriteProperties[i].uprn) === String(uprn)){
                //return true;
            //}
        //}
    };
        
    return (
        <FavouriteContext.Provider
        value = {{  
            favouriteProperties,
            fetchFavouritedProperties,
            addFavourite,
            removeFavourite,
            isFavourited,
        }}
        >
            {children}
        </FavouriteContext.Provider>
    )
  
}
