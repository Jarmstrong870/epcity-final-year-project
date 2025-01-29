import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable';
import MapView from './MapView';
import StreetView from './StreetView';
import '../../propertySearch/FavouriteStar.css';
import FavouriteStar from '../../propertySearch/FavouriteStar';

/* 
    Property Page (Individual Property Page) is used to display all of the data associated with an individual property
    with the map and street view presented at the top followed by the EPC Full Table data  with particular 
    data fields presented within their own box. The EPC Graph is also shown with the current and potential rating
    of the property. 

    The Favourite Star component has been included so users can favourite a property once they have read more 
    infromation about the property's efficiency
*/


const PropertyPage = ({ user, property, email, language }) => {
  const { uprn } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavourited, setIsFavourited] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state


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
      {/* Header section with property title and favorite star */}
      <div className="property-header">
        <h2 className="property-title">Property Details</h2>
        <div className = "starComponent">
              <FavouriteStar user={user} property = {property} />
              </div> 
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