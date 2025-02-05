import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable/EPCFullTable';
import MapView from './MapView';
import StreetView from './StreetView';
import FavouriteStar from '../../propertySearch/FavouriteStar'; //  Use your existing FavouriteStar component.
import { fetchPropertyDetails, fetchLocationCoords } from './propertyUtils';
import './PropertyPage.css'; //  Ensure this CSS file is correctly imported for styling.

const PropertyPage = ({ user, property, email, language }) => {
  const { uprn } = useParams(); // Get Unique Property Reference Number (UPRN) from the URL.

  // State variables to manage property details, coordinates, errors, loading state, and favorite status.
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavourited, setIsFavourited] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  //  Load Google Maps API Key from .env file
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  //  Load Google Maps API
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey });

  //  Fetch property details when `uprn` changes
  useEffect(() => {
    if (uprn) {
      fetchPropertyDetails(uprn, setPropertyData, setErrorMessage, setLoading);
    }
  }, [uprn]);

  //  Fetch location coordinates when property data changes
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
  const toggleFavorite = () => {
    setIsFavourited(!isFavourited);
    setPopupMessage(
      !isFavourited
        ? `${propertyData?.address || 'This property'} has been favorited.`
        : `${propertyData?.address || 'This property'} has been unfavorited.`
    );
    setShowPopup(true);

    // Hide the popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  if (loading) {
    return <p>Loading property details...</p>;
  }

  return (
    <div className="property-page">
      {/* Popup Notification for Favoriting */}
      {showPopup && <div className="popup-message">{popupMessage}</div>}

      {/* Header section with property title and favorite star */}
      <div className="property-header">
        <h2 className="property-title">Property Details</h2>
        <div onClick={toggleFavorite} className="starComponent">
          <FavouriteStar user={user} property={property} />
        </div>
      </div>

      {/* Section to display street view and map view */}
      
      <div className="image-and-map-section">
        <div className="street-view">
          <h3>Street View</h3>
          <StreetView streetViewURL={streetViewURL} errorMessage={errorMessage} />
        </div>
        
      </div>
      

      {/* EPC Table Section */}
      {propertyData ? (
        <EPCFullTable properties={[propertyData]} loading={loading} language={language} />
      ) : (
        <p>{errorMessage || 'Loading property details...'}</p>
      )}

      {/* EPC Graph Section */}
      <div className="epc-graph-section">
        {propertyData && (
          <EPCGraph
            currentEnergyEfficiency={propertyData.current_energy_efficiency}
            potentialEnergyEfficiency={propertyData.potential_energy_efficiency}
            language={language}
          />
        )}
      </div>

      <div className="map-view">
          <h3>Map View</h3>
          <MapView locationCoords={locationCoords} isLoaded={isLoaded} errorMessage={errorMessage} />
        </div>
    </div>
  );
};

export default PropertyPage;
