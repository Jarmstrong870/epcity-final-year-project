import React, { useState } from 'react';

const FavoriteStar = () => {
  // State to track whether the star is favorited
  const [isFavorited, setIsFavorited] = useState(false);

  // Toggle the favorite state
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // Centers the star horizontally
        alignItems: 'center', // Centers the star vertically
        width: 'auto', // Ensures the container doesn't restrict the star
        height: 'auto',
      }}
    >
      <div
        style={{
          fontSize: '20rem', // Adjust size for scaling
          lineHeight: '10rem', // Ensure proper alignment
          cursor: 'pointer',
          color: isFavorited ? 'gold' : 'gray',
          transition: 'color 0.3s ease', // Smooth transition for color changes
        }}
        onClick={toggleFavorite}
        title={isFavorited ? 'Click to unfavorite' : 'Click to favorite'} // Tooltip for better UX
      >
        ★
      </div>
    </div>
  );
};

export default FavoriteStar;
