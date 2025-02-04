import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = ({ locationCoords }) => {
  const API_KEY = "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c"; // Ensure you have this in your .env file

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <GoogleMap
      center={locationCoords}
      zoom={15}
      mapContainerStyle={{ height: '100%', width: '100%' }}
    >
      <Marker position={locationCoords} />
    </GoogleMap>
  );
};

export default MapComponent;
