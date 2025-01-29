import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import './MapView.css'; // Import the CSS file.

// A functional component to display a Google Map with a marker.
const MapView = ({ locationCoords, isLoaded, errorMessage }) => {
  // If the Google Maps API is not yet loaded, display a loading message.
  if (!isLoaded) {
    return <p className="map-loading">Loading map...</p>; // Apply the CSS class for the loading message.
  }

  // If there's an error message, display it.
  if (errorMessage) {
    return <p className="map-error">{errorMessage}</p>; // Apply the CSS class for the error message.
  }

  // If the API is loaded and there are no errors, render the map.
  return (
    <GoogleMap
      center={locationCoords} // Set the map's center to the provided coordinates.
      zoom={15} // Set the zoom level of the map.
      mapContainerClassName="map-container" // Apply the CSS class for the map container.
    >
      <Marker position={locationCoords} /> {/* Add a marker at the given coordinates. */}
    </GoogleMap>
  );
};

export default MapView;
// Export the component for use in other parts of the application.

