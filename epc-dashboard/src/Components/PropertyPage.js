import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable';

const PropertyPage = () => {
  const {uprn} = useParams();
  
  console.log('uprn is:', uprn, 'Type:', typeof uprn);
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  console.log("uprn is:",uprn);

  // Load Google Maps API script only once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c",
  });

  const fetchPropertyDetails = () => {
    fetch(`http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setPropertyData(data[0]); // Ensure we're passing only the first property in case of multiple results
        } else {
          setErrorMessage("No property data available.");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching property data:', error);
        setErrorMessage("Failed to fetch property details.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (uprn) {
      fetchPropertyDetails();
    }
  }, [uprn]);

  useEffect(() => {
    if (propertyData && propertyData.address && propertyData.postcode) {
      const fullAddress = `${propertyData.address}, ${propertyData.postcode}`;
      fetchLocationCoords(fullAddress);
    }
  }, [propertyData]);

  const fetchLocationCoords = (fullAddress) => {
    const API_KEY = "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c";

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocationCoords({ lat, lng });
          setStreetViewURL(`https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`);
        } else {
          setErrorMessage("Address not found. Unable to display map or street view.");
          console.warn("No results found for the given address and postcode.");
        }
      })
      .catch(error => {
        console.error("Failed to fetch location data:", error);
        setErrorMessage("Failed to fetch location data.");
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h2>Property Details</h2>

      {/* Image and Map Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* Street View */}
        <div style={{ flex: 1, marginRight: '20px', height: '400px' }}>
          <h3>Street View</h3>
          {streetViewURL ? (
            <img src={streetViewURL} alt="Street View" style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
          ) : (
            <p>{errorMessage || 'Loading street view...'}</p>
          )}
        </div>

        {/* Google Map */}
        <div style={{ flex: 1, height: '400px' }}>
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

      {/* EPC Table */}
      {propertyData ? (
        <EPCFullTable properties={[propertyData]} loading={loading} />
      ) : (
        <p>{errorMessage || "Loading property details..."}</p>
      )}

      {/* EPC Graph */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        {propertyData && (
          <EPCGraph
            currentEnergyEfficiency={propertyData.current_energy_efficiency}
            potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyPage;
