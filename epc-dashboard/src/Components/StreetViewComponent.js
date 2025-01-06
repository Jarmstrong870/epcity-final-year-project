import React, { useState, useEffect } from "react";

const StreetViewComponent = ({ address, postcode }) => {
  const [streetViewURL, setStreetViewURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const API_KEY = "AIzaSyDzftcx-wqjX9JZ2Ye3WfWWY1qLEZLDh1c";

  useEffect(() => {
    if (address) {
      // Encode the address
      const encodedAddress = encodeURIComponent(address);

      // Construct the components parameter if postcode is provided
      let componentsParam = "";
      if (postcode) {
        const encodedPostcode = encodeURIComponent(postcode);
        componentsParam = `&components=postal_code:${encodedPostcode}|country:GB`;
      } else {
        // If no postcode, you can optionally specify the country to bias results
        componentsParam = `&components=country:GB`;
      }

      // Construct the API URL
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}${componentsParam}&key=${API_KEY}`;

      console.log("Geocoding API URL:", apiUrl);

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log("Geocoding API response:", data);

          if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${API_KEY}`;
            setStreetViewURL(streetViewURL);
          } else {
            setErrorMessage(
              "Address not found. Unable to load Street View."
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
          setErrorMessage("Failed to fetch Street View.");
        });
    } else {
      setErrorMessage("Address is required.");
    }
  }, [address, postcode, API_KEY]);
  }, [address, postcode, API_KEY]);

  return (
    <div>
      {streetViewURL ? (
        <img
          src={streetViewURL}
          alt="Street View"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
      ) : (
        <p>{errorMessage || "Loading street view..."}</p>
      )}
    </div>
  );
};

export default StreetViewComponent;
