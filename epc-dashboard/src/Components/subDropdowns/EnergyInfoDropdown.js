import React from "react";
import { efficiencyRatingToNumber, parseNumericValue } from "../Compare_utils/Compare_utils";
import "../PropertyInfoDropdown.css";

const EnergyInfoDropdown = ({ 
    property, 
    toggleDropdown, 
    openDropdowns, 
    activeTabs, 
    setActiveTab, 
    highlightIfBest, 
    maxValues, 
    renderStarRating 
}) => {
    return (
        <div className="accordion">
            <div className="accordion-header" onClick={() => toggleDropdown("energy")}>
                {openDropdowns.energy ? "▼ Hide Energy Information" : "▶ Show Energy Information"}
            </div>
            {openDropdowns.energy && (
                <div className="accordion-content">
                    <div className="tabs">
                        <button className={activeTabs.energy === "heating" ? "active" : ""} onClick={() => setActiveTab("energy", "heating")}>
                            Heating
                        </button>
                        <button className={activeTabs.energy === "lighting" ? "active" : ""} onClick={() => setActiveTab("energy", "lighting")}>
                            Lighting
                        </button>
                        <button className={activeTabs.energy === "hotWater" ? "active" : ""} onClick={() => setActiveTab("energy", "hotWater")}>
                            Hot Water
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTabs.energy === "heating" && (
                            <div>
                                <h4>🏡 Heating</h4>

                                {/* Current Annual Cost */}
                                <p className={highlightIfBest(parseNumericValue(property?.heating_cost_current), maxValues?.minHeatingCostCurrent)}>
                                    <strong>Current Annual Cost:</strong> £{property?.heating_cost_current || "N/A"}
                                </p>

                                {/* Potential Annual Cost with Savings */}
                                <p className={highlightIfBest(
                                    parseNumericValue((property?.heating_cost_current || 0) - (property?.heating_cost_potential || 0)),
                                    maxValues?.maxHeatingCostSavings
                                )}>
                                    <strong>Potential Annual Cost:</strong> £{property?.heating_cost_potential || "N/A"}
                                    {property?.heating_cost_current && property?.heating_cost_potential && (
                                        <span> (Savings: £{((property?.heating_cost_current - property?.heating_cost_potential) || 0).toFixed(2)})</span>
                                    )}
                                </p>

                                {/* Main Heating Efficiency (Restored Star Rating) */}
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.mainheat_energy_eff), maxValues?.maxMainheatEnergyEff)}>
                                    <strong>Main Heating Efficiency:</strong> {renderStarRating(property?.mainheat_energy_eff)}
                                </p>

                                {/* Main Heating Control Efficiency (Restored Star Rating) */}
                                <p className={`${highlightIfBest(efficiencyRatingToNumber(property?.mainheatc_energy_eff), maxValues?.maxMainheatControllerEff)} highlight-best`}>
                                    <strong>Main Heating Control Efficiency:</strong> {renderStarRating(property?.mainheatc_energy_eff)}
                                </p>

                                {/* Additional Heating Details */}
                                <p><strong>Main Fuel:</strong> {property?.main_fuel || "N/A"}</p>
                                <p><strong>Main Heating Controls:</strong> {property?.main_heating_controls || "N/A"}</p>
                                <p><strong>Mainheat Description:</strong> {property?.mainheat_description || "N/A"}</p>
                                <p><strong>Mainheat Controller Description:</strong> {property?.mainheat_controller_description || "N/A"}</p>
                            </div>
                        )}

                        {activeTabs.energy === "lighting" && (
                            <div>
                                <h4>💡 Lighting</h4>
                                <p className={highlightIfBest(parseNumericValue(property?.lighting_cost_current), maxValues?.minLightingCostCurrent)}>
                                    <strong>Current Annual Cost:</strong> £{property?.lighting_cost_current || "N/A"}
                                </p>
                                <p className={highlightIfBest(
                                    parseNumericValue((property?.lighting_cost_current || 0) - (property?.lighting_cost_potential || 0)),
                                    maxValues?.maxLightingCostSavings
                                )}>
                                    <strong>Potential Annual Cost:</strong> £{property?.lighting_cost_potential || "N/A"}
                                </p>

                                {/* Low Energy Lighting Progress Bar */}
                                <div className="epc-progress-container">
                                    <h5>Low Energy Lighting</h5>
                                    <div className="epc-progress-wrapper">
                                        <progress className="epc-progress-bar" value={property?.low_energy_lighting || 0} max="100"></progress>
                                        <span className="epc-progress-label">{property?.low_energy_lighting || 0}%</span>
                                    </div>
                                </div>

                                {/* Lighting Efficiency (Restored Star Rating) */}
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.lighting_energy_eff), maxValues?.maxLightingEnergyEff)}>
                                    <strong>Lighting Efficiency:</strong> {renderStarRating(property?.lighting_energy_eff)}
                                </p>
                            </div>
                        )}

                        {activeTabs.energy === "hotWater" && (
                            <div>
                                <h4>🚿 Hot Water</h4>
                                <p className={highlightIfBest(parseNumericValue(property?.hot_water_cost_current), maxValues?.minHotWaterCostCurrent)}>
                                    <strong>Current Annual Cost:</strong> £{property?.hot_water_cost_current || "N/A"}
                                </p>
                                <p className={highlightIfBest(
                                    parseNumericValue((property?.hot_water_cost_current || 0) - (property?.hot_water_cost_potential || 0)),
                                    maxValues?.maxHotWaterCostSavings
                                )}>
                                    <strong>Potential Annual Cost:</strong> £{property?.hot_water_cost_potential || "N/A"}
                                </p>

                                {/* Hot Water Efficiency (Restored Star Rating) */}
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.hot_water_energy_eff), maxValues?.maxHotWaterEnergyEff)}>
                                    <strong>Hot Water Efficiency:</strong> {renderStarRating(property?.hot_water_energy_eff)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnergyInfoDropdown;
