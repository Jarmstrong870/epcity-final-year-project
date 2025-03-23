import React, { useState, useEffect } from "react";
import { parseNumericValue } from "../Compare_utils/Compare_utils"; 
import "./EstimatedCosts.css"; 
import translations from "../../locales/translations_epcinfodropdown"; 

// Import GIFs
import bulbGif from "./icons/bulb.gif";
import showerGif from "./icons/shower.gif";
import radiatorGif from "./icons/radiator.gif";

const EstimatedCosts = ({ property, highlightIfBest, maxValues, language }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="estimated-costs-container">
      <h4>{t.estimatedCosts}</h4>

      <div className="estimated-costs-content">
        {/* Heating Cost */}
        <div className={`estimated-cost-item ${highlightIfBest(parseNumericValue(property.heating_example), maxValues?.minHeatingCostCurrent)}`}>
          <img src={radiatorGif} alt="Radiator Heating" className="cost-icon" />
          <p className="floating-label">{t.heatingCostExample}:</p>
          <strong className="cost-value">£{parseNumericValue(property.heating_example).toFixed(2)}</strong>
        </div>

        {/* Hot Water Cost */}
        <div className={`estimated-cost-item ${highlightIfBest(parseNumericValue(property.hot_water_example), maxValues?.minHotWaterCostCurrent)}`}>
          <img src={showerGif} alt="Shower Water" className="cost-icon" />
          <p className="floating-label">{t.hotWaterCostExample}:</p>
          <strong className="cost-value">£{parseNumericValue(property.hot_water_example).toFixed(2)}</strong>
        </div>

        {/* Lighting Cost */}
        <div className={`estimated-cost-item ${highlightIfBest(parseNumericValue(property.lighting_example), maxValues?.minLightingCostCurrent)}`}>
          <img src={bulbGif} alt="Light Bulb" className="cost-icon" />
          <p className="floating-label">{t.lightingCostExample}:</p>
          <strong className="cost-value">£{parseNumericValue(property.lighting_example).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default EstimatedCosts;
