import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import CategoryToggle from "./CategoryToggle";
import DropdownSelector from "./DropdownSelector";
import translations from "../../locales/translations_mapview";
import "./MapView.css";


const locations = {
  // Liverpool
  "University of Liverpool": { lat: 53.409890, lng: -2.980308, color: "purple", category: "universities", city: "Liverpool" },
  "Liverpool John Moores University": { lat: 53.413038, lng: -2.979160, color: "purple", category: "universities", city: "Liverpool" },
  "Liverpool Lime Street Station": { lat: 53.407657, lng: -2.978670, color: "green", category: "trainStations", city: "Liverpool" },
  "Liverpool One Bus Station": { lat: 53.401914, lng: -2.987461, color: "red", category: "busStations", city: "Liverpool" },
  "JD Gym Liverpool": { lat: 53.407338, lng: -2.990096, color: "yellow", category: "gyms", city: "Liverpool" },
  "Liverpool Central Library": { lat: 53.409890, lng: -2.980308, color: "orange", category: "libraries", city: "Liverpool" },

  // Leeds
  "University of Leeds": { lat: 53.8067, lng: -1.5536, color: "purple", category: "universities", city: "Leeds" },
  "Leeds Beckett University": { lat: 53.8008, lng: -1.5491, color: "purple", category: "universities", city: "Leeds" },
  "Leeds Train Station": { lat: 53.7950, lng: -1.5476, color: "green", category: "trainStations", city: "Leeds" },
  "Leeds Bus Station": { lat: 53.7966, lng: -1.5370, color: "red", category: "busStations", city: "Leeds" },
  "JD Gym Leeds": { lat: 53.8011, lng: -1.5474, color: "yellow", category: "gyms", city: "Leeds" },
  "Leeds Central Library": { lat: 53.8002, lng: -1.5486, color: "orange", category: "libraries", city: "Leeds" },

  // Manchester
  "University of Manchester": { lat: 53.4668, lng: -2.2339, color: "purple", category: "universities", city: "Manchester" },
  "Manchester Metropolitan University": { lat: 53.4722, lng: -2.2399, color: "purple", category: "universities", city: "Manchester" },
  "Manchester Piccadilly Station": { lat: 53.4775, lng: -2.2304, color: "green", category: "trainStations", city: "Manchester" },
  "Manchester Bus Station": { lat: 53.4800, lng: -2.2364, color: "red", category: "busStations", city: "Manchester" },
  "PureGym Manchester": { lat: 53.4810, lng: -2.2353, color: "yellow", category: "gyms", city: "Manchester" },
  "Manchester Central Library": { lat: 53.4783, lng: -2.2463, color: "orange", category: "libraries", city: "Manchester" },

  // Bristol
  "University of Bristol": { lat: 51.4545, lng: -2.5879, color: "purple", category: "universities", city: "Bristol" },
  "University of the West of England": { lat: 51.5002, lng: -2.5484, color: "purple", category: "universities", city: "Bristol" },
  "Bristol Temple Meads Station": { lat: 51.4490, lng: -2.5815, color: "green", category: "trainStations", city: "Bristol" },
  "Bristol Bus Station": { lat: 51.4615, lng: -2.5925, color: "red", category: "busStations", city: "Bristol" },
  "PureGym Bristol": { lat: 51.4573, lng: -2.5890, color: "yellow", category: "gyms", city: "Bristol" },
  "Bristol Central Library": { lat: 51.4527, lng: -2.5992, color: "orange", category: "libraries", city: "Bristol" },

  // Sheffield
  "University of Sheffield": { lat: 53.3807, lng: -1.4886, color: "purple", category: "universities", city: "Sheffield" },
  "Sheffield Hallam University": { lat: 53.3780, lng: -1.4666, color: "purple", category: "universities", city: "Sheffield" },
  "Sheffield Train Station": { lat: 53.3781, lng: -1.4622, color: "green", category: "trainStations", city: "Sheffield" },
  "Sheffield Interchange Bus Station": { lat: 53.3785, lng: -1.4635, color: "red", category: "busStations", city: "Sheffield" },
  "PureGym Sheffield": { lat: 53.3801, lng: -1.4681, color: "yellow", category: "gyms", city: "Sheffield" },
  "Sheffield Central Library": { lat: 53.3793, lng: -1.4665, color: "orange", category: "libraries", city: "Sheffield" },

  // Birmingham
  "University of Birmingham": { lat: 52.4508, lng: -1.9305, color: "purple", category: "universities", city: "Birmingham" },
  "Aston University": { lat: 52.4862, lng: -1.8904, color: "purple", category: "universities", city: "Birmingham" },
  "Birmingham New Street Station": { lat: 52.4778, lng: -1.8981, color: "green", category: "trainStations", city: "Birmingham" },
  "Birmingham Coach Station": { lat: 52.4747, lng: -1.8888, color: "red", category: "busStations", city: "Birmingham" },
  "JD Gym Birmingham": { lat: 52.4833, lng: -1.8932, color: "yellow", category: "gyms", city: "Birmingham" },
  "Birmingham Central Library": { lat: 52.4791, lng: -1.9083, color: "orange", category: "libraries", city: "Birmingham" },

  // Brighton
  "University of Brighton": { lat: 50.8356, lng: -0.1208, color: "purple", category: "universities", city: "Brighton" },
  "Brighton Train Station": { lat: 50.8288, lng: -0.1416, color: "green", category: "trainStations", city: "Brighton" },
  "Brighton Bus Station": { lat: 50.8269, lng: -0.1412, color: "red", category: "busStations", city: "Brighton" },
  "PureGym Brighton": { lat: 50.8302, lng: -0.1376, color: "yellow", category: "gyms", city: "Brighton" },
  "Brighton Central Library": { lat: 50.8278, lng: -0.1374, color: "orange", category: "libraries", city: "Brighton" },

  // Newcastle
  "Newcastle University": { lat: 54.9783, lng: -1.6174, color: "purple", category: "universities", city: "Newcastle" },
  "Northumbria University": { lat: 54.9784, lng: -1.6075, color: "purple", category: "universities", city: "Newcastle" },
  "Newcastle Central Station": { lat: 54.9688, lng: -1.6174, color: "green", category: "trainStations", city: "Newcastle" },
  "Newcastle Bus Station": { lat: 54.9677, lng: -1.6149, color: "red", category: "busStations", city: "Newcastle" },
  "PureGym Newcastle": { lat: 54.9720, lng: -1.6092, color: "yellow", category: "gyms", city: "Newcastle" },
  "Newcastle Central Library": { lat: 54.9737, lng: -1.6174, color: "orange", category: "libraries", city: "Newcastle" },

  // Southampton
  "University of Southampton": { lat: 50.9351, lng: -1.3967, color: "purple", category: "universities", city: "Southampton" },
  "Southampton Solent University": { lat: 50.9061, lng: -1.3971, color: "purple", category: "universities", city: "Southampton" },
  "Southampton Central Station": { lat: 50.9075, lng: -1.4138, color: "green", category: "trainStations", city: "Southampton" },
  "Southampton Coach Station": { lat: 50.9079, lng: -1.4121, color: "red", category: "busStations", city: "Southampton" },
  "PureGym Southampton": { lat: 50.9120, lng: -1.4066, color: "yellow", category: "gyms", city: "Southampton" },
  "Southampton Central Library": { lat: 50.9085, lng: -1.4048, color: "orange", category: "libraries", city: "Southampton" },
};


