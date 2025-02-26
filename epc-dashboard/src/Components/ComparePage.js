import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StreetView from "./propertyPage/StreetView";
import EPCInfoDropdown from "./EPCInfoDropdown";
import ComparePropertiesGraph from "./Compare_utils/ComparePropertiesGraph";
import { fetchLocationCoords } from "./propertyPage/propertyUtils";
import { findMaxValues } from "./Compare_utils/Compare_utils";
import translations from "../locales/translations_comparepage";
import "./ComparePage.css";

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

    // Set page title and fetch property details on load
    useEffect(() => {
        document.title = t.compareProperties || "Compare Properties";

        if (selectedProperties.length < 2 || selectedProperties.length > 4) {
            setError(t.errorInvalidSelection);
        } else {
            fetchPropertyDetails(selectedProperties);
        }
    }, [selectedProperties, language]);

    // Fetch property details from the backend
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

            // Find max values for graph display
            const calculatedMaxValues = findMaxValues(data);
            setMaxValues(calculatedMaxValues);

            // Fetch street view images
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

    return (
        <div className="compare-container">
            {/* Back to Properties link */}
            <div className="compare-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← {t.backToProperties || "Back to Properties"}
                </button>
            </div>

            {/* Display loading, error, or property details */}
            {loading ? (
                <p>{t.loading}</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <div className="property-grid">
                        {propertyDetails.map((property) => (
                            <div key={property.uprn} className="property-column">
                                {/* Property Image */}
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

                                {/* Property Information */}
                                <div className="property-info">
                                    <p><strong>Address:</strong> {property.address}</p>
                                    <p><strong>Postcode:</strong> {property.postcode}</p>
                                    <p><strong>Property Type:</strong> {property.property_type}</p>
                                    <p><strong>Number of Bedrooms:</strong> {property.number_bedrooms}</p>

                                    {/* EPC Information Dropdown */}
                                    <EPCInfoDropdown property={property} allProperties={propertyDetails} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Graph Section */}
                    <div className="graph-section">
                        <ComparePropertiesGraph properties={propertyDetails} maxValues={maxValues} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ComparePage;
