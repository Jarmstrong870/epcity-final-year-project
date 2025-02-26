import React, { useState, useEffect } from "react";
import CostComparisonGraph from "./propertyPage/EPCFullTable/CostComparisonGraph";
import { findMaxValues, energyRatingToNumber, parseNumericValue, efficiencyRatingToNumber } from "./Compare_utils/Compare_utils";
import "./EPCInfoDropdown.css";

// Function to render star ratings based on efficiency
const renderStarRating = (efficiency) => {
    if (!efficiency) return "N/A";
    const rating = efficiency.toLowerCase();
    switch (rating) {
        case "very good": return "⭐⭐⭐⭐⭐";
        case "good": return "⭐⭐⭐⭐";
        case "average": return "⭐⭐⭐";
        case "poor": return "⭐⭐";
        case "very poor": return "⭐";
        default: return "N/A";
    }
};

const PropertyInfoDropdown = ({ property, allProperties }) => {
    const [openDropdowns, setOpenDropdowns] = useState({
        epc: false,
        energy: false,
        costGraph: false,
        structure: false
    });

    const [activeTabs, setActiveTabs] = useState({
        epc: "rating",
        energy: "heating",
        structure: "windows"
    });

    const [maxValues, setMaxValues] = useState({});

    useEffect(() => {
        if (allProperties?.length) {
            const calculatedMaxValues = findMaxValues(allProperties);
            setMaxValues(calculatedMaxValues);
        }
    }, [allProperties]);

    const toggleDropdown = (dropdown) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    const setActiveTab = (section, tab) => {
        setActiveTabs((prev) => ({
            ...prev,
            [section]: tab
        }));
    };

    const highlightIfBest = (value, maxValue) => {
        if (!value || maxValue === undefined) return "";
        return parseNumericValue(value) === maxValue ? "highlight-green" : "";
    };

    return (
        <div>
            {/* EPC Information Dropdown */}
            <div className="accordion">
                <div className="accordion-header" onClick={() => toggleDropdown("epc")}>
                    {openDropdowns.epc ? "▼ Hide EPC Information" : "▶ Show EPC Information"}
                </div>

                {openDropdowns.epc && (
                    <div className="accordion-content">
                        <div className="tabs">
                            <button
                                className={activeTabs.epc === "rating" ? "active" : ""}
                                onClick={() => setActiveTab("epc", "rating")}
                            >
                                EPC Rating
                            </button>
                            <button
                                className={activeTabs.epc === "costs" ? "active" : ""}
                                onClick={() => setActiveTab("epc", "costs")}
                            >
                                Costs
                            </button>
                            <button
                                className={activeTabs.epc === "info" ? "active" : ""}
                                onClick={() => setActiveTab("epc", "info")}
                            >
                                Property Info
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTabs.epc === "rating" && (
                                <div>
                                    <h4>EPC Rating</h4>
                                    <p className={highlightIfBest(energyRatingToNumber(property.current_energy_rating), maxValues?.maxEnergyRating)}>
                                        <strong>Current EPC Grade:</strong> {property.current_energy_rating || "N/A"}
                                    </p>
                                    <p className={highlightIfBest(energyRatingToNumber(property.potential_energy_rating), maxValues?.maxPotentialEnergyRating)}>
                                        <strong>Potential EPC Grade:</strong> {property.potential_energy_rating || "N/A"}
                                    </p>
                                    <p className={highlightIfBest(parseNumericValue(property.energy_consumption_current), maxValues?.minEnergyConsumptionCurrent)}>
                                        <strong>Energy Consumption:</strong> {property.energy_consumption_current || "N/A"} KWh/m²
                                    </p>
                                    <p>
                                        <strong>Total Energy Usage:</strong> {property.energy_consumption_current * (property.total_floor_area || 1)} KWh
                                    </p>
                                </div>
                            )}

                            {activeTabs.epc === "costs" && (
                                <div>
                                    <h4>Estimated Costs</h4>
                                    <p className={highlightIfBest(parseNumericValue(property.heating_cost_current), maxValues?.minHeatingCostCurrent)}>
                                        <strong>If you left the heating on accidentally over the weekend it would cost roughly:</strong> {property.heating_example_formatted || "N/A"}
                                    </p>
                                    <p className={highlightIfBest(parseNumericValue(property.hot_water_cost_current), maxValues?.minHotWaterCostCurrent)}>
                                        <strong>Taking a half-hour long hot shower would cost roughly:</strong> {property.hot_water_example_formatted || "N/A"}
                                    </p>
                                    <p className={highlightIfBest(parseNumericValue(property.lighting_cost_current), maxValues?.minLightingCostCurrent)}>
                                        <strong>Leaving the lighting on overnight would cost roughly:</strong> {property.lighting_example_formatted || "N/A"}
                                    </p>
                                </div>
                            )}

                            {activeTabs.epc === "info" && (
                                <div>
                                    <h4>Property Information</h4>
                                    <p><strong>Built Form:</strong> {property.built_form || "N/A"}</p>
                                    <p><strong>Extension Count:</strong> {property.extension_count || 0}</p>
                                    <p><strong>Lodgement Date:</strong> {property.lodgement_date || "N/A"}</p>
                                    <p><strong>Tenure:</strong> {property.tenure || "N/A"}</p>
                                    <p><strong>Gas Flag:</strong> {property.mains_gas_flag ? "Yes" : "No"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Energy Information Dropdown */}
            <div className="accordion">
                <div className="accordion-header" onClick={() => toggleDropdown("energy")}>
                    {openDropdowns.energy ? "▼ Hide Energy Information" : "▶ Show Energy Information"}
                </div>
                {openDropdowns.energy && (
                    <div className="accordion-content">
                        <div className="tabs">
                            <button
                                className={activeTabs.energy === "heating" ? "active" : ""}
                                onClick={() => setActiveTab("energy", "heating")}
                            >
                                Heating
                            </button>
                            <button
                                className={activeTabs.energy === "lighting" ? "active" : ""}
                                onClick={() => setActiveTab("energy", "lighting")}
                            >
                                Lighting
                            </button>
                            <button
                                className={activeTabs.energy === "hotWater" ? "active" : ""}
                                onClick={() => setActiveTab("energy", "hotWater")}
                            >
                                Hot Water
                            </button>
                        </div>

                        <div className="tab-content">
                        {activeTabs.energy === "heating" && (
    <div>
        <h4>🏡 Heating</h4>

        {/* Current Annual Cost */}
        <p className={highlightIfBest(parseNumericValue(property.heating_cost_current), maxValues?.minHeatingCostCurrent)}>
            <strong>Current Annual Cost:</strong> £{property.heating_cost_current || "N/A"}
        </p>

        {/* Potential Annual Cost with Savings */}
        <p className={highlightIfBest(
            parseNumericValue(property.heating_cost_current - property.heating_cost_potential),
            maxValues?.maxHeatingCostSavings
        )}>
            <strong>Potential Annual Cost:</strong> £{property.heating_cost_potential || "N/A"} 
            {property.heating_cost_current && property.heating_cost_potential && (
                <span> (Savings: £{(property.heating_cost_current - property.heating_cost_potential).toFixed(2)})</span>
            )}
        </p>

        {/* Main Heating Efficiency */}
        <p className={highlightIfBest(efficiencyRatingToNumber(property.mainheat_energy_eff), maxValues?.maxMainheatEnergyEff)}>
            <strong>Main Heating Efficiency:</strong> {renderStarRating(property.mainheat_energy_eff)}
        </p>

        {/* Main Heating Control Efficiency (Highlighted) */}
        <p className={highlightIfBest(efficiencyRatingToNumber(property.mainheatc_energy_eff), maxValues?.maxMainheatControllerEff) + " highlight-best"}>
            <strong>Main Heating Control Efficiency:</strong> {renderStarRating(property.mainheatc_energy_eff)}
        </p>

        {/* Additional Heating Details */}
        <p><strong>Main Fuel:</strong> {property.main_fuel || "N/A"}</p>
        <p><strong>Main Heating Controls:</strong> {property.main_heating_controls || "N/A"}</p>
        <p><strong>Mainheat Description:</strong> {property.mainheat_description || "N/A"}</p>
        <p><strong>Mainheat Controller Description:</strong> {property.mainheat_controller_description || "N/A"}</p>
    </div>
)}


{activeTabs.energy === "lighting" && (
    <div>
        <h4>💡 Lighting</h4>
        <p className={highlightIfBest(parseNumericValue(property.lighting_cost_current), maxValues?.minLightingCostCurrent)}>
            <strong>Current Annual Cost:</strong> £{property.lighting_cost_current || "N/A"}
        </p>
        <p className={highlightIfBest(
            parseNumericValue(property.lighting_cost_current - property.lighting_cost_potential),
            maxValues?.maxLightingCostSavings
        )}>
            <strong>Potential Annual Cost:</strong> £{property.lighting_cost_potential || "N/A"}
        </p>

        {/* Low Energy Lighting Progress Bar */}
        <div className="epc-progress-container">
            <h5>Low Energy Lighting</h5>
            <div className="epc-progress-wrapper">
                <progress
                    className="epc-progress-bar"
                    value={property.low_energy_lighting || 0}
                    max="100"
                ></progress>
                <span className="epc-progress-label">{property.low_energy_lighting || 0}%</span>
            </div>
        </div>

        <p className={highlightIfBest(efficiencyRatingToNumber(property.lighting_energy_eff), maxValues?.maxLightingEnergyEff)}>
            <strong>Lighting Efficiency:</strong> {renderStarRating(property.lighting_energy_eff)}
        </p>
    </div>
)}



{activeTabs.energy === "hotWater" && (
    <div>
        <h4>🚿 Hot Water</h4>
        <p className={highlightIfBest(parseNumericValue(property.hot_water_cost_current), maxValues?.minHotWaterCostCurrent)}>
            <strong>Current Annual Cost:</strong> £{property.hot_water_cost_current || "N/A"}
        </p>
        <p className={highlightIfBest(
            parseNumericValue(property.hot_water_cost_current - property.hot_water_cost_potential),
            maxValues?.maxHotWaterCostSavings
        )}>
            <strong>Potential Annual Cost:</strong> £{property.hot_water_cost_potential || "N/A"}
        </p>
        <p className={highlightIfBest(efficiencyRatingToNumber(property.hot_water_energy_eff), maxValues?.maxHotWaterEnergyEff)}>
            <strong>Hot Water Efficiency:</strong> {renderStarRating(property.hot_water_energy_eff)}
        </p>
    </div>
)}


                        </div>
                    </div>
                )}
            </div>

            
            {/* Property Structure Dropdown */}
            <div className="accordion">
                <div className="accordion-header" onClick={() => toggleDropdown("structure")}>
                    {openDropdowns.structure ? "▼ Hide Property Structure" : "▶ Show Property Structure"}
                </div>
                {openDropdowns.structure && (
                    <div className="accordion-content">
                        <div className="tabs">
                            <button
                                className={activeTabs.structure === "windows" ? "active" : ""}
                                onClick={() => setActiveTab("structure", "windows")}
                            >
                                Windows
                            </button>
                            <button
                                className={activeTabs.structure === "floor" ? "active" : ""}
                                onClick={() => setActiveTab("structure", "floor")}
                            >
                                Floor
                            </button>
                            <button
                                className={activeTabs.structure === "roof" ? "active" : ""}
                                onClick={() => setActiveTab("structure", "roof")}
                            >
                                Roof
                            </button>
                            <button
                                className={activeTabs.structure === "walls" ? "active" : ""}
                                onClick={() => setActiveTab("structure", "walls")}
                            >
                                Walls
                            </button>
                        </div>
                        <div className="tab-content">
                        {activeTabs.structure === "windows" && (
    <div>
        <h4>🪟 Windows</h4>
        <div className="epc-progress-container">
            <h5>Multi Glaze Proportion</h5>
            <div className="epc-progress-wrapper">
                <progress
                    className="epc-progress-bar"
                    value={property.multi_glaze_proportion || 0}
                    max="100"
                ></progress>
                <span className="epc-progress-label">{property.multi_glaze_proportion || 0}%</span>
            </div>
        </div>
        <p><strong>Glazed Type:</strong> {property.glazed_type || "N/A"}</p>
        <p><strong>Glazed Area:</strong> {property.glazed_area || "N/A"}</p>
        <p><strong>Windows Description:</strong> {property.windows_description || "N/A"}</p>
        <p className={highlightIfBest(efficiencyRatingToNumber(property.windows_energy_eff), maxValues?.maxWindowsEnergyEff)}>
            <strong>Windows Energy Efficiency:</strong> {renderStarRating(property.windows_energy_eff)}
        </p>
    </div>
)}

{activeTabs.structure === "floor" && (
    <div>
        <h4>🏠 Floor</h4>
        <p><strong>Total Floor Area:</strong> {property.total_floor_area || "N/A"} m²</p>
        <p><strong>Floor Level:</strong> {property.floor_level || "N/A"}</p>
        <p><strong>Flat Top Storey:</strong> {property.flat_top_storey ? "Yes" : "No"}</p>
        <p><strong>Floor Height:</strong> {property.floor_height || "N/A"} m</p>
        <p><strong>Floor Description:</strong> {property.floor_description || "N/A"}</p>
        <p className={highlightIfBest(efficiencyRatingToNumber(property.floor_energy_eff), maxValues?.maxFloorEnergyEff)}>
            <strong>Floor Energy Efficiency:</strong> {renderStarRating(property.floor_energy_eff)}
        </p>
    </div>
)}

{activeTabs.structure === "roof" && (
    <div>
        <h4>🏗️ Roof</h4>
        <p><strong>Roof Description:</strong> {property.roof_description || "N/A"}</p>
        <p className={highlightIfBest(efficiencyRatingToNumber(property.roof_energy_eff), maxValues?.maxRoofEnergyEff)}>
            <strong>Roof Energy Efficiency:</strong> {renderStarRating(property.roof_energy_eff)}
        </p>
    </div>
)}

{activeTabs.structure === "walls" && (
    <div>
        <h4>🧱 Walls</h4>
        <p><strong>Walls Description:</strong> {property.walls_description || "N/A"}</p>
        <p><strong>Unheated Corridor Length:</strong> {property.unheated_corridor_length || "N/A"} m</p>
        <p><strong>Heat Loss Corridor:</strong> {property.heat_loss_corridor || "N/A"}</p>
        <p className={highlightIfBest(efficiencyRatingToNumber(property.walls_energy_eff), maxValues?.maxWallsEnergyEff)}>
            <strong>Walls Energy Efficiency:</strong> {renderStarRating(property.walls_energy_eff)}
        </p>
    </div>
)}

                    </div>
                </div>
            )}
        </div>
    </div>
);
};

export default PropertyInfoDropdown;
