import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

// A functional component to display a Google Map with a marker.
const MapView = ({ locationCoords, isLoaded, errorMessage }) => {
  // If the Google Maps API is not yet loaded, display a loading message.
  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  // If there's an error message, display it.
  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  // If the API is loaded and there are no errors, render the map.
  return (
    <GoogleMap
      center={locationCoords} // Set the map's center to the provided coordinates.
      zoom={15} // Set the zoom level of the map.
      mapContainerStyle={{
        height: '100%', // Make the map container take up the full height of its parent.
        width: '100%', // Make the map container take up the full width of its parent.
      }}
    >
      <Marker position={locationCoords} /> {/* Add a marker at the given coordinates. */}
    </GoogleMap>
  );
};

export default MapView;
// Export the component for use in other parts of the application.
