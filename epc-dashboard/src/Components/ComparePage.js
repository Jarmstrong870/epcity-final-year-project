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
import "./ComparePage.css";

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProperties } = location.state || { selectedProperties: [] };

  const [propertyDetails, setPropertyDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streetViewURLs, setStreetViewURLs] = useState({});

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (selectedProperties.length < 2 || selectedProperties.length > 4) {
      setError("You must select between 2 and 4 properties for comparison.");
    } else {
      fetchPropertyDetails(selectedProperties);
    }
  }, [selectedProperties]);

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
      setError("Failed to load property data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get max/min values for highlighting
  const maxValues = findMaxValues(propertyDetails);

  // ✅ Headers Mapping (User-friendly names -> Correct field names)
  const headers = {
    "Address": "address",
    "Postcode": "postcode",
    "Current energy rating": "current_energy_rating",
    "Current energy efficiency": "current_energy_efficiency",
    "Potential energy rating": "potential_energy_rating",
    "Potential energy efficiency": "potential_energy_efficiency",
    "Property type": "property_type",
    "Built form": "built_form",
    "Lodgement date": "lodgement_date",
    "Energy consumption current": "energy_consumption_current",
    "Energy consumption potential": "energy_consumption_potential",
    "Lighting cost current": "lighting_cost_current",
    "Lighting cost potential": "lighting_cost_potential",
    "Heating cost current": "heating_cost_current",
    "Heating cost potential": "heating_cost_potential",
    "Hot water cost current": "hot_water_cost_current",
    "Hot water cost potential": "hot_water_cost_potential",
    "Total floor area": "total_floor_area",
    "Energy tariff": "energy_tariff",
    "Mains gas flag": "mains_gas_flag",
    "Floor level": "floor_level",
    "Flat top storey": "flat_top_storey",
    "Main heating controls": "main_heating_controls",
    "Multi glaze proportion": "multi_glaze_proportion",
    "Glazed type": "glazed_type",
    "Glazed area": "glazed_area",
    "Extension count": "extension_count",
    "Number of habitable rooms": "number_habitable_rooms",
    "Low energy lighting": "low_energy_lighting",
    "Hot water description": "hotwater_description",
    "Hot water energy eff": "hot_water_energy_eff",
    "Floor description": "floor_description",
    "Floor energy eff": "floor_energy_eff",
    "Windows description": "windows_description",
    "Windows energy eff": "windows_energy_eff",
    "Walls description": "walls_description",
    "Walls energy eff": "walls_energy_eff",
    "Roof description": "roof_description",
    "Roof energy eff": "roof_energy_eff",
    "Mainheat description": "mainheat_description",
    "Mainheat energy eff": "mainheat_energy_eff",
    "Mainheatcont description": "mainheatcont_description",
    "Mainheatc energy eff": "mainheatc_energy_eff",
    "Lighting description": "lighting_description",
    "Lighting energy eff": "lighting_energy_eff",
    "Main fuel": "main_fuel",
    "Heat loss corridor": "heat_loss_corridor",
    "Unheated corridor length": "unheated_corridor_length",
    "Floor height": "floor_height",
    "Tenure": "tenure",
  };

  return (
    <div className="compare-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Properties
      </button>
      <h2>Compare Properties</h2>

      {loading ? (
        <p>Loading property details...</p>
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
              {Object.keys(headers).map((displayName, idx) => (
                <React.Fragment key={idx}>
                  <tr className="feature-header">
                    {propertyDetails.map((_, index) => (
                      <td key={index}>{displayName}</td>
                    ))}
                  </tr>
                  <tr>
                    {propertyDetails.map((property, index) => {
                      const fieldKey = headers[displayName];
                      const fieldValue = property[fieldKey] || "N/A";

                      const isBest =
                      fieldValue !== "N/A" && fieldValue !== "" && fieldValue !== null && (
                        (displayName === "Hot water cost current" && parseNumericValue(fieldValue) === maxValues.minHotWaterCostCurrent) ||
                        (displayName === "Hot water cost potential" && parseNumericValue(fieldValue) === maxValues.minHotWaterCostPotential) ||
                        (displayName === "Current energy rating" && energyRatingToNumber(fieldValue) === maxValues.maxEnergyRating) ||
                        (displayName === "Current energy efficiency" && parseNumericValue(fieldValue) === maxValues.maxEnergyEfficiency) ||
                        (displayName === "Potential energy rating" && energyRatingToNumber(fieldValue) === maxValues.maxPotentialEnergyRating) ||
                        (displayName === "Potential energy efficiency" && parseNumericValue(fieldValue) === maxValues.maxPotentialEnergyEfficiency) ||
                        (displayName === "Energy consumption current" && parseNumericValue(fieldValue) === maxValues.minEnergyConsumptionCurrent) ||
                        (displayName === "Energy consumption potential" && parseNumericValue(fieldValue) === maxValues.minEnergyConsumptionPotential) ||
                        (displayName === "Lighting cost current" && parseNumericValue(fieldValue) === maxValues.minLightingCostCurrent) ||
                        (displayName === "Lighting cost potential" && parseNumericValue(fieldValue) === maxValues.minLightingCostPotential) ||
                        (displayName === "Heating cost current" && parseNumericValue(fieldValue) === maxValues.minHeatingCostCurrent) ||
                        (displayName === "Heating cost potential" && parseNumericValue(fieldValue) === maxValues.minHeatingCostPotential) ||
                        (displayName === "Hot water energy eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxHotWaterEfficiency) ||
                        (displayName === "Floor energy eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxFloorEfficiency) ||
                        (displayName === "Windows energy eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxWindowsEfficiency) ||
                        (displayName === "Walls energy eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxWallsEfficiency) ||
                        (displayName === "Mainheat energy eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxMainHeatEfficiency) ||
                        (displayName === "Mainheatc energy eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxMainHeatcEfficiency) ||
                        (displayName === "Lighting energy eff" && efficiencyRatingToNumber(fieldValue) === maxValues.maxLightingEfficiency)
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
