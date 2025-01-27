import React, { useState } from 'react';

const FavoriteStar = ({ propertyData, onToggle }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (onToggle) {
      onToggle(propertyData, !isFavorited); // Pass the property and favorite state
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
