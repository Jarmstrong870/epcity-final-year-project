import React, { useState, useEffect } from 'react';

const StreetViewComponent = ({ address, postcode }) => {
  const [streetViewURL, setStreetViewURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLocationCoords = () => {
      const fullAddress = postcode ? `${address}, ${postcode}` : address;

      // First attempt: Use full address
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            const streetView = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`;
            setStreetViewURL(streetView);
          } else {
            console.warn("Full address failed. Attempting to resolve with postcode only.");
            // Fallback to using postcode only
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode)}&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`)
              .then((response) => response.json())
              .then((postcodeData) => {
                if (postcodeData.results && postcodeData.results.length > 0) {
                  const { lat, lng } = postcodeData.results[0].geometry.location;
                  const streetView = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`;
                  setStreetViewURL(streetView);
                } else {
                  setErrorMessage('Postcode not found. Unable to load Street View.');
                }
              })
              .catch((error) => {
                console.error('Error fetching postcode location:', error);
                setErrorMessage('Failed to fetch Street View with postcode fallback.');
              });
          }
        })
        .catch((error) => {
          console.error('Error fetching location:', error);
          setErrorMessage('Failed to fetch Street View.');
        });
    };

    if (address || postcode) {
      fetchLocationCoords();
    }
  }, [address, postcode]);

  return (
    <div>
      {streetViewURL ? (
        <img src={streetViewURL} alt="Street View" style={{ width: '100%', height: '100%' }} />
      ) : (
        <p>{errorMessage || 'Loading street view...'}</p>
      )}
    </div>
  );
};

export default StreetViewComponent;
