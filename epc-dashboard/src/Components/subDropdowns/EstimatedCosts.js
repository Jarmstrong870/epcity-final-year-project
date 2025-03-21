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
  const [animatedCosts, setAnimatedCosts] = useState({
    heating: 0,
    hotWater: 0,
    lighting: 0,
  });

  useEffect(() => {
    const animateCost = (targetValue, key) => {
      let current = 0;
      const duration = 1200;
      const stepTime = Math.max(10, Math.floor(duration / targetValue));

      const timer = setInterval(() => {
        current += Math.ceil(targetValue / 30);
        if (current >= targetValue) {
          current = targetValue;
          clearInterval(timer);
        }
        setAnimatedCosts((prev) => ({ ...prev, [key]: current }));
      }, stepTime);
    };

    if (property) {
      setTimeout(() => animateCost(parseNumericValue(property.heating_cost_current) || 0, "heating"), 200);
      setTimeout(() => animateCost(parseNumericValue(property.hot_water_cost_current) || 0, "hotWater"), 400);
      setTimeout(() => animateCost(parseNumericValue(property.lighting_cost_current) || 0, "lighting"), 600);
    }
  }, [property]);

  return (
    <div className="estimated-costs-container">
      <h4>{t.estimatedCosts}</h4>

      <div className="estimated-costs-content">
        {/* Heating Cost */}
        <div className={`estimated-cost-item ${highlightIfBest(parseNumericValue(property.heating_cost_current), maxValues?.minHeatingCostCurrent)}`}>
          <img src={radiatorGif} alt="Radiator Heating" className="cost-icon" />
          <p className="floating-label">{t.heatingCostExample}:</p>
          <strong className="cost-value">£{((animatedCosts.heating.toFixed(2)/365)*2).toFixed(2)}</strong>
        </div>

        {/* Hot Water Cost */}
        <div className={`estimated-cost-item ${highlightIfBest(parseNumericValue(property.hot_water_cost_current), maxValues?.minHotWaterCostCurrent)}`}>
          <img src={showerGif} alt="Shower Water" className="cost-icon" />
          <p className="floating-label">{t.hotWaterCostExample}:</p>
          <strong className="cost-value">£{((animatedCosts.hotWater.toFixed(2)/365)).toFixed(2)}</strong>
        </div>

        {/* Lighting Cost */}
        <div className={`estimated-cost-item ${highlightIfBest(parseNumericValue(property.lighting_cost_current), maxValues?.minLightingCostCurrent)}`}>
          <img src={bulbGif} alt="Light Bulb" className="cost-icon" />
          <p className="floating-label">{t.lightingCostExample}:</p>
          <strong className="cost-value">£{(animatedCosts.lighting.toFixed(2)/365).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default EstimatedCosts;
