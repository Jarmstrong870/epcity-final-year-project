import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable';

const PropertyPage = () => {
  const { uprn } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);

  // Load Google Maps API script only once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c",
  });

  const fetchPropertyDetails = () => {
    fetch(`http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setPropertyData(data[0]);
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
          setStreetViewURL(`https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`);
        } else {
          setErrorMessage("Address not found. Unable to display map or street view.");
        }
      })
      .catch(error => {
        console.error("Failed to fetch location data:", error);
        setErrorMessage("Failed to fetch location data.");
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Property Details</h2>

      {/* Street View and Map Side-by-Side */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* Street View Image */}
        <div style={{ flex: 1, marginRight: '10px' }}>
          <h3 style={{ textAlign: 'center' }}>Street View</h3>
          {streetViewURL ? (
            <img
              src={streetViewURL}
              alt="Street View"
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '10px' }}
            />
          ) : (
            <p style={{ textAlign: 'center' }}>{errorMessage || 'Loading street view...'}</p>
          )}
        </div>

        {/* Google Map */}
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <h3 style={{ textAlign: 'center' }}>Map View</h3>
          {isLoaded ? (
            <GoogleMap
              center={locationCoords}
              zoom={15}
              mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '10px' }}
            >
              <Marker position={locationCoords} />
            </GoogleMap>
          ) : (
            <p style={{ textAlign: 'center' }}>Loading map...</p>
          )}
        </div>
      </div>

      {/* EPC Full Table */}
      {propertyData ? (
        <EPCFullTable properties={[propertyData]} loading={loading} />
      ) : (
        <p>{errorMessage || "Loading property details..."}</p>
      )}

      {/* EPC Graph */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {propertyData && (
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <EPCGraph
              currentEnergyEfficiency={propertyData.current_energy_efficiency}
              potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPage;
