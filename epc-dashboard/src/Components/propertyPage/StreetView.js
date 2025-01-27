import React from 'react';

// A functional component to display a Street View image or appropriate messages.
const StreetView = ({ streetViewURL, errorMessage }) => {
  // If there is an error message, display it.
  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  // If the Street View URL is not yet available, show a loading message.
  if (!streetViewURL) {
    return <p>Loading street view...</p>;
  }

  // If the Street View URL is available, display the image.
  return (
    <img
      src={streetViewURL} // URL of the Street View image.
      alt="Street View" // Alternate text for the image.
      style={{
        width: '100%', // Make the image take up the full width of its container.
        height: '100%', // Make the image take up the full height of its container.
        borderRadius: '10px', // Add rounded corners to the image.
        objectFit: 'cover', // Ensure the image covers the container without distortion.
      }}
    />
  );
};

export default StreetView;
// Export the component for use in other parts of the application.
