import React from "react";
import { energyRatingToNumber, parseNumericValue } from "../Compare_utils/Compare_utils";
import "../PropertyInfoDropdown.css";

const EPCInfoDropdown = ({ 
    property, 
    toggleDropdown, 
    openDropdowns, 
    activeTabs, 
    setActiveTab, 
    highlightIfBest, 
    maxValues 
}) => {
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
        </div>
    );
};

export default EPCInfoDropdown;
