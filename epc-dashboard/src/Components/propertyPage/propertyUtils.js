// utils.js

export const fetchPropertyDetails = async (uprn, setPropertyData, setErrorMessage, setLoading) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/property/getInfo?uprn=${encodeURIComponent(uprn)}`
    );

    const data = await response.json();
    console.log("Property Data:", data[0]);

    if (data && data.length > 0) {
      setPropertyData(data[0]);
      console.log("Available Property Data:", Object.keys(data[0]));
    } else {
      setErrorMessage('No property data available.');
    }
  } catch (error) {
    console.error('Error fetching property data:', error);
    setErrorMessage('Failed to fetch property details.');
  } finally {
    setLoading(false);
  }
};

export const fetchLocationCoords = async (
  fullAddress,
  postcode,
  googleMapsApiKey,
  mapboxApiKey,
  setLocationCoords,
  setStreetViewURL,
  setErrorMessage
) => {
  try {
    const cleanedAddress = fullAddress
      .replace(/^.*Building, /i, '')
      .replace(/[^a-zA-Z0-9\s,]/g, '')
      .trim();

    const sanitizedAddress = `${cleanedAddress}, ${postcode}`.replace(/,+/g, ',').trim();

    // --- MAPBOX GEOCODING (now used always to match card view) ---
    const mapboxRes = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        sanitizedAddress
      )}.json?access_token=${mapboxApiKey}&country=gb&limit=1`
    );
    const mapboxData = await mapboxRes.json();

    if (mapboxData.features && mapboxData.features.length > 0) {
      const [lng, lat] = mapboxData.features[0].center;
      console.log("Mapbox used for coords:", lat, lng);
      setLocationCoords({ lat, lng });

      const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${googleMapsApiKey}`;
      setStreetViewURL(streetViewURL);
    } else {
      setErrorMessage("Mapbox failed to find the location.");
      setStreetViewURL("");
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    setErrorMessage("Failed to fetch location data.");
    setStreetViewURL("");
  }
};

export const fetchGraphData = async (numberOfBedrooms, postcode, setGraphData, setErrorMessage) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/property/graph?num_bedrooms=${numberOfBedrooms}&postcode=${postcode}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      setGraphData(data);
    } else {
      setErrorMessage('No graph data available.');
    }
  } catch (error) {
    console.error('Failed to fetch graph data:', error);
    setErrorMessage('Failed to fetch graph data.');
  }
};
