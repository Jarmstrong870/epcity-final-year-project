import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import EPCGraph from './EPCGraph';
import EPCFullTable from './EPCFullTable/EPCFullTable';
import SimpleMapView from './SimpleMapView';
import MapView from './MapView'; 
import StreetView from './StreetView';
import FavouriteStar from '../../propertySearch/FavouriteStar';
import { fetchPropertyDetails, fetchLocationCoords } from './propertyUtils';
import './PropertyPage.css';
import axios from "axios";
import { FavouriteContext } from '../utils/favouriteContext';

const PropertyPage = ({ user, property, language }) => {
  const { uprn } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [streetViewURL, setStreetViewURL] = useState('');
  const [loading, setLoading] = useState(true);
  const {favouriteProperties} = useContext(FavouriteContext);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // NEW: Modal State
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey });

  
  useEffect(() => {
    if (uprn) {
      fetchPropertyDetails(uprn, setPropertyData, setErrorMessage, setLoading);
    }
  }, [uprn]);

  useEffect(() => {
    setPropertyData((previous) => ({...previous}));
  }, [favouriteProperties]);

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

  useEffect(() => {
    if (user) {
      axios.get("http://localhost:5000/get-groups", {
        headers: { "User-Email": user.email },
      })
      .then((response) => setGroups(response.data))
      .catch((error) => console.error("Error fetching groups:", error));
    }
  }, [user]);

  const toggleFavorite = () => {
    setIsFavourited(!isFavourited);
    setPopupMessage(
      !isFavourited
        ? `${propertyData?.address || 'This property'} has been favorited.`
        : `${propertyData?.address || 'This property'} has been unfavorited.`
    );
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  if (loading) {
    return <p>Loading property details...</p>;
  }
  console.log("Property Data:", Object.keys(propertyData));
  console.log("property floor level",propertyData["glazed_type"])

  const sendToGroupChat = async () => {
    if (!selectedGroup) {
      alert("Please select a group chat.");
      return;
    }

    try {
      const messageData = {
        group_id: selectedGroup,
        property_url: window.location.href,
      };

      await axios.post("http://localhost:5000/send-property-to-group", messageData, {
        headers: { "User-Email": user.email },
      });

      alert("🏡 Property sent to group chat!");
      setIsModalOpen(false); // Close Modal on Success
    } catch (error) {
      console.error("Error sending property:", error);
      alert("Failed to send the property to the group chat.");
    }
  };

  return (
    <div className="property-page">
      {showPopup && <div className="popup-message">{popupMessage}</div>}

      <div className="property-header">
        <h2 className="property-title">Property Details</h2>
        <div onClick={toggleFavorite} className="starComponent">
          <FavouriteStar user={user} property={property} />
        </div>
        <div onClick={() => setIsModalOpen(true)} className="send-to-group-chat-button">
          📩 Send to Group Chat
        </div>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select a Group</h3>
            <select 
              className="group-select-dropdown" 
              value={selectedGroup} 
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Select a Group</option>
              {groups.map((group) => (
                <option key={group.group_id} value={group.group_id}>
                  {group.name}
                </option>
              ))}
            </select>
            <button onClick={sendToGroupChat} className="modal-send-button">Send</button>
            <button onClick={() => setIsModalOpen(false)} className="modal-close-button">Cancel</button>
          </div>
        </div>
      )}

      {/* Section to display street view and map view */}
      <div className="image-and-map-section">
        <div className="street-view">
          <h3 className='title-street-view'>Street View</h3>
          <StreetView streetViewURL={streetViewURL} errorMessage={errorMessage} />
        </div>
        <div className="map-view">
          <h3 className='title-map-view'>Map View</h3>
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
