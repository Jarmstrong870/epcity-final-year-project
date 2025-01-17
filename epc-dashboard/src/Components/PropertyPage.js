import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable';

const PropertyPage = ({ language }) => {
<<<<<<< HEAD
  const {uprn} = useParams();
  
  console.log('uprn is:', uprn, 'Type:', typeof uprn);
=======
  const { uprn } = useParams();

>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  console.log("uprn is:",uprn);

  // Translations for multilingual support
  const translations = {
    en: {
      streetView: 'Street View',
      mapView: 'Map View',
    },
    fr: {
      streetView: 'Vue de Rue',
      mapView: 'Vue de Carte',
    },
    es: {
      streetView: 'Vista de la Calle',
      mapView: 'Vista del Mapa',
    },
  };
<<<<<<< HEAD
=======

>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
  const t = translations[language] || translations.en; // Default to English

  // Load Google Maps API script
  const { isLoaded } = useJsApiLoader({
<<<<<<< HEAD
    googleMapsApiKey: "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c",
=======
    googleMapsApiKey: 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c',
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
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
<<<<<<< HEAD
    const API_KEY = "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c";
=======
    const API_KEY = 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c';
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d

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
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              postcode
            )}&key=${API_KEY}`
          )
            .then((response) => response.json())
            .then((postcodeData) => {
              if (postcodeData.results && postcodeData.results.length > 0) {
                const { lat, lng } = postcodeData.results[0].geometry.location;
                setLocationCoords({ lat, lng });
                setStreetViewURL(
                  `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`
                );
              } else {
                setErrorMessage('Postcode not found. Unable to display map or street view.');
              }
            })
            .catch((error) => {
              console.error('Failed to fetch location data with postcode fallback:', error);
              setErrorMessage('Failed to fetch location data with postcode fallback.');
            });
        }
      })
      .catch((error) => {
        console.error('Failed to fetch location data:', error);
        setErrorMessage('Failed to fetch location data.');
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h2>Property Details</h2>

      {/* Image and Map Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* Street View */}
        <div style={{ flex: 1, marginRight: '20px', height: '400px' }}>
          <h3>{t.streetView}</h3>
          {streetViewURL ? (
            <img
              src={streetViewURL}
              alt={t.streetView}
              style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }}
            />
          ) : (
            <p>{errorMessage || 'Loading street view...'}</p>
          )}
        </div>

        {/* Google Map */}
        <div style={{ flex: 1, height: '400px' }}>
          <h3>{t.mapView}</h3>
          {isLoaded ? (
<<<<<<< HEAD
            <GoogleMap center={locationCoords} zoom={15} mapContainerStyle={{ height: '100%', width: '100%' }}>
=======
            <GoogleMap
              center={locationCoords}
              zoom={15}
              mapContainerStyle={{ height: '100%', width: '100%' }}
            >
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
              <Marker position={locationCoords} />
            </GoogleMap>
          ) : (
            <p>Loading map...</p>
          )}
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>

      {/* EPC Table with Translations */}
      {propertyData ? (
        <EPCFullTable properties={[propertyData]} loading={loading} language={language} />
      ) : (
        <p>{errorMessage || 'Loading property details...'}</p>
      )}

<<<<<<< HEAD
      {/* EPC Graph */}
=======
      {/* EPC Graph with Translations */}
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        {propertyData && (
          <EPCGraph
            currentEnergyEfficiency={propertyData.current_energy_efficiency}
            potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
<<<<<<< HEAD
=======
            language={language} // Pass the language prop to EPCGraph
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
          />
        )}
      </div>
    </div>
  );
};

export default PropertyPage;
