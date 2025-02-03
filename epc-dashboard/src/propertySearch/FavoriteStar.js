import React, { useState } from 'react';

// A functional component to display a star icon for favoriting/unfavoriting a property.
const FavoriteStar = ({ propertyData, onToggle }) => {
  // State to track whether the property is favorited.
  const [isFavorited, setIsFavorited] = useState(false);

  // Function to handle the toggle action when the star is clicked.
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited); // Update the favorite state (toggle between true and false).
    if (onToggle) {
      onToggle(propertyData, !isFavorited); // Call the provided callback function, passing the property data and new favorite state.
    }
  };

  return (
    <div
      style={{
        display: 'flex', // Center the star icon horizontally.
        justifyContent: 'center', // Align the star icon to the center horizontally.
        alignItems: 'center', // Align the star icon to the center vertically.
        width: 'auto', // Automatically size the width based on content.
        height: 'auto', // Automatically size the height based on content.
      }}
    >
      <div
        style={{
          fontSize: '2rem', // Set the font size for the star icon.
          lineHeight: '2rem', // Set the line height to match the font size for alignment.
          cursor: 'pointer', // Change the cursor to a pointer on hover to indicate it's clickable.
          color: isFavorited ? 'gold' : 'gray', // Gold color for favorited, gray otherwise.
          transition: 'color 0.3s ease', // Smooth transition for the color change.
        }}
        onClick={toggleFavorite} // Call the toggle function when the star is clicked.
        title={isFavorited ? 'Click to unfavorite' : 'Click to favorite'} // Tooltip text based on the favorite state.
      >
        ★ {/* Render the star icon */}
      </div>
    </div>
  );
};

export default FavoriteStar;
// Export the component for use in other parts of the application.
