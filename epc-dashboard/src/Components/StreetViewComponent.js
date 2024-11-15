import React, { useState, useEffect } from 'react';

const StreetViewComponent = ({ address }) => {
  const [streetViewURL, setStreetViewURL] = useState(null);

  useEffect(() => {
    const fetchLocationCoords = () => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            const streetView = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`;
            setStreetViewURL(streetView);
          }
        })
        .catch((error) => console.error("Error fetching location:", error));
    };

    fetchLocationCoords();
  }, [address]);

  return (
    <div>
      {streetViewURL ? (
        <img src={streetViewURL} alt="Street View" style={{ width: '100%', height: '100%' }} />
      ) : (
        <p>Loading street view...</p>
      )}
    </div>
  );
};

export default StreetViewComponent;
