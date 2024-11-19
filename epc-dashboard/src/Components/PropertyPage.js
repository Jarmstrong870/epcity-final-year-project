import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable';

const PropertyPage = () => {
  const { uprn } = useParams(); // Get UPRN from URL (for PropertyList)
  const location = useLocation(); // Get state (for TopRatedPropertyCard)
  const addressFromState = location.state?.address; 
  const postcodeFromState = location.state?.postcode;

  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c",
  });

  const fetchPropertyDetails = (uprn) => {
    fetch(`http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Log the response
        setPropertyData(data[0]); // Ensure this matches the expected structure
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching property data:', error);
        setLoading(false);
      });
  };

  const fetchLocationCoords = (fullAddress) => {
    const API_KEY = "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c";

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocationCoords({ lat, lng });
          setStreetViewURL(`https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`);
        } else {
          setErrorMessage("Address not found. Unable to display map or street view.");
        }
      })
      .catch(error => {
        console.error("Failed to fetch location data:", error);
        setErrorMessage("Failed to fetch location data.");
      });
  };

  useEffect(() => {
    if (uprn) {
      // Fetch data using UPRN
      fetchPropertyDetails(uprn);
    } else if (addressFromState && postcodeFromState) {
      // Use address and postcode from state for top-rated properties
      const fullAddress = `${addressFromState}, ${postcodeFromState}`;
      fetchLocationCoords(fullAddress);
    }
  }, [uprn, addressFromState, postcodeFromState]);

  useEffect(() => {
    if (propertyData && propertyData.address && propertyData.postcode) {
      const fullAddress = `${propertyData.address}, ${propertyData.postcode}`;
      fetchLocationCoords(fullAddress);
    }
  }, [propertyData]);

  return (
    <div style={{ display: 'flex', minHeight: '10vh', flexDirection: 'column', padding: '10px' }}>
      <h2>Property Details</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ flex: 1, maxWidth: '45%', marginRight: '10px' }}>
          <h3>Street View</h3>
          {streetViewURL ? (
            <img src={streetViewURL} alt="Street View" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
          ) : (
            <p>{errorMessage || 'Loading street view...'}</p>
          )}
        </div>

        <div style={{ flex: 1, maxWidth: '45%' }}>
          {propertyData && (
            <EPCGraph
              currentEnergyEfficiency={propertyData.current_energy_efficiency}
              potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
            />
          )}
        </div>
      </div>

      {propertyData ? (
        <EPCFullTable properties={[propertyData]} loading={loading} />
      ) : (
        <p>Loading property data...</p>
      )}

      <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
        <h3>Map View</h3>
        {isLoaded ? (
          <GoogleMap center={locationCoords} zoom={15} mapContainerStyle={{ height: '100%', width: '100%' }}>
            <Marker position={locationCoords} />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PropertyPage;
