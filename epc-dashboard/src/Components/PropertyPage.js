import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable';

const FavoriteStar = ({ isFavorited, toggleFavorite }) => {
  return (
    <span
      style={{
        fontSize: '3rem',
        cursor: 'pointer',
        color: isFavorited ? 'gold' : 'gray',
        position: 'absolute',
        right: '20px',
        top: '20px',
      }}
      onClick={toggleFavorite}
      title={isFavorited ? 'Unfavorite' : 'Favorite'}
    >
      ★
    </span>
  );
};

const PropertyPage = ({ language }) => {
  const { uprn } = useParams();

  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c',
  });

  const fetchPropertyDetails = () => {
    fetch(`http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setPropertyData(data[0]);
        } else {
          setErrorMessage('No property data available.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching property data:', error);
        setErrorMessage('Failed to fetch property details.');
        setLoading(false);
      });
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    setPopupMessage(
      !isFavorited
        ? `${propertyData?.address || 'This property'} has been favorited.`
        : `${propertyData?.address || 'This property'} has been unfavorited.`
    );
    setShowPopup(true);

    // Hide the popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  useEffect(() => {
    if (uprn) {
      fetchPropertyDetails();
    }
  }, [uprn]);

  useEffect(() => {
    if (propertyData && propertyData.address && propertyData.postcode) {
      fetchLocationCoords(propertyData.address, propertyData.postcode);
    }
  }, [propertyData]);

  const fetchLocationCoords = (fullAddress, postcode) => {
    const API_KEY = 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c';

    const sanitizedAddress = `${fullAddress}, ${postcode}`.replace(/,+/g, ',').trim();

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        sanitizedAddress
      )}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocationCoords({ lat, lng });
          setStreetViewURL(
            `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`
          );
        } else {
          setErrorMessage('Postcode not found. Unable to display map or street view.');
        }
      })
      .catch((error) => {
        console.error('Failed to fetch location data:', error);
        setErrorMessage('Failed to fetch location data.');
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      {/* Popup Message */}
      {showPopup && (
        <div className="popup">
          {popupMessage}
        </div>
      )}

      {/* Header Section */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ margin: 0 }}>Property Details</h2>
        <FavoriteStar isFavorited={isFavorited} toggleFavorite={toggleFavorite} />
      </div>

      {/* Image and Map Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px', height: '400px' }}>
          <h3>Street View</h3>
          {streetViewURL ? (
            <img
              src={streetViewURL}
              alt="Street View"
              style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }}
            />
          ) : (
            <p>{errorMessage || 'Loading street view...'}</p>
          )}
        </div>
        <div style={{ flex: 1, height: '400px' }}>
          <h3>Map View</h3>
          {isLoaded ? (
            <GoogleMap
              center={locationCoords}
              zoom={15}
              mapContainerStyle={{ height: '100%', width: '100%' }}
            >
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
        <EPCFullTable properties={[propertyData]} loading={loading} language={language} />
      ) : (
        <p>{errorMessage || 'Loading property details...'}</p>
      )}

      {/* EPC Graph */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        {propertyData && (
          <EPCGraph
            currentEnergyEfficiency={propertyData.current_energy_efficiency}
            potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyPage;
