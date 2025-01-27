import React, { useEffect, useState } from 'react';
// Import React hooks for managing state and handling side effects.
import { useParams } from 'react-router-dom';
// Import `useParams` to get the URL parameter (uprn) for identifying the property.
import { useJsApiLoader } from '@react-google-maps/api';
// Import `useJsApiLoader` to load the Google Maps API.
import EPCGraph from './EPCGraph';
// Import the EPCGraph component to show energy efficiency graph.
import EPCFullTable from './EPCFullTable';
// Import the EPCFullTable component to display detailed property data in a table.
import MapView from './MapView';
// Import the MapView component to display the Google Map of the property.
import StreetView from './StreetView';
// Import the StreetView component to show a street view of the property.
import { fetchPropertyDetails, fetchLocationCoords } from './propertyUtils';
// Import utility functions for fetching property details and location coordinates.
import './PropertyPage.css';
// Import CSS for styling the PropertyPage component.

// A functional component to display a star icon for favoriting/unfavoriting a property.
const FavoriteStar = ({ isFavorited, toggleFavorite }) => (
  <span
    style={{
      fontSize: '3rem',
      cursor: 'pointer',
      color: isFavorited ? 'gold' : 'gray', // Gold if favorited, gray otherwise.
      position: 'absolute',
      right: '20px',
      top: '20px',
    }}
    onClick={toggleFavorite} // Handle the click event to toggle favorite state.
    title={isFavorited ? 'Unfavorite' : 'Favorite'} // Tooltip text based on favorite state.
  >
    ★
  </span>
);

// Main PropertyPage component to display property details.
const PropertyPage = ({ language }) => {
  const { uprn } = useParams();
  // Get the Unique Property Reference Number (uprn) from the URL.

  // State variables to manage property data, coordinates, errors, loading state, and favorite status.
  const [propertyData, setPropertyData] = useState(null); // Store property details.
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 }); // Store map coordinates.
  const [errorMessage, setErrorMessage] = useState(''); // Store any error messages.
  const [streetViewURL, setStreetViewURL] = useState(''); // Store the URL for Street View.
  const [loading, setLoading] = useState(true); // Track if data is still loading.
  const [isFavorited, setIsFavorited] = useState(false); // Track if the property is favorited.

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  // Retrieve the Google Maps API key from environment variables.

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey, // Load the Google Maps API.
  });

  // Fetch property details whenever the `uprn` changes.
  useEffect(() => {
    if (uprn) {
      fetchPropertyDetails(uprn, setPropertyData, setErrorMessage, setLoading);
    }
  }, [uprn]);

  // Fetch location coordinates whenever the property data changes.
  useEffect(() => {
    if (propertyData?.address && propertyData?.postcode) {
      fetchLocationCoords(
        propertyData.address, // Full address of the property.
        propertyData.postcode, // Postcode of the property.
        googleMapsApiKey, // Google Maps API key.
        setLocationCoords, // Update the map coordinates.
        setStreetViewURL, // Update the Street View URL.
        setErrorMessage // Update error messages if any.
      );
    }
  }, [propertyData]);

  return (
    <div className="property-page">
      {/* Header section with property title and favorite star */}
      <div className="property-header">
        <h2 className="property-title">Property Details</h2>
        <FavoriteStar
          isFavorited={isFavorited} // Pass favorite state.
          toggleFavorite={() => setIsFavorited(!isFavorited)} // Toggle favorite state on click.
        />
      </div>

      {/* Section to display street view and map view */}
      <div className="image-and-map-section">
        {/* Street View Section */}
        <div className="street-view">
          <h3>Street View</h3>
          <StreetView
            streetViewURL={streetViewURL} // Pass the URL for the Street View image.
            errorMessage={errorMessage} // Pass any error messages.
          />
        </div>

        {/* Map View Section */}
        <div className="map-view">
          <h3>Map View</h3>
          <MapView
            locationCoords={locationCoords} // Pass the map coordinates.
            isLoaded={isLoaded} // Indicate if the Google Maps API has loaded.
            errorMessage={errorMessage} // Pass any error messages.
          />
        </div>
      </div>

      {/* EPC Table Section */}
      {propertyData ? (
        <EPCFullTable
          properties={[propertyData]} // Pass the property data to the table.
          loading={loading} // Indicate if the data is still loading.
          language={language} // Pass the selected language for localization.
        />
      ) : (
        <p>{errorMessage || 'Loading property details...'}</p> // Show error or loading message.
      )}

      {/* EPC Graph Section */}
      <div className="epc-graph-section">
        {propertyData && (
          <EPCGraph
            currentEnergyEfficiency={propertyData.current_energy_efficiency} // Current EPC rating.
            potentialEnergyEfficiency={propertyData.potential_energy_efficiency} // Potential EPC rating.
            language={language} // Pass the selected language for localization.
          />
        )}
      </div>
    </div>
  );
};

export default PropertyPage;
// Export the component for use in other parts of the application.
