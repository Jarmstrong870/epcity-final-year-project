import React from "react";
import { efficiencyRatingToNumber, parseNumericValue } from "../Compare_utils/Compare_utils";
import "../PropertyInfoDropdown.css";
import { Link } from "react-router-dom"; // Import Link component for navigation
import translations from "../../locales/translations_energyinfodropdown"; // Import translations for this component

const EnergyInfoDropdown = ({ 
    property, 
    toggleDropdown, 
    openDropdowns, 
    activeTabs, 
    setActiveTab, 
    highlightIfBest, 
    maxValues, 
    renderStarRating, 
    language // Language prop to pass translations
}) => {
    const t = translations[language] || translations.en; // Use translations based on selected language

    return (
        <div className="accordion">
            <div className="accordion-header" onClick={() => toggleDropdown("energy")}>
                {openDropdowns.energy ? `▼ ${t.hideEnergyInfo}` : `▶ ${t.showEnergyInfo}`}
            </div>
            {openDropdowns.energy && (
                <div className="accordion-content">
                    <div className="tabs">
                        <button
                            className={activeTabs.energy === "heating" ? "active" : ""}
                            onClick={() => setActiveTab("energy", "heating")}
                        >
                            {t.heating}
                        </button>
                        <button
                            className={activeTabs.energy === "lighting" ? "active" : ""}
                            onClick={() => setActiveTab("energy", "lighting")}
                        >
                            {t.lighting}
                        </button>
                        <button
                            className={activeTabs.energy === "hotWater" ? "active" : ""}
                            onClick={() => setActiveTab("energy", "hotWater")}
                        >
                            {t.hotWater}
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTabs.energy === "heating" && (
                            <div>
                                <h4>🏡 {t.heating}</h4>

                                {/* Current Annual Cost */}
                                <p className={highlightIfBest(parseNumericValue(property?.heating_cost_current), maxValues?.minHeatingCostCurrent)}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.currentAnnualCost)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.currentAnnualCost}:
                                    </strong> £{property?.heating_cost_current || "N/A"}
                                </p>

                                {/* Potential Annual Cost with Savings */}
                                <p className={highlightIfBest(
                                    parseNumericValue((property?.heating_cost_current || 0) - (property?.heating_cost_potential || 0)),
                                    maxValues?.maxHeatingCostSavings
                                )}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.potentialAnnualCost)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.potentialAnnualCost}:
                                    </strong> £{property?.heating_cost_potential || "N/A"}
                                    {property?.heating_cost_current && property?.heating_cost_potential && (
                                        <span> ({t.savings}: £{((property?.heating_cost_current - property?.heating_cost_potential) || 0).toFixed(2)})</span>
                                    )}
                                </p>

                                {/* Main Heating Efficiency with Green Question Mark */}
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.mainheat_energy_eff), maxValues?.maxMainheatEnergyEff)}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.mainHeatingEfficiency)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.mainHeatingEfficiency}:
                                    </strong> {renderStarRating(property?.mainheat_energy_eff)}
                                </p>

                                {/* Main Heating Control Efficiency with Green Question Mark */}
                                <p className={`${highlightIfBest(efficiencyRatingToNumber(property?.mainheatc_energy_eff), maxValues?.maxMainheatControllerEff)} highlight-best`}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.mainHeatingControlEfficiency)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.mainHeatingControlEfficiency}:
                                    </strong> {renderStarRating(property?.mainheatc_energy_eff)}
                                </p>

                                {/* Additional Heating Details */}
                                <p>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.mainFuel)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.mainFuel}:
                                    </strong> {property?.main_fuel || "N/A"}
                                </p>
                                <p>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.mainHeatingControls)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.mainHeatingControls}:
                                    </strong> {property?.main_heating_controls || "N/A"}
                                </p>
                                <p>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.mainheatDescription)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.mainheatDescription}:
                                    </strong> {property?.mainheat_description || "N/A"}
                                </p>
                                <p>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.mainheatControllerDescription)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.mainheatControllerDescription}:
                                    </strong> {property?.mainheat_controller_description || "N/A"}
                                </p>
                            </div>
                        )}

                        {activeTabs.energy === "lighting" && (
                            <div>
                                <h4>💡 {t.lighting}</h4>
                                <p className={highlightIfBest(parseNumericValue(property?.lighting_cost_current), maxValues?.minLightingCostCurrent)}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.currentAnnualCost)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.currentAnnualCost}:
                                    </strong> £{property?.lighting_cost_current || "N/A"}
                                </p>
                                <p className={highlightIfBest(
                                    parseNumericValue((property?.lighting_cost_current || 0) - (property?.lighting_cost_potential || 0)),
                                    maxValues?.maxLightingCostSavings
                                )}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.potentialAnnualCost)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.potentialAnnualCost}:
                                    </strong> £{property?.lighting_cost_potential || "N/A"}
                                </p>

                                {/* Low Energy Lighting Progress Bar */}
                                <div className="epc-progress-container">
                                    <h5>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.lowEnergyLighting)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.lowEnergyLighting}
                                    </h5>
                                    <div className="epc-progress-wrapper">
                                        <progress className="epc-progress-bar" value={property?.low_energy_lighting || 0} max="100"></progress>
                                        <span className="epc-progress-label">{property?.low_energy_lighting || 0}%</span>
                                    </div>
                                </div>

                                {/* Lighting Efficiency (Restored Star Rating) */}
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.lighting_energy_eff), maxValues?.maxLightingEnergyEff)}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.lightingEfficiency)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.lightingEfficiency}:
                                    </strong> {renderStarRating(property?.lighting_energy_eff)}
                                </p>
                            </div>
                        )}

                        {activeTabs.energy === "hotWater" && (
                            <div>
                                <h4>🚿 {t.hotWater}</h4>
                                <p className={highlightIfBest(parseNumericValue(property?.hot_water_cost_current), maxValues?.minHotWaterCostCurrent)}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.currentAnnualCost)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.currentAnnualCost}:
                                    </strong> £{property?.hot_water_cost_current || "N/A"}
                                </p>
                                <p className={highlightIfBest(
                                    parseNumericValue((property?.hot_water_cost_current || 0) - (property?.hot_water_cost_potential || 0)),
                                    maxValues?.maxHotWaterCostSavings
                                )}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.potentialAnnualCost)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.potentialAnnualCost}:
                                    </strong> £{property?.hot_water_cost_potential || "N/A"}
                                </p>

                                {/* Hot Water Efficiency (Restored Star Rating) */}
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.hot_water_energy_eff), maxValues?.maxHotWaterEnergyEff)}>
                                    <strong>
                                        <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.hotWaterEfficiency)}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <span className="green-question-mark"></span>
                                        </Link>
                                        {t.hotWaterEfficiency}:
                                    </strong> {renderStarRating(property?.hot_water_energy_eff)}
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
