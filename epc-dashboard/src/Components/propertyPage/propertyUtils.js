// Function to fetch property details based on the Unique Property Reference Number (UPRN).
export const fetchPropertyDetails = async (uprn, setPropertyData, setErrorMessage, setLoading) => {
    try {
      // Make a request to the backend API to fetch property information.
      const response = await fetch(
        `http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`
      );
  
      // Parse the JSON response from the API.
      const data = await response.json();
  
      // Check if the response contains property data.
      if (data && data.length > 0) {
        setPropertyData(data[0]); // Update the state with the first property object.
      } else {
        setErrorMessage('No property data available.'); // Set an error message if no data is found.
      }
    } catch (error) {
      // Log the error to the console and update the error message state.
      console.error('Error fetching property data:', error);
      setErrorMessage('Failed to fetch property details.');
    } finally {
      // Ensure the loading state is turned off regardless of success or failure.
      setLoading(false);
    }
  };
  
  // Function to fetch geolocation coordinates and street view data based on an address.
  export const fetchLocationCoords = async (
    fullAddress, // The full address of the property.
    postcode, // The postcode of the property.
    googleMapsApiKey, // API key for accessing Google Maps services.
    setLocationCoords, // Function to update the location coordinates state.
    setStreetViewURL, // Function to update the Street View URL state.
    setErrorMessage // Function to update the error message state.
  ) => {
    try {
      // Clean up the address string to remove unnecessary commas or spaces.
      const sanitizedAddress = `${fullAddress}, ${postcode}`.replace(/,+/g, ',').trim();
  
      // Make a request to the Google Maps Geocoding API to get location data.
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          sanitizedAddress
        )}&key=${googleMapsApiKey}`
      );
  
      // Parse the JSON response from the API.
      const data = await response.json();
  
      // Check if the response contains valid results.
      if (data.results && data.results.length > 0) {
        // Extract the latitude and longitude from the API response.
        const { lat, lng } = data.results[0].geometry.location;
  
        // Update the location coordinates state with the retrieved values.
        setLocationCoords({ lat, lng });
  
        // Generate a Street View URL based on the retrieved coordinates.
        setStreetViewURL(
          `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${googleMapsApiKey}`
        );
      } else {
        // Set an error message if no results are found for the given address.
        setErrorMessage('Postcode not found. Unable to display map or street view.');
      }
    } catch (error) {
      // Log the error to the console and update the error message state.
      console.error('Failed to fetch location data:', error);
      setErrorMessage('Failed to fetch location data.');
    }
  };
  