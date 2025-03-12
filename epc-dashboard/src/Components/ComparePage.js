import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StreetView from "./propertyPage/StreetView";
import PropertyInfoDropdown from "./PropertyInfoDropdown";
import EstimatedCosts from "./subDropdowns/EstimatedCosts"; 
import { fetchLocationCoords } from "./propertyPage/propertyUtils";
import { findMaxValues } from "./Compare_utils/Compare_utils";
import translations from "../locales/translations_comparepage";
import "./ComparePage.css";
import ComparePropertiesGraph from "./Compare_utils/ComparePropertiesGraph";

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
    document.title = t.compareProperties || "Compare Properties";

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

      const calculatedMaxValues = findMaxValues(data);
      setMaxValues(calculatedMaxValues);

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
        <button className="back-to-properties" onClick={() => navigate(-1)}>
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
                      alt={`${t.propertyAt} ${property.address}`}
                    />
                  )}
                </div>

                <div className="property-info">
                  <p>
                    <strong>
                      <Link
                        to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.address)}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.address}: {property.address}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      <Link
                        to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.postcode)}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.postcode}: {property.postcode}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      <Link
                        to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.propertyType)}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.propertyType}: {property.property_type}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      <Link
                        to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.numberOfBedrooms)}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.numberOfBedrooms}: {property.number_bedrooms}
                    </strong>
                  </p>

                  {/* EPC Information Dropdown */}
                  <PropertyInfoDropdown property={property} allProperties={propertyDetails} language={language} />
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 New Estimated Costs Section */}
          <div className="estimated-costs-section">
            {propertyDetails.map((property) => (
              <div key={property.uprn} className="estimated-costs-card">
                <EstimatedCosts 
                  property={property} 
                  highlightIfBest={(value, max) => value === max ? "highlight-green" : ""}
                  maxValues={maxValues}
                  language={language}
                />
              </div>
            ))}
          </div>

          {/* Graph Section */}
          <div className="graph-section">
            <ComparePropertiesGraph properties={propertyDetails} maxValues={maxValues} language={language} />
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePage;
