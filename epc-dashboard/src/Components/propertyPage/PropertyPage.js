import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable/EPCFullTable';
import SimpleMapView from './SimpleMapView';
import MapView from './MapView'; // Added back MapView
import StreetView from './StreetView';
import FavouriteStar from '../../propertySearch/FavouriteStar';
import { fetchPropertyDetails, fetchLocationCoords } from './propertyUtils';
import './PropertyPage.css';

const PropertyPage = ({ user, property, email, language }) => {
  const { uprn } = useParams();

  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavourited, setIsFavourited] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey });

  useEffect(() => {
    if (uprn) {
      fetchPropertyDetails(uprn, setPropertyData, setErrorMessage, setLoading);
    }
  }, [uprn]);

  useEffect(() => {
    if (propertyData?.address && propertyData?.postcode) {
      fetchLocationCoords(
        propertyData.address,
        propertyData.postcode,
        googleMapsApiKey,
        setLocationCoords,
        setStreetViewURL,
        setErrorMessage
      );
    }
  }, [propertyData]);

  //  Handle favoriting of properties
  const toggleFavourite = () => {
    setIsFavourited(!isFavourited);
    setPopupMessage(
      isFavourited
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
    <div className="property-page">
      {showPopup && <div className="popup-message">{popupMessage}</div>}

      <div className="property-header">
        <h2 className="property-title">Property Details</h2>
        <div className = "starComponent">
        {/*<div onClick={handleToggleFavourite}>*/}
                <FavouriteStar user={user} property = {propertyData} onToggle={{toggleFavourite}}/> 
              </div> 
        </div>
    

      {/* Section to display street view and map view */}
      
      <div className="image-and-map-section">
        <div className="street-view">
          <h3>Street View</h3>
          <StreetView streetViewURL={streetViewURL} errorMessage={errorMessage} />
        </div>
        <div className="map-view">
          <h3>Map View</h3>
          <SimpleMapView locationCoords={locationCoords} isLoaded={isLoaded} errorMessage={errorMessage} />
        </div>
      </div>
      

      {propertyData ? (
        <EPCFullTable properties={[propertyData]} loading={loading} language={language} />
      ) : (
        <p>{errorMessage || 'Loading property details...'}</p>
      )}

      <div className="epc-graph-section">
        {propertyData && (
          <EPCGraph
            currentEnergyEfficiency={propertyData.current_energy_efficiency}
            potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
            language={language}
          />
        )}
      </div>

      {/* Added space before MapView */}
      <div className="map-view-section">
        <h3>Nearby Locations</h3>
        <MapView locationCoords={locationCoords} isLoaded={isLoaded} errorMessage={errorMessage} language={language} />
      </div>
    </div>
  );
};

export default PropertyPage;
