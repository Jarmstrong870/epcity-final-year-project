import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(2);

  const handleLocationSearch = (event) => {
    event.preventDefault();
    const locationInput = event.target.elements.location.value;

    // Use the Geocoding API to get the lat/lng from the location input
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationInput)}&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocation({ lat, lng });
          setZoom(12); // Set the zoom level for the searched location
        } else {
          alert("Location not found");
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleLocationSearch}>
        <input type="text" name="location" placeholder="Search for a location" required />
        <button type="submit">Search</button>
      </form>
      <LoadScript googleMapsApiKey="AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c">
        <GoogleMap
          mapContainerStyle={{ height: '200px', width: '300px' }} // Set smaller dimensions
          center={location}
          zoom={zoom}
        >
          {location.lat !== 0 && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
