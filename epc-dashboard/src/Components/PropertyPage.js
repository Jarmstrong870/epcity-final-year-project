import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const PropertyPage = () => {
  const location = useLocation();
  const address = location.state ? location.state.address : '';
  const [streetViewURL, setStreetViewURL] = useState('');
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [propertyData, setPropertyData] = useState({
    lodgementDate: '30 Sep 2024',
    currentEnergyRating: 'D',
    potentialEnergyRating: 'B',
    currentEnergyEfficiency: 66,
    potentialEnergyEfficiency: 84,
    propertyType: 'Bungalow',
    builtForm: 'Detached',
    constructionAgeBand: 'England and Wales: 1967-1975',
    tenure: 'Owner-occupied'
  });

  useEffect(() => {
    if (address) {
      fetchLocationCoords(address);
    }
  }, [address]);

  const fetchLocationCoords = (address) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocationCoords({ lat, lng });

          const streetView = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`;
          setStreetViewURL(streetView);
        } else {
          setErrorMessage("Address not found.");
        }
      })
      .catch((error) => {
        setErrorMessage("Failed to fetch location data.");
        console.error("Error fetching location:", error);
      });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', padding: '10px' }}>
      
      {/* Street View */}
      <div style={{ width: '100%', marginBottom: '10px' }}>
        <h3 style={{ marginBottom: '10px' }}>Street View</h3>
        {streetViewURL ? (
          <img src={streetViewURL} alt="Street View" style={{ width: '100%', maxWidth: '600px', height: '300px', marginBottom: '20px' }} />
        ) : (
          <p>Loading street view...</p>
        )}
      </div>

      {/* Property Information Table */}
      <div style={{ width: '100%', marginBottom: '10px' }}>
        <h3>Property Information</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td><strong>Lodgement Date:</strong></td>
              <td>{propertyData.lodgementDate}</td>
            </tr>
            <tr>
              <td><strong>Current Energy Rating:</strong></td>
              <td>{propertyData.currentEnergyRating}</td>
            </tr>
            <tr>
              <td><strong>Potential Energy Rating:</strong></td>
              <td>{propertyData.potentialEnergyRating}</td>
            </tr>
            <tr>
              <td><strong>Current Energy Efficiency:</strong></td>
              <td>{propertyData.currentEnergyEfficiency}%</td>
            </tr>
            <tr>
              <td><strong>Potential Energy Efficiency:</strong></td>
              <td>{propertyData.potentialEnergyEfficiency}%</td>
            </tr>
            <tr>
              <td><strong>Property Type:</strong></td>
              <td>{propertyData.propertyType}</td>
            </tr>
            <tr>
              <td><strong>Built Form:</strong></td>
              <td>{propertyData.builtForm}</td>
            </tr>
            <tr>
              <td><strong>Construction Age Band:</strong></td>
              <td>{propertyData.constructionAgeBand}</td>
            </tr>
            <tr>
              <td><strong>Tenure:</strong></td>
              <td>{propertyData.tenure}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Map View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <h3 style={{ marginBottom: '10px' }}>Map View</h3>
        <div style={{ height: '400px', width: '100%' }}>
          <LoadScript googleMapsApiKey="AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c">
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }} // Ensures map takes full space of container
              center={locationCoords} // Center the map at the fetched coordinates
              zoom={18} // Max zoom level for a detailed view
            >
              {/* No marker here */}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
