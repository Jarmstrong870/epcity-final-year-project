import React, { useState, useEffect } from "react";
import FlatImg from "../assets/Flat.jpg"; // Import placeholder images
import HouseImg from "../assets/House.jpg";
import BungalowImg from "../assets/Bungalow.jpg";
import MaisonetteImg from "../assets/Maisonette.jpg";

const StreetViewComponent = ({ address, postcode, propertyType }) => {
  const [streetViewURL, setStreetViewURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Map property types to corresponding placeholder images
  const placeholderImages = {
    House: HouseImg,
    Flat: FlatImg,
    Bungalow: BungalowImg,
    Maisonette: MaisonetteImg,
  };

  useEffect(() => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      let componentsParam = postcode
        ? `&components=postal_code:${encodeURIComponent(postcode)}|country:GB`
        : "&components=country:GB";

      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}${componentsParam}&key=${API_KEY}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`;
            setStreetViewURL(streetViewURL);
          } else {
            setErrorMessage("Address not found. Unable to load Street View.");
          }
        })
        .catch(() => {
          setErrorMessage("Address not found. Unable to load Street View.");
        });
    } else {
      setErrorMessage("Address not found. Unable to load Street View.");
    }
  }, [address, postcode, API_KEY]);

  // Select the correct placeholder image based on property type
  const placeholderImage = placeholderImages[propertyType];

  return (
    <div>
      {streetViewURL ? (
        <img
          src={streetViewURL}
          alt="Street View"
          
        />
      ) : placeholderImage ? (
        <img
          src={placeholderImage} // Show placeholder if Street View fails and type exists
          alt={propertyType}
          style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" }}
        />
      ) : (
        <p>{errorMessage}</p> // Show error message if no matching type
      )}
    </div>
  );
};

export default StreetViewComponent;
