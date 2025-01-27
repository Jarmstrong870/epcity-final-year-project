import React, { useState, useEffect } from "react";

const StreetViewComponent = ({ address, postcode }) => {
  const [streetViewURL, setStreetViewURL] = useState(null); // State for the Street View URL.
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages.
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Get the API key from .env.

  useEffect(() => {
    if (address) {
      // Encode the address for the API request.
      const encodedAddress = encodeURIComponent(address);

      // Construct the components parameter if a postcode is provided.
      let componentsParam = "";
      if (postcode) {
        const encodedPostcode = encodeURIComponent(postcode);
        componentsParam = `&components=postal_code:${encodedPostcode}|country:GB`;
      } else {
        // If no postcode, bias results to the UK by specifying the country.
        componentsParam = `&components=country:GB`;
      }

      // Construct the API URL for geocoding.
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}${componentsParam}&key=${API_KEY}`;

      console.log("Geocoding API URL:", apiUrl);

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log("Geocoding API response:", data);

          if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            // Construct the Street View URL using the latitude and longitude.
            const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`;
            setStreetViewURL(streetViewURL); // Update the state with the Street View URL.
          } else {
            setErrorMessage("Address not found. Unable to load Street View.");
          }
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
          setErrorMessage("Failed to fetch Street View.");
        });
    } else {
      setErrorMessage("Address is required.");
    }
  }, [address, postcode, API_KEY]); // Effect runs when address, postcode, or API key changes.

  return (
    <div>
      {streetViewURL ? (
        <img
          src={streetViewURL} // Display the Street View image.
          alt="Street View"
          style={{
            width: "100%", // Make the image take up the full width of its container.
            height: "100%", // Make the image take up the full height of its container.
            borderRadius: "10px", // Add rounded corners to the image.
            objectFit: "cover", // Ensure the image covers the container without distortion.
          }}
        />
      ) : (
        <p>{errorMessage || "Loading street view..."}</p> // Show an error or loading message.
      )}
    </div>
  );
};

export default StreetViewComponent;
// Export the component for use in other parts of the application.
