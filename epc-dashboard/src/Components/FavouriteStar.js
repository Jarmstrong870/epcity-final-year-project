import React, { useState } from 'react';

const FavoriteStar = ({ propertyData, userEmail }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = async () => {
    
    if (!propertyData || !propertyData.uprn) {
      console.error('Invalid propertyData or missing uprn');
      return;
    }
    
    const { uprn } = propertyData; // Assuming `uprn` is part of `propertyData`

    try {
      // Determine the API endpoint based on the favorite state
      const url = isFavorited 
        ? `/favourites/removeFavourite?email=${userEmail}&uprn=${uprn}` // Endpoint to remove favorite
        : `/favourites/addFavourite?email=${userEmail}&uprn=${uprn}`;   // Endpoint to add favorite

      const response = await fetch(url, {
        method: 'POST', // Assuming POST request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId: propertyData.id }), // Sending property ID
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      // Update the local state after a successful fetch
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        height: 'auto',
      }}
    >
      <div
        style={{
          fontSize: '2rem',
          lineHeight: '2rem',
          cursor: 'pointer',
          color: isFavorited ? 'gold' : 'gray',
          transition: 'color 0.3s ease',
        }}
        onClick={toggleFavorite}
        title={isFavorited ? 'Click to unfavorite' : 'Click to favorite'}
      >
        ★
      </div>
    </div>
  );
};

export default FavoriteStar;