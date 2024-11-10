import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EPCGraph from './EPCGraph'; // Import EPCGraph component

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

          const streetView = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c`;
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
    <div style={{ display: 'flex', minHeight: '10vh', flexDirection: 'column', padding: '10px' }}>
      {/* Street View and EPC Graph Section */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
        {/* Street View Section */}
        <div style={{ width: '48%', marginRight: '2%' }}>
          <h3 style={{ color: 'black', fontSize: '18px', marginBottom: '10px' }}>Street View</h3>
          {streetViewURL ? (
            <img src={streetViewURL} alt="Street View" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
          ) : (
            <p>Loading street view...</p>
          )}
        </div>

        {/* EPC Graph Section */}
        <div style={{ width: '48%' }}>
          <EPCGraph
            currentEnergyEfficiency={propertyData.currentEnergyEfficiency}
            potentialEnergyEfficiency={propertyData.potentialEnergyEfficiency}
          />
        </div>
      </div>

      {/* Property Information Section */}
      <div style={{ width: '100%', marginTop: '40px' }}>
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

      {/* Google Map Section */}
      <div style={{ width: '100%', height: '400px', marginTop: '40px' }}>
        <h3 style={{ color: 'black', fontSize: '18px', marginBottom: '50px' }}> Map View</h3>
        <LoadScript googleMapsApiKey="AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c">
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '100%',
            }}
            center={locationCoords}
            zoom={15}
          >
            <Marker position={locationCoords} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default PropertyPage;
