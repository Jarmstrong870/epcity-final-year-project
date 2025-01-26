import React, { useState } from 'react';

const FavoriteStar = ({ isPropertyFavourited, onToggle }) => {
 
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
          color: isPropertyFavourited ? 'gold' : 'gray',
          transition: 'color 0.3s ease',
        }}
        onClick={() => {
          if(onToggle)
          onToggle()
        }}
        title={isPropertyFavourited ? 'Click to unfavorite' : 'Click to favorite'}
      >
        ★
      </div>
    </div>
  );
};

export default FavoriteStar;
