import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StreetView from "./propertyPage/StreetView";
import EPCInfoDropdown from "./EPCInfoDropdown";
import { fetchLocationCoords } from "./propertyPage/propertyUtils";
import { findMaxValues, energyRatingToNumber } from "./Compare_utils/Compare_utils";  
import translations from "../locales/translations_comparepage";
import "./ComparePage.css";
import ComparePropertiesGraph from "./Compare_utils/ComparePropertiesGraph"

const ComparePage = ({ language }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedProperties } = location.state || { selectedProperties: [] };

    const [propertyDetails, setPropertyDetails] = useState([]);
    const [maxValues, setMaxValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [streetViewURLs, setStreetViewURLs] = useState({});

    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const t = translations[language] || translations.en;

    useEffect(() => {
        if (selectedProperties.length < 2 || selectedProperties.length > 4) {
            setError(t.errorInvalidSelection);
        } else {
            fetchPropertyDetails(selectedProperties);
        }
    }, [selectedProperties, language]);

    const fetchPropertyDetails = async (uprns) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:5000/api/property/compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uprns }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setPropertyDetails(data);

            // Calculate max values from fetched property details
            const calculatedMaxValues = findMaxValues(data);
            setMaxValues(calculatedMaxValues);

            // Fetch street view URLs for each property
            data.forEach((property) => {
                fetchLocationCoords(
                    property.address,
                    property.postcode,
                    GOOGLE_MAPS_API_KEY,
                    () => {},
                    (streetViewURL) => {
                        setStreetViewURLs((prev) => ({
                            ...prev,
                            [property.uprn]: streetViewURL,
                        }));
                    },
                    () => {}
                );
            });
        } catch (error) {
            console.error("Error fetching property details:", error);
            setError(t.errorFetching);
        } finally {
            setLoading(false);
        }
    };

    // Function to check if a property has the best EPC rating
    const isBestEPC = (rating, maxRating) => energyRatingToNumber(rating) === maxRating;

    return (
        <div className="compare-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                {t.backToProperties}
            </button>
            <h2>{t.compareProperties}</h2>

            {loading ? (
                <p>{t.loading}</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="property-grid">
                    {propertyDetails.map((property) => (
                        <div key={property.uprn} className="property-column">
                            <div className="property-image">
                                {streetViewURLs[property.uprn] ? (
                                    <StreetView streetViewURL={streetViewURLs[property.uprn]} errorMessage="" />
                                ) : (
                                    <img
                                        src={property.image_url || "/default-image.jpg"}
                                        alt={`Property at ${property.address}`}
                                    />
                                )}
                            </div>

                            <div className="property-info">
                                <p><strong>Address:</strong> {property.address}</p>
                                <p><strong>Postcode:</strong> {property.postcode}</p>
                                <p><strong>Property Type:</strong> {property.property_type}</p>
                                <p><strong>Number of Bedrooms:</strong> {property.number_bedrooms}</p>

                                

                                {/* Pass remaining details to dropdown */}
                                <EPCInfoDropdown property={property} allProperties={propertyDetails} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div>
                <ComparePropertiesGraph properties={selectedProperties}></ComparePropertiesGraph>
            </div>
        </div>
    );
};

export default ComparePage;



