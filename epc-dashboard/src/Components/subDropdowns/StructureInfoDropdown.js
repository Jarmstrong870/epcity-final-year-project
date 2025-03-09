import React from "react";
import { efficiencyRatingToNumber } from "../Compare_utils/Compare_utils";
import "../PropertyInfoDropdown.css";
import { Link } from "react-router-dom"; // Import Link component for navigation
import translations from "../../locales/translations_structureinfo"; // Import translations for this component

const StructureInfoDropdown = ({
  property,
  toggleDropdown,
  openDropdowns,
  activeTabs,
  setActiveTab,
  highlightIfBest,
  maxValues,
  renderStarRating,
  language, // Language prop to pass translations
}) => {
  const t = translations[language] || translations.en; // Use translations based on selected language

  return (
    <div className="accordion">
      {/* Property Structure Dropdown */}
      <div className="accordion-header" onClick={() => toggleDropdown("structure")}>
        {openDropdowns.structure ? `▼ ${t.hideStructureInfo}` : `▶ ${t.showStructureInfo}`}
      </div>
      {openDropdowns.structure && (
        <div className="accordion-content">
          <div className="tabs">
            <button
              className={activeTabs.structure === "windows" ? "active" : ""}
              onClick={() => setActiveTab("structure", "windows")}
            >
              {t.windows}
            </button>
            <button
              className={activeTabs.structure === "floor" ? "active" : ""}
              onClick={() => setActiveTab("structure", "floor")}
            >
              {t.floor}
            </button>
            <button
              className={activeTabs.structure === "roof" ? "active" : ""}
              onClick={() => setActiveTab("structure", "roof")}
            >
              {t.roof}
            </button>
            <button
              className={activeTabs.structure === "walls" ? "active" : ""}
              onClick={() => setActiveTab("structure", "walls")}
            >
              {t.walls}
            </button>
          </div>
          <div className="tab-content">
            {activeTabs.structure === "windows" && (
              <div>
                <h4>🪟 {t.windows}</h4>
                {/* Multi Glaze Proportion */}
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('multi glaze proportion')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.multiGlazeProportion}:
                  </strong> {property?.multi_glaze_proportion || "N/A"}%
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('glazed type')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.glazedType}:
                  </strong> {property?.glazed_type || "N/A"}
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('glazed area')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.glazedArea}:
                  </strong> {property?.glazed_area || "N/A"}
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('windows description')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.windowsDescription}:
                  </strong> {property?.windows_description || "N/A"}
                </p>
                <p className={highlightIfBest(efficiencyRatingToNumber(property?.windows_energy_eff || "N/A"), maxValues?.maxWindowsEnergyEff)}>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('windows energy efficiency')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.windowsEnergyEfficiency}:
                  </strong> {renderStarRating(property?.windows_energy_eff)}
                </p>
              </div>
            )}

            {activeTabs.structure === "floor" && (
              <div>
                <h4>🏠 {t.floor}</h4>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('total floor area')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.totalFloorArea}:
                  </strong> {property?.total_floor_area || "N/A"} m²
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('floor level')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.floorLevel}:
                  </strong> {property?.floor_level || "N/A"}
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('flat top storey')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.flatTopStorey}:
                  </strong> {property?.flat_top_storey ? t.yes : t.no}
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('floor height')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.floorHeight}:
                  </strong> {property?.floor_height || "N/A"} m
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('floor description')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.floorDescription}:
                  </strong> {property?.floor_description || "N/A"}
                </p>
                <p className={highlightIfBest(efficiencyRatingToNumber(property?.floor_energy_eff || "N/A"), maxValues?.maxFloorEnergyEff)}>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('floor energy efficiency')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.floorEnergyEfficiency}:
                  </strong> {renderStarRating(property?.floor_energy_eff)}
                </p>
              </div>
            )}

            {activeTabs.structure === "roof" && (
              <div>
                <h4>🏗️ {t.roof}</h4>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('roof description')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.roofDescription}:
                  </strong> {property?.roof_description || "N/A"}
                </p>
                <p className={highlightIfBest(efficiencyRatingToNumber(property?.roof_energy_eff || "N/A"), maxValues?.maxRoofEnergyEff)}>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('roof energy efficiency')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.roofEnergyEfficiency}:
                  </strong> {renderStarRating(property?.roof_energy_eff)}
                </p>
              </div>
            )}

            {activeTabs.structure === "walls" && (
              <div>
                <h4>🧱 {t.walls}</h4>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('walls description')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.wallsDescription}:
                  </strong> {property?.walls_description || "N/A"}
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('unheated corridor length')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.unheatedCorridorLength}:
                  </strong> {property?.unheated_corridor_length || "N/A"} m
                </p>
                <p>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('heat loss corridor')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.heatLossCorridor}:
                  </strong> {property?.heat_loss_corridor || "N/A"}
                </p>
                <p className={highlightIfBest(efficiencyRatingToNumber(property?.walls_energy_eff || "N/A"), maxValues?.maxWallsEnergyEff)}>
                  <strong>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent('walls energy efficiency')}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <span className="green-question-mark"></span>
                    </Link>
                    {t.wallsEnergyEfficiency}:
                  </strong> {renderStarRating(property?.walls_energy_eff)}
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
