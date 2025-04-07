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
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${MAPBOX_KEY}&country=gb&limit=1`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${GOOGLE_KEY}`;
          setStreetViewURL(streetViewURL);
        } else {
          setErrorMessage("Fallback Mapbox failed to find the address.");
        }
      } catch (err) {
        setErrorMessage("Both Google and Mapbox failed to geocode.");
      }
    };

    const fetchStreetView = async () => {
      if (!address) {
        setErrorMessage("Address is missing.");
        return;
      }

      const encodedAddress = encodeURIComponent(address);
      const componentsParam = postcode
        ? `&components=postal_code:${encodeURIComponent(postcode)}|country:GB`
        : "&components=country:GB";

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}${componentsParam}&key=${GOOGLE_KEY}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${GOOGLE_KEY}`;
          setStreetViewURL(streetViewURL);
        } else {
          await fetchCoordsWithMapbox();
        }
      } catch {
        await fetchCoordsWithMapbox();
      }
    };

    fetchStreetView();
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
