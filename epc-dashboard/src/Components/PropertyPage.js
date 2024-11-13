// PropertyPage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';

const PropertyPage = () => {
  const location = useLocation();
  const address = location.state ? location.state.address : '';
  const postcode = location.state ? location.state.postcode : '';
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');

  // Fetch property details using address and postcode
  const fetchPropertyDetails = () => {
    fetch(`http://127.0.0.1:5000/api/property/getInfo?address=${encodeURIComponent(address)}&postcode=${encodeURIComponent(postcode)}`)
      .then(response => response.json())
      .then(data => setPropertyData(data))
      .catch(error => console.error('Error fetching property data:', error));
  };

  // Fetch coordinates based on address for Google Maps
  const fetchLocationCoords = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocationCoords({ lat, lng });

          // Create Street View URL
          const streetView = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`;
          setStreetViewURL(streetView);
        } else {
          setErrorMessage('Address not found.');
        }
      })
      .catch(error => setErrorMessage('Failed to fetch location data.'));
  };

  useEffect(() => {
    if (address && postcode) {
      fetchPropertyDetails();
      fetchLocationCoords();
    }
  }, [address, postcode]);

  return (
    <div style={{ display: 'flex', minHeight: '10vh', flexDirection: 'column', padding: '10px' }}>
      <h2>Property Details for {address}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>Street View</h3>
          {streetViewURL ? <img src={streetViewURL} alt="Street View" style={{ width: '100%' }} /> : <p>Loading street view...</p>}
        </div>
        <EPCGraph
          currentEnergyEfficiency={propertyData?.currentEnergyEfficiency}
          potentialEnergyEfficiency={propertyData?.potentialEnergyEfficiency}
        />
      </div>
      <table style={{ width: '100%', marginTop: '20px' }}>
        <tbody>
          {propertyData && (
            <>
              <tr><td>Lodgement Date:</td><td>{propertyData.lodgementDate}</td></tr>
              <tr><td>Current Energy Rating:</td><td>{propertyData.currentEnergyRating}</td></tr>
              <tr><td>Potential Energy Rating:</td><td>{propertyData.potentialEnergyRating}</td></tr>
              <tr><td>Property Type:</td><td>{propertyData.propertyType}</td></tr>
              <tr><td>Built Form:</td><td>{propertyData.builtForm}</td></tr>
              <tr><td>Construction Age Band:</td><td>{propertyData.constructionAgeBand}</td></tr>
              <tr><td>Tenure:</td><td>{propertyData.tenure}</td></tr>
            </>
          )}
        </tbody>
      </table>
      <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
        <h3>Map View</h3>
        <LoadScript googleMapsApiKey="AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c">
          <GoogleMap center={locationCoords} zoom={15} mapContainerStyle={{ height: '100%', width: '100%' }}>
            <Marker position={locationCoords} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default PropertyPage;
