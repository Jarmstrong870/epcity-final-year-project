import React, {createContext, useState } from 'react' ;

export const FavouriteContext = createContext();

export function FavouriteProvider ({ children }) {
    const [favouriteProperties, setFavouriteProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    
    /* 
        add uses the await fetch to make a request to the favouriteController backend and once 
        fetch is successfuly currentFavourites array is set. 
        
        newFavourites has been set to contain the contents already within currentFavourites array.
        
        nF and status has been definied in order for the for loop to go through the currentFavourites array, 
        matching the property's uprn within currentProperties to the selected property's uprn. If there isn't a uprn matched,
        the property is added to newFavourites array, esle it is can't be added to avoid duplication based on status. 

        updatedFavourites is the newly refreshed array once a property has been added successfully
    */


    const addFavourite = async (user, property) => {
        try {
            const added = await fetch(`http://127.0.0.1:5000/favourites/addFavourite?email=${user.email}&uprn=${property.uprn}`);
            console.log("property added");
            console.log("added:", user.email);
            console.log("added:", property.uprn);
            if (added.ok){
                setFavouriteProperties((currentFavourites) => {
                    const newFavourites = [...currentFavourites]; // setting newFavourites to contain contents already in currentFavourites
                    let status = false;

                    for(let i = 0; i < currentFavourites.length; i++) { // looping through currentFavourites array
                        if(currentFavourites[i].uprn === property.uprn) {
                            status = true;
                            break;
                        }
                    }
                    if (!status) {
                        newFavourites.push(property);
                    }
                    return newFavourites;   // reutrning updated array with newly added favourite
                });  
            } else {
                console.log("unable to remove favourites")
            }
        } catch (e){
            console.log("error removing property", e);
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

    const removeFavourite = async (user, property) => {
        try {
            const removed = await fetch(`http://127.0.0.1:5000/favourites/removeFavourite?email=${user.email}&uprn=${property.uprn}`);
            console.log("property removed");
            console.log("removed:", user.email);
            console.log("removed:", property.uprn);
            if (removed.ok){
                setFavouriteProperties((currentFavourites) => {

                    const newFavourites = []; // define blank array to add updated favourites 

                    for(let i = 0; i < currentFavourites.length; i++){  // looping through currentFavourites
                        if(currentFavourites[i].uprn !== property.uprn) {
                            newFavourites.push(currentFavourites[i]); 
                        }
                    }

                    return newFavourites;   // returning updated array with specified property removed
                });
            } else {
                console.log("unable to remove favourites")
            }
        } catch (e){
            console.log("error removing property", e);
        }
    };

    /*
        isFavourited will iterate through the favouriteProperties array and check if a 
        property uprn already exists in the array
    */

    const isFavourited = (uprn) => {
        for(let i = 0; i < favouriteProperties.length; i++){
            if(String(favouriteProperties[i].uprn) === String(uprn)){
                return true;
            }
        }
        return false;
    };
    
    return (
        <FavouriteContext.Provider
        value = {{  
            loading,
            favouriteProperties,
            addFavourite,
            removeFavourite,
            isFavourited,
        }}
        >
            {children}
        </FavouriteContext.Provider>
    )
  
}