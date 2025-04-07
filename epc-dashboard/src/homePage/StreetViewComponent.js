import React, { useState, useEffect } from "react";
import FlatImg from "../assets/Flat.jpg";
import HouseImg from "../assets/House.jpg";
import BungalowImg from "../assets/Bungalow.jpg";
import MaisonetteImg from "../assets/Maisonette.jpg";

const StreetViewComponent = ({ address, postcode, propertyType }) => {
  const [streetViewURL, setStreetViewURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_API_KEY;

  const placeholderImages = {
    House: HouseImg,
    Flat: FlatImg,
    Bungalow: BungalowImg,
    Maisonette: MaisonetteImg,
  };

  useEffect(() => {
    const fetchCoordsWithMapbox = async () => {
      try {
        const fullAddress = `${address}, ${postcode}`.replace(/,+/g, ',').trim();

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            fullAddress
          )}.json?access_token=${MAPBOX_KEY}&country=gb&limit=1`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;

          const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${GOOGLE_KEY}`;
          setStreetViewURL(streetViewUrl);
        } else {
          setErrorMessage("No location found from Mapbox.");
        }
      } catch (err) {
        setErrorMessage("Failed to load location.");
      }
    };

    if (address && postcode) {
      fetchCoordsWithMapbox();
    } else {
      setErrorMessage("Missing address or postcode.");
    }
  }, [address, postcode, GOOGLE_KEY, MAPBOX_KEY]);

  const placeholderImage = placeholderImages[propertyType];

  return (
    <div>
      {streetViewURL ? (
        <img src={streetViewURL} alt="Street View" />
      ) : placeholderImage ? (
        <img
          src={placeholderImage}
          alt={propertyType}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
      ) : (
        <p>{errorMessage}</p>
      )}
    </div>
  );
};

export default StreetViewComponent;
