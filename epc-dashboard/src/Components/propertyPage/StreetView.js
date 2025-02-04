import React from 'react';
import './StreetView.css'; // Import the CSS file

// A functional component to display a Street View image or appropriate messages.
const StreetView = ({ streetViewURL, errorMessage }) => {
  // If there is an error message, display it.
  if (errorMessage) {
    return <p className="street-view-error">{errorMessage}</p>;
  }

  // If the Street View URL is not yet available, show a loading message.
  if (!streetViewURL) {
    return <p className="street-view-loading">Loading street view...</p>;
  }

  // If the Street View URL is available, display the image.
  return (
    <img
      src={streetViewURL} // URL of the Street View image.
      alt="Street View" // Alternate text for the image.
      className="street-view-image" // Use the CSS class for styling the image.
    />
  );
};

export default StreetView;
// Export the component for use in other parts of the application.