const cityCoordinates = {
  Liverpool: { lat: 53.4084, lng: -2.9916 },
  Leeds: { lat: 53.8008, lng: -1.5491 },
  Manchester: { lat: 53.4808, lng: -2.2426 },
  Bristol: { lat: 51.4545, lng: -2.5879 },
  Sheffield: { lat: 53.3811, lng: -1.4701 },
  Birmingham: { lat: 52.4862, lng: -1.8904 },
  Brighton: { lat: 50.8225, lng: -0.1372 },
  Newcastle: { lat: 54.9784, lng: -1.6174 },
  Southampton: { lat: 50.9097, lng: -1.4044 },
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
  const [nearestCity, setNearestCity] = useState("");

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
      findNearestCity(locationCoords);
    }
  }, [locationCoords]);

  const findNearestCity = (propertyCoords) => {
    const distances = Object.entries(cityCoordinates).map(([city, coords]) => ({
      city,
      distance: getDistance(propertyCoords, coords),
    }));

    const nearest = distances.reduce((prev, curr) => (curr.distance < prev.distance ? curr : prev));
    setNearestCity(nearest.city);
  };

  const getDistance = (coord1, coord2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

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

  if (!isLoaded) return <p className="map-loading">{t.loadingMap}</p>;
  if (errorMessage) return <p className="map-error">{errorMessage}</p>;

  const filteredLocations = Object.entries(locations).filter(([_, loc]) => loc.city === nearestCity);

  return (
    <div className="map-wrapper">
      {/* Left Sidebar: Nearby Locations */}
      <div className="map-sidebar">
        {/* Category Toggles */}
        <CategoryToggle categories={t.categories} activeCategories={activeCategories} toggleCategory={toggleCategory} />

        {/* Extra Container with Updated Instructions */}
        <div className="extra-container">
          <h4>{t.planYourJourney}</h4>
          <p>
            {t.exploreDistance} <strong>{nearestCity}</strong>. {t.exploreDetails}
          </p>

          {/* Dropdown Selector Inside Extra Info Box */}
          <DropdownSelector
            categories={t.categories}
            locations={Object.fromEntries(filteredLocations)}
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
              {t.estimatedTime} <strong>{travelTime}</strong>
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