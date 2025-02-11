// utils.js
export const fetchPropertyDetails = async (uprn, setPropertyData, setErrorMessage, setLoading) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`
    );

    const data = await response.json();
    console.log("Property Data:", data[0]);

    if (data && data.length > 0) {
      console.log("Property Data:", data[0]);
      setPropertyData(data[0]);
      console.log("Available Property Data:", Object.keys(data[0]));
    } else {
      console.log("Property Data:", data[0]);
      setErrorMessage('No property data available.');
    }
  } catch (error) {
    
    console.error('Error fetching property data:', error);
    setErrorMessage('Failed to fetch property details.');
  } finally {
    setLoading(false);
  }
};

// Function to fetch geolocation coordinates and street view data based on an address.
export const fetchLocationCoords = async (
  fullAddress,
  postcode,
  googleMapsApiKey,
  setLocationCoords,
  setStreetViewURL,
  setErrorMessage
) => {
  try {
    // Use full address with postcode for more precise results
    const sanitizedAddress = `${fullAddress}, ${postcode}`.replace(/,+/g, ',').trim();
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(sanitizedAddress)}&key=${googleMapsApiKey}`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;

      console.log("Exact Property Location:", lat, lng);

      setLocationCoords({ lat, lng });

      setStreetViewURL(
        `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${googleMapsApiKey}`
      );
    } else {
      setErrorMessage('Exact location not found.');
    }
  } catch (error) {
    console.error('Failed to fetch location data:', error);
    setErrorMessage('Failed to fetch location data.');
  }
};

export const fetchGraphData = async (numberOfBedrooms, postcode, setGraphData, setErrorMessage) => {
  try{
    const response = await fetch(`http://127.0.0.1:5000/api/property/graph?num_bedrooms=${numberOfBedrooms}&postcode=${postcode}`);
  
    const data = await response.json();
    console.log("Graph Data:", data);

    if(data && data.length > 0){
      setGraphData(data);
    } else {
      setErrorMessage('No graph data available.');
    }

  } catch (error) {
    console.error('Failed to fetch graph data:', error);
    setErrorMessage('Failed to fetch graph data.');
  }
};
