import React from "react";
import { efficiencyRatingToNumber } from "../Compare_utils/Compare_utils";
import "../PropertyInfoDropdown.css";

const StructureInfoDropdown = ({ 
    property, 
    toggleDropdown, 
    openDropdowns, 
    activeTabs, 
    setActiveTab, 
    highlightIfBest, 
    maxValues,
    renderStarRating // ✅ Make sure this is passed as a prop
}) => {
    return (
        <div className="accordion">
            {/* Property Structure Dropdown */}
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
                                            value={property?.multi_glaze_proportion || 0}
                                            max="100"
                                        ></progress>
                                        <span className="epc-progress-label">{property?.multi_glaze_proportion || 0}%</span>
                                    </div>
                                </div>
                                <p><strong>Glazed Type:</strong> {property?.glazed_type || "N/A"}</p>
                                <p><strong>Glazed Area:</strong> {property?.glazed_area || "N/A"}</p>
                                <p><strong>Windows Description:</strong> {property?.windows_description || "N/A"}</p>
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.windows_energy_eff || "N/A"), maxValues?.maxWindowsEnergyEff)}>
                                    <strong>Windows Energy Efficiency:</strong> {renderStarRating(property?.windows_energy_eff)}
                                </p>
                            </div>
                        )}

                        {activeTabs.structure === "floor" && (
                            <div>
                                <h4>🏠 Floor</h4>
                                <p><strong>Total Floor Area:</strong> {property?.total_floor_area || "N/A"} m²</p>
                                <p><strong>Floor Level:</strong> {property?.floor_level || "N/A"}</p>
                                <p><strong>Flat Top Storey:</strong> {property?.flat_top_storey ? "Yes" : "No"}</p>
                                <p><strong>Floor Height:</strong> {property?.floor_height || "N/A"} m</p>
                                <p><strong>Floor Description:</strong> {property?.floor_description || "N/A"}</p>
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.floor_energy_eff || "N/A"), maxValues?.maxFloorEnergyEff)}>
                                    <strong>Floor Energy Efficiency:</strong> {renderStarRating(property?.floor_energy_eff)}
                                </p>
                            </div>
                        )}

                        {activeTabs.structure === "roof" && (
                            <div>
                                <h4>🏗️ Roof</h4>
                                <p><strong>Roof Description:</strong> {property?.roof_description || "N/A"}</p>
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.roof_energy_eff || "N/A"), maxValues?.maxRoofEnergyEff)}>
                                    <strong>Roof Energy Efficiency:</strong> {renderStarRating(property?.roof_energy_eff)}
                                </p>
                            </div>
                        )}

                        {activeTabs.structure === "walls" && (
                            <div>
                                <h4>🧱 Walls</h4>
                                <p><strong>Walls Description:</strong> {property?.walls_description || "N/A"}</p>
                                <p><strong>Unheated Corridor Length:</strong> {property?.unheated_corridor_length || "N/A"} m</p>
                                <p><strong>Heat Loss Corridor:</strong> {property?.heat_loss_corridor || "N/A"}</p>
                                <p className={highlightIfBest(efficiencyRatingToNumber(property?.walls_energy_eff || "N/A"), maxValues?.maxWallsEnergyEff)}>
                                    <strong>Walls Energy Efficiency:</strong> {renderStarRating(property?.walls_energy_eff)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StructureInfoDropdown;
