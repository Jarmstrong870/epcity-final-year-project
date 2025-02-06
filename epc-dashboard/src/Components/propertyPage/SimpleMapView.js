import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import translations from "../../locales/translations_mapview"; // Import translations
import "./MapView.css";

const SimpleMapView = ({ locationCoords, isLoaded, errorMessage, language }) => {
  const [houseIcon, setHouseIcon] = useState(null);
  const [showMarker, setShowMarker] = useState(false);
  const [selected, setSelected] = useState(null);

  const t = translations[language] || translations.en; // Get translations for selected language

  useEffect(() => {
    if (window.google) {
      setHouseIcon({
        url: "https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png",
        scaledSize: new window.google.maps.Size(40, 40),
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (locationCoords?.lat && locationCoords?.lng) {
      setTimeout(() => setShowMarker(true), 500);
    }
  }, [locationCoords]);

  if (!isLoaded) return <p className="map-loading">Loading map...</p>;
  if (errorMessage) return <p className="map-error">{errorMessage}</p>;

  return (
    <div className="map-container">
      <GoogleMap center={locationCoords} zoom={13} mapContainerClassName="map-container">
        {showMarker && houseIcon && (
          <Marker position={locationCoords} icon={houseIcon} onClick={() => setSelected(locationCoords)} />
        )}

        {selected && (
          <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
            <div>
              <h3>{t.propertyLocation}</h3>
              <p>{t.coordinates.replace("{lat}", selected.lat).replace("{lng}", selected.lng)}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default SimpleMapView;
