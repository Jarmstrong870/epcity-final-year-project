import React from "react";
import { energyRatingToNumber, parseNumericValue } from "../Compare_utils/Compare_utils";
import "../PropertyInfoDropdown.css";
import { Link } from "react-router-dom"; // Import Link component for navigation
import translations from "../../locales/translations_epcinfodropdown"; // Import translations for this component

const EPCInfoDropdown = ({
  property,
  toggleDropdown,
  openDropdowns,
  activeTabs,
  setActiveTab,
  highlightIfBest,
  maxValues,
  language // Language prop to pass translations
}) => {
  const t = translations[language] || translations.en; // Use translations based on selected language

  return (
    <div>
      {/* EPC Information Dropdown */}
      <div className="accordion">
        <div className="accordion-header" onClick={() => toggleDropdown("epc")}>
          {openDropdowns.epc ? `▼ ${t.hideEPCInfo}` : `▶ ${t.showEPCInfo}`}
        </div>

        {openDropdowns.epc && (
          <div className="accordion-content">
            <div className="tabs">
              <button
                className={activeTabs.epc === "rating" ? "active" : ""}
                onClick={() => setActiveTab("epc", "rating")}
              >
                {t.epcRating}
              </button>
              <button
                className={activeTabs.epc === "costs" ? "active" : ""}
                onClick={() => setActiveTab("epc", "costs")}
              >
                {t.estimatedCosts}
              </button>
              <button
                className={activeTabs.epc === "info" ? "active" : ""}
                onClick={() => setActiveTab("epc", "info")}
              >
                {t.propertyInfo}
              </button>
            </div>

            <div className="tab-content">
              {activeTabs.epc === "rating" && (
                <div>
                  <h4>{t.epcRating}</h4>
                  <p className={highlightIfBest(energyRatingToNumber(property.current_energy_rating), maxValues?.maxEnergyRating)}>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.currentEPCGrade)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.currentEPCGrade}:
                    </strong> {property.current_energy_rating || "N/A"}
                  </p>
                  <p className={highlightIfBest(energyRatingToNumber(property.potential_energy_rating), maxValues?.maxPotentialEnergyRating)}>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.potentialEPCGrade)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.potentialEPCGrade}:
                    </strong> {property.potential_energy_rating || "N/A"}
                  </p>
                  <p className={highlightIfBest(parseNumericValue(property.energy_consumption_current), maxValues?.minEnergyConsumptionCurrent)}>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.energyConsumption)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.energyConsumption}:
                    </strong> {property.energy_consumption_current || "N/A"} KWh/m²
                  </p>
                  <p>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.totalEnergyUsage)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.totalEnergyUsage}:
                    </strong> {property.energy_consumption_current * (property.total_floor_area || 1)} KWh
                  </p>
                </div>
              )}

              {activeTabs.epc === "costs" && (
                <div>
                  <h4>{t.estimatedCosts}</h4>
                  <p className={highlightIfBest(parseNumericValue(property.heating_cost_current), maxValues?.minHeatingCostCurrent)}>
                    <strong>{t.heatingCostExample}:</strong> {property.heating_example_formatted || "N/A"}
                  </p>
                  <p className={highlightIfBest(parseNumericValue(property.hot_water_cost_current), maxValues?.minHotWaterCostCurrent)}>
                    <strong>{t.hotWaterCostExample}:</strong> {property.hot_water_example_formatted || "N/A"}
                  </p>
                  <p className={highlightIfBest(parseNumericValue(property.lighting_cost_current), maxValues?.minLightingCostCurrent)}>
                    <strong>{t.lightingCostExample}:</strong> {property.lighting_example_formatted || "N/A"}
                  </p>
                </div>
              )}

              {activeTabs.epc === "info" && (
                <div>
                  <h4>{t.propertyInfo}</h4>
                  <p>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.builtForm)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.builtForm}:
                    </strong> {property.built_form || "N/A"}
                  </p>
                  <p>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.extensionCount)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.extensionCount}:
                    </strong> {property.extension_count || 0}
                  </p>
                  <p>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.lodgementDate)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.lodgementDate}:
                    </strong> {property.lodgement_date || "N/A"}
                  </p>
                  <p>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.tenure)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.tenure}:
                    </strong> {property.tenure || "N/A"}
                  </p>
                  <p>
                    <strong>
                      <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.gasFlag)}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="green-question-mark"></span>
                      </Link>
                      {t.gasFlag}:
                    </strong> {property.mains_gas_flag ? "Yes" : "No"}
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

export default EPCInfoDropdown;
