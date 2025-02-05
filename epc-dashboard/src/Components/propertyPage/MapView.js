import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import CategoryToggle from "./CategoryToggle";
import DropdownSelector from "./DropdownSelector";
import translations from "../../locales/translations_mapview"; // Import translations
import "./MapView.css";

const locations = {
  "University of Liverpool": { lat: 53.4065, lng: -2.9665, color: "purple", category: "universities" },
  "Liverpool John Moores University": { lat: 53.4084, lng: -2.9785, color: "purple", category: "universities" },
  "Liverpool Hope University": { lat: 53.3876, lng: -2.9158, color: "purple", category: "universities" },
  "Liverpool Institute for Performing Arts": { lat: 53.3995, lng: -2.9752, color: "purple", category: "universities" },
  "Liverpool Lime Street Station": { lat: 53.4075, lng: -2.9778, color: "green", category: "trainStations" },
  "Liverpool Central Station": { lat: 53.4054, lng: -2.9789, color: "green", category: "trainStations" },
  "Moorfields Station": { lat: 53.4102, lng: -2.9918, color: "green", category: "trainStations" },
  "Liverpool One Bus Station": { lat: 53.4032, lng: -2.9905, color: "red", category: "busStations" },
  "Queen Square Bus Station": { lat: 53.4071, lng: -2.9828, color: "red", category: "busStations" },
  "Liverpool City Centre": { lat: 53.4084, lng: -2.9916, color: "blue", category: "pointsOfInterest" },
  "JD Gym Liverpool": { lat: 53.4088, lng: -2.9782, color: "yellow", category: "gyms" },
  "PureGym Liverpool": { lat: 53.4092, lng: -2.9921, color: "yellow", category: "gyms" },
  "Liverpool Central Library": { lat: 53.4098, lng: -2.9812, color: "orange", category: "libraries" },
  "Toxteth Library": { lat: 53.3889, lng: -2.9613, color: "orange", category: "libraries" },
};

const MapView = ({ locationCoords, isLoaded, errorMessage, language }) => {
  const [houseIcon, setHouseIcon] = useState(null);
  const [showMarker, setShowMarker] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeCategories, setActiveCategories] = useState({
    universities: false,
    trainStations: false,
    busStations: false,
    pointsOfInterest: false,
    gyms: false,
    libraries: false,
  });

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

  const fetchRoute = (newDestination = selectedLocation) => {
    if (!window.google || !window.google.maps || !newDestination) return;

    const destination = locations[newDestination];

    if (!destination || !activeCategories[destination.category]) {
      setDirections(null);
      setTravelTime(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: locationCoords,
        destination,
        travelMode: window.google.maps.TravelMode[travelMode],
        drivingOptions: travelMode === "DRIVING"
          ? { departureTime: new Date(), trafficModel: "bestguess" }
          : undefined,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setTravelTime(result.routes[0].legs[0].duration.text);
        } else {
          console.error(`Error fetching ${travelMode} route:`, status);
        }
      }
    );
  };

  useEffect(() => {
    if (showRoute) fetchRoute();
  }, [travelMode, selectedLocation, activeCategories]);

  const toggleCategory = (category) => {
    setActiveCategories((prev) => {
      const updatedCategories = { ...prev, [category]: !prev[category] };

      if (selectedLocation && !updatedCategories[locations[selectedLocation]?.category]) {
        const newLocation = Object.keys(locations).find(
          (loc) => updatedCategories[locations[loc]?.category]
        );

        setSelectedLocation(newLocation || null);
        fetchRoute(newLocation || null);
      } else {
        fetchRoute(selectedLocation);
      }

      return updatedCategories;
    });
  };

  if (!isLoaded) return <p className="map-loading">Loading map...</p>;
  if (errorMessage) return <p className="map-error">{errorMessage}</p>;

  return (
    <div>
      <CategoryToggle categories={t.categories} activeCategories={activeCategories} toggleCategory={toggleCategory} />

      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={showRoute}
          onChange={() => {
            setShowRoute((prev) => !prev);
            if (!showRoute) fetchRoute();
            else {
              setDirections(null);
              setTravelTime(null);
            }
          }}
        />
        <span className="slider"></span> {t.showRoute}
      </label>

      <DropdownSelector
        categories={t.categories}
        locations={locations}
        activeCategories={activeCategories}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        fetchRoute={fetchRoute}
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        showRoute={showRoute}
        language={language}
      />

      {travelTime && <p>{t.estimatedTime.replace("{mode}", travelMode.toLowerCase()).replace("{time}", travelTime)}</p>}

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

          {directions && selectedLocation && locations[selectedLocation] && (
            <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, polylineOptions: { strokeColor: locations[selectedLocation]?.color || "blue", strokeWeight: 5 } }} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapView;
