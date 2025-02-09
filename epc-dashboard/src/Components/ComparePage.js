import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StreetView from "./propertyPage/StreetView";
import { fetchLocationCoords } from "./propertyPage/propertyUtils";
import HighlightedValue from "./Compare_utils/HighlightedValue";
import { 
  energyRatingToNumber, 
  efficiencyRatingToNumber, 
  findMaxValues, 
  parseNumericValue 
} from "./Compare_utils/Compare_utils";
import translations from "../locales/translations_comparepage"; 
import "./ComparePage.css";

const ComparePage = ({ language }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProperties } = location.state || { selectedProperties: [] };

  const [propertyDetails, setPropertyDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streetViewURLs, setStreetViewURLs] = useState({});

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const t = translations[language] || translations.en; // Use selected language or default to English

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

  // ✅ Get max/min values for highlighting
  const maxValues = findMaxValues(propertyDetails);

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
        <div className="compare-table-container">
          <table className="compare-table">
            <tbody>
              {/* ✅ Display Street View + Address */}
              <tr>
                {propertyDetails.map((property, index) => (
                  <td key={index} className="street-view-container">
                    <StreetView streetViewURL={streetViewURLs[property.uprn]} errorMessage="" />
                    <div className="property-address">{property.address}</div>
                  </td>
                ))}
              </tr>

              {/* ✅ Display Comparison Headers & Values */}
              {Object.keys(t.headers).map((headerKey, idx) => (
                <React.Fragment key={idx}>
                  <tr className="feature-header">
                    {propertyDetails.map((_, index) => (
                      <td key={index}>{t.headers[headerKey]}</td>
                    ))}
                  </tr>
                  <tr>
                    {propertyDetails.map((property, index) => {
                      const fieldKey = headerKey;
                      const fieldValue = property[fieldKey] || "N/A";

                      const isBest =
                        fieldValue !== "N/A" && fieldValue !== "" && fieldValue !== null && (
                          (fieldKey === "hot_water_cost_current" && parseNumericValue(fieldValue) === maxValues.minHotWaterCostCurrent) ||
                          (fieldKey === "hot_water_cost_potential" && parseNumericValue(fieldValue) === maxValues.minHotWaterCostPotential) ||
                          (fieldKey === "current_energy_rating" && energyRatingToNumber(fieldValue) === maxValues.maxEnergyRating) ||
                          (fieldKey === "current_energy_efficiency" && parseNumericValue(fieldValue) === maxValues.maxEnergyEfficiency) ||
                          (fieldKey === "potential_energy_rating" && energyRatingToNumber(fieldValue) === maxValues.maxPotentialEnergyRating) ||
                          (fieldKey === "potential_energy_efficiency" && parseNumericValue(fieldValue) === maxValues.maxPotentialEnergyEfficiency) ||
                          (fieldKey === "energy_consumption_current" && parseNumericValue(fieldValue) === maxValues.minEnergyConsumptionCurrent) ||
                          (fieldKey === "energy_consumption_potential" && parseNumericValue(fieldValue) === maxValues.minEnergyConsumptionPotential) ||
                          (fieldKey === "lighting_cost_current" && parseNumericValue(fieldValue) === maxValues.minLightingCostCurrent) ||
                          (fieldKey === "lighting_cost_potential" && parseNumericValue(fieldValue) === maxValues.minLightingCostPotential) ||
                          (fieldKey === "heating_cost_current" && parseNumericValue(fieldValue) === maxValues.minHeatingCostCurrent) ||
                          (fieldKey === "heating_cost_potential" && parseNumericValue(fieldValue) === maxValues.minHeatingCostPotential) ||
                          (fieldKey === "hot_water_energy_eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxHotWaterEfficiency) ||
                          (fieldKey === "floor_energy_eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxFloorEfficiency) ||
                          (fieldKey === "windows_energy_eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxWindowsEfficiency) ||
                          (fieldKey === "walls_energy_eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxWallsEfficiency) ||
                          (fieldKey === "mainheat_energy_eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxMainHeatEfficiency) ||
                          (fieldKey === "mainheatc_energy_eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxMainHeatcEfficiency) ||
                          (fieldKey === "lighting_energy_eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxLightingEfficiency)
                        );

                      return <HighlightedValue key={index} value={fieldValue} isBest={isBest} />;
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
