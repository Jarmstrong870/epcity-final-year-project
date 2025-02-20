import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import CategoryToggle from "./CategoryToggle";
import DropdownSelector from "./DropdownSelector";
import translations from "../../locales/translations_mapview";
import "./MapView.css";

const locations = {
  "University of Liverpool": { lat: 53.40989014595241, lng: -2.9803081829132276, color: "purple", category: "universities" },
  "Liverpool John Moores University": { lat: 53.413038360370216, lng: -2.9791604435096404, color: "purple", category: "universities" },
  "Liverpool Hope University": { lat: 53.390845459434836, lng: -2.8922237007055838, color: "purple", category: "universities" },
  "Liverpool Institute for Performing Arts": { lat: 53.39997042752927, lng: -2.9721646313893535, color: "purple", category: "universities" },
  "Liverpool Lime Street Station": { lat: 53.40765736916895, lng: -2.978670344615339, color: "green", category: "trainStations" },
  "Liverpool Central Station": { lat: 53.404667510982236, lng: -2.980010111913629, color: "green", category: "trainStations" },
  "Moorfields Station": { lat: 53.40854949925297, lng: -2.989254277820486, color: "green", category: "trainStations" },
  "Liverpool One Bus Station": { lat: 53.40191417729117, lng: -2.9874611721455864, color: "red", category: "busStations" },
  "Queen Square Bus Station": { lat: 53.40756246742054, lng: -2.9826631763883324, color: "red", category: "busStations" },
  "Liverpool City Centre": { lat: 53.4084, lng: -2.9916, color: "blue", category: "pointsOfInterest" },
  "JD Gym Liverpool": { lat: 53.40733878560883, lng: -2.9900960483534855, color: "yellow", category: "gyms" },
  "PureGym Liverpool Central": { lat: 53.40509362757359, lng: -2.976785182958734, color: "yellow", category: "gyms" },
  "PureGym Liverpool Brunswick": { lat: 53.3854490881573, lng: -2.9780240743577995, color: "yellow", category: "gyms" },
  "PureGym Liverpool Edge Lane": { lat: 53.407884617855586, lng: -2.9249996607282585, color: "yellow", category: "gyms" },
  "Liverpool Central Library": { lat: 53.40989014595241, lng: -2.9803081829132276, color: "orange", category: "libraries" },
  "Sydney Jones Library, University of Liverpool": { lat: 53.40275986934178, lng: -2.9638410587206243, color: "orange", category: "libraries" },
  "Aldham Robarts Library, Liverpool John Moores University": { lat: 53.4030624485487, lng: -2.9718717170172497, color: "orange", category: "libraries" },
  "Sheppard-Worlock Library, Liverpool Hope University": { lat: 53.3922854133878, lng: -2.890909689060898, color: "orange", category: "libraries" },
};


const MapView = ({ locationCoords, isLoaded, errorMessage, language }) => {
  const [houseIcon, setHouseIcon] = useState(null);
  const [showMarker, setShowMarker] = useState(false);
  const [selected, setSelected] = useState(null);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeCategories, setActiveCategories] = useState({ universities: false });

  const t = translations[language] || translations.en;

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
    if (selectedLocation) {
      fetchRoute();
    } else {
      setDirections(null);
      setTravelTime(null);
    }
  }, [travelMode, selectedLocation, activeCategories]);

  const toggleCategory = (category) => {
    setActiveCategories((prev) => {
      const updatedCategories = { ...prev, [category]: !prev[category] };
      if (selectedLocation && !updatedCategories[locations[selectedLocation]?.category]) {
        setSelectedLocation(null);
        setDirections(null);
        setTravelTime(null);
      }
      return updatedCategories;
    });
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setDirections(null);
    setTravelTime(null);
    fetchRoute(location);
  };

  if (!isLoaded) return <p className="map-loading">Loading map...</p>;
  if (errorMessage) return <p className="map-error">{errorMessage}</p>;

  return (
    <div className="map-wrapper">
      {/* Left Sidebar: Nearby Locations */}
      <div className="map-sidebar">
        {/* Category Toggles */}
        <CategoryToggle categories={t.categories} activeCategories={activeCategories} toggleCategory={toggleCategory} />

        {/* Extra Container with Updated Instructions */}
        <div className="extra-container">
          <h4>Plan Your Journey</h4>
          <p>
            Enable nearby location toggles, select a destination, and choose your preferred travel mode
            to view the estimated route and travel time.
          </p>

          {/* Dropdown Selector Inside Extra Info Box */}
          <DropdownSelector
            categories={t.categories}
            locations={locations}
            activeCategories={activeCategories}
            selectedLocation={selectedLocation}
            setSelectedLocation={handleLocationChange}
            fetchRoute={fetchRoute}
            travelMode={travelMode}
            setTravelMode={setTravelMode}
            language={language}
          />

          {/* Display Travel Time */}
          {travelTime && (
            <p className="map-travel-time">
              Estimated {travelMode.toLowerCase()} time: <strong>{travelTime}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="map-container">
        <GoogleMap center={locationCoords} zoom={13} mapContainerClassName="map-container">
          {/* House Icon for Property Location */}
          {showMarker && houseIcon && (
            <Marker position={locationCoords} icon={houseIcon} onClick={() => setSelected(locationCoords)} />
          )}

          {/* InfoWindow for Property */}
          {selected && (
            <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
              <div>
                <h3>{t.propertyLocation}</h3>
                <p>{t.coordinates.replace("{lat}", selected.lat).replace("{lng}", selected.lng)}</p>
              </div>
            </InfoWindow>
          )}

          {/* Route Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: locations[selectedLocation]?.color || "blue",
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapView;
