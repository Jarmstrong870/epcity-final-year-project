import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable';
import FavouriteStar from './FavouriteStar';

const PropertyPage = ({ email, language }) => {
  const { uprn } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c', // Replace with your API key
  });

  // Fetch property details
  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`);
      if (response.ok) {
        const data = await response.json();
        setPropertyData(data[0]);
        fetchFavouriteStatus(data[0]?.uprn);
      } else {
        setErrorMessage('Failed to fetch property details.');
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      setErrorMessage('Failed to fetch property details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite status
  const fetchFavouriteStatus = async (uprn) => {
    if (!email || !uprn) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/favourites/getFavourites?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const favourites = await response.json();
        const isFavorite = favourites.some((fav) => fav.uprn === uprn);
        setIsFavorited(isFavorite);
      } else {
        console.error('Failed to fetch favorite status.');
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!email) {
      console.error('Email is required to toggle favorite status.');
      return;
    }

    const url = isFavorited
      ? `http://127.0.0.1:5000/api/favourites/removeFavourite?email=${encodeURIComponent(email)}&uprn=${uprn}`
      : `http://127.0.0.1:5000/api/favourites/addFavourite?email=${encodeURIComponent(email)}&uprn=${uprn}`;
    const method = isFavorited ? 'DELETE' : 'POST';

    try {
      const response = await fetch(url, { method });
      if (response.ok) {
        setIsFavorited(!isFavorited);
      } else {
        console.error('Failed to update favorite status.');
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
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
    const API_KEY = 'AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c'; // Replace with your API key
    const sanitizedAddress = `${fullAddress}, ${postcode}`.replace(/,+/g, ',').trim();

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(sanitizedAddress)}&key=${API_KEY}`)
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

  if (loading) {
    return <p>Loading property details...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
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
        <FavouriteStar
          propertyData={propertyData}
          email={email}
          isFavorited={isFavorited}
          onFavouriteChange={() => fetchFavouriteStatus(propertyData?.uprn)}
        />
      </div>

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

      {propertyData ? (
        <>
          <EPCFullTable properties={[propertyData]} loading={loading} language={language} />
          <EPCGraph
            currentEnergyEfficiency={propertyData.current_energy_efficiency}
            potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
            language={language}
          />
        </>
      ) : (
        <p>{errorMessage || 'Loading property details...'}</p>
      )}
    </div>
  );
};

export default PropertyPage;