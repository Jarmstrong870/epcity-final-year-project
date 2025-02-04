import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import "./MapView.css";

// Define locations with categories & colors
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

const categories = {
  universities: "🎓 Universities",
  trainStations: "🚉 Train Stations",
  busStations: "🚌 Bus Stations",
  pointsOfInterest: "🏙️ Points of Interest",
  gyms: "🏋️ Gyms & Leisure",
  libraries: "📚 Libraries",
};

const MapView = ({ locationCoords, isLoaded, errorMessage }) => {
  const [houseIcon, setHouseIcon] = useState(null);
  const [showMarker, setShowMarker] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [selectedLocation, setSelectedLocation] = useState("Liverpool Lime Street Station");
  const [activeCategories, setActiveCategories] = useState({
    universities: true,
    trainStations: true,
    busStations: true,
    pointsOfInterest: true,
  });

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

  // ✅ Fetches the Route
  const fetchRoute = (newDestination = selectedLocation) => {
    if (!window.google || !window.google.maps) return;

    const destination = locations[newDestination];

    if (!destination || !activeCategories[locations[newDestination].category]) {
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

  // ✅ Updates Selected Location when a Category is Toggled
  const toggleCategory = (category) => {
    setActiveCategories((prev) => {
      const updatedCategories = { ...prev, [category]: !prev[category] };

      // If the selected location's category is turned off, switch to the next available category
      if (!updatedCategories[locations[selectedLocation]?.category]) {
        const newLocation = Object.keys(locations).find(
          (loc) => updatedCategories[locations[loc].category]
        );

        if (newLocation) {
          setSelectedLocation(newLocation); // Switch dropdown immediately
          fetchRoute(newLocation); // 🚀 Fetch the new route immediately
        } else {
          setDirections(null);
          setTravelTime(null);
        }
      } else {
        fetchRoute(selectedLocation); // Ensure route updates immediately if category is still active
      }

      return updatedCategories;
    });
  };

  if (!isLoaded) return <p className="map-loading">Loading map...</p>;
  if (errorMessage) return <p className="map-error">{errorMessage}</p>;

  return (
    <div>
      {/* ✅ Category Toggles (Now Updates Routes Immediately) */}
      {Object.keys(categories).map((category) => (
        <label key={category} className="toggle-switch">
          <input
            type="checkbox"
            checked={activeCategories[category]}
            onChange={() => toggleCategory(category)}
          />
          <span className="slider"></span> {categories[category]}
        </label>
      ))}

      {/* ✅ Route Toggle */}
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
        <span className="slider"></span> Show route to selected location
      </label>

      {/* ✅ Destination Selection */}
      <label>Select Destination:</label>
      <select
        onChange={(e) => {
          setSelectedLocation(e.target.value);
          fetchRoute(e.target.value); // 🚀 Ensures new route is shown immediately
        }}
        value={selectedLocation}
        disabled={!showRoute}
      >
        {Object.keys(categories).map((category) =>
          activeCategories[category] ? (
            <optgroup key={category} label={categories[category]}>
              {Object.keys(locations)
                .filter((loc) => locations[loc].category === category)
                .map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
            </optgroup>
          ) : null
        )}
      </select>

      {/* ✅ Travel Mode Selection */}
      <label>Travel Mode:</label>
      <select onChange={(e) => setTravelMode(e.target.value)} value={travelMode}>
        <option value="DRIVING">Driving 🚗</option>
        <option value="WALKING">Walking 🚶</option>
        <option value="BICYCLING">Bicycling 🚲</option>
        <option value="TRANSIT">Public Transit 🚌</option>
      </select>

      {/* ✅ Estimated Travel Time */}
      {travelTime && <p>Estimated {travelMode.toLowerCase()} time: {travelTime}</p>}

      <div className="map-container">
        <GoogleMap center={locationCoords} zoom={13} mapContainerClassName="map-container">
          {/* ✅ House Icon Appears Immediately */}
          {showMarker && houseIcon && (
            <Marker position={locationCoords} icon={houseIcon} onClick={() => setSelected(locationCoords)} />
          )}

          {/* ✅ InfoWindow for Property Location */}
          {selected && (
            <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
              <div>
                <h3>Property Location</h3>
                <p>Coordinates: {selected.lat}, {selected.lng}</p>
              </div>
            </InfoWindow>
          )}

          {/* ✅ Show Selected Destination Marker */}
          {showRoute && selectedLocation && activeCategories[locations[selectedLocation].category] && (
            <Marker position={locations[selectedLocation]} title={selectedLocation} />
          )}

          {/* ✅ Show Route with Color */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ polylineOptions: { strokeColor: locations[selectedLocation].color, strokeWeight: 5 } }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapView;
