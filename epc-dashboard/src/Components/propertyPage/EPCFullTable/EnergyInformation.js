import React from "react";
import styles from "./EnergyInfo.module.css";
import { efficiencyRatingToNumber } from "../../Compare_utils/Compare_utils";
import "../../Compare_utils/HighlightedValue.css"; // Ensure correct CSS import
import translations from "./locales/translations_energyinformation";

// Function to render star ratings based on efficiency
const renderStarRating = (efficiency, t) => {
  if (!efficiency || efficiency.toUpperCase() === 'NODATA!') return t.na;

  const rating = efficiency.toLowerCase();
  switch (rating) {
    case 'very good':
      return `${t.veryGood} ⭐⭐⭐⭐⭐`;
    case 'good':
      return `${t.good} ⭐⭐⭐⭐`;
    case 'average':
      return `${t.average} ⭐⭐⭐`;
    case 'poor':
      return `${t.poor} ⭐⭐`;
    case 'very poor':
      return `${t.veryPoor} ⭐`;
    default:
      return `${efficiency} ☆`;
  }
};

const EnergyInformation = ({ properties, maxValues, language }) => {
  const t = translations[language] || translations.en;

  // Highlight conditions for costs
  const isLowestHeatingCost = properties["heating_cost_current"] === maxValues?.minHeatingCostCurrent;
  const isBiggestHeatingSavings =
    properties["heating_cost_current"] - properties["heating_cost_potential"] === maxValues?.maxHeatingCostSavings;

  const isLowestLightingCost = properties["lighting_cost_current"] === maxValues?.minLightingCostCurrent;
  const isBiggestLightingSavings =
    properties["lighting_cost_current"] - properties["lighting_cost_potential"] === maxValues?.maxLightingCostSavings;

  const isLowestHotWaterCost = properties["hot_water_cost_current"] === maxValues?.minHotWaterCostCurrent;
  const isBiggestHotWaterSavings =
    properties["hot_water_cost_current"] - properties["hot_water_cost_potential"] === maxValues?.maxHotWaterCostSavings;

  // Highlight conditions for star ratings
  const isHighestMainheatEff = efficiencyRatingToNumber(properties["mainheat_energy_eff"]) === maxValues?.maxMainheatEnergyEff;
  const isHighestMainheatControllerEff = efficiencyRatingToNumber(properties["mainheatc_energy_eff"]) === maxValues?.maxMainheatControllerEff;
  const isHighestLightingEff = efficiencyRatingToNumber(properties["lighting_energy_eff"]) === maxValues?.maxLightingEnergyEff;
  const isHighestHotWaterEff = efficiencyRatingToNumber(properties["hot_water_energy_eff"]) === maxValues?.maxHotWaterEnergyEff;

  return (
    <div className={styles.energyInfoContainer}>
      <div className={styles.energyHeader}>{t.energyInformation}</div>

      {/* Heating Section */}
      <div className={`${styles.energyBox} ${styles.heating}`}>
        <h2>{t.heating}</h2>
        <p className={isLowestHeatingCost ? "highlight-green" : ""}>
          {t.currentAnnualCost}: £{properties["heating_cost_current"]}
        </p>
        <p className={isBiggestHeatingSavings ? "highlight-green" : ""}>
          {t.potentialAnnualCost}: £{properties["heating_cost_potential"]} ({t.savings}: £
          {(properties["heating_cost_current"] - properties["heating_cost_potential"]).toFixed(2)})
        </p>
        <p>{t.mainFuel}: {properties["main_fuel"]}</p>
        <p>{t.mainHeatingControls}: {properties["main_heating_controls"]}</p>
        <p>{t.mainheatDescription}: {properties["mainheat_description"]}</p>
        <p className={isHighestMainheatEff ? "highlight-green" : ""}>
          {t.mainheatEnergyEfficiency}: {renderStarRating(properties["mainheat_energy_eff"], t)}
        </p>
        <p>{t.mainheatControllerDescription}: {properties["mainheatcont_description"]}</p>
        <p className={isHighestMainheatControllerEff ? "highlight-green" : ""}>
          {t.mainheatControllerEnergyEfficiency}: {renderStarRating(properties["mainheatc_energy_eff"], t)}
        </p>
      </div>

      {/* Lighting Section */}
      <div className={`${styles.energyBox} ${styles.lighting}`}>
        <h2>{t.lighting}</h2>
        <p className={isLowestLightingCost ? "highlight-green" : ""}>
          {t.currentAnnualCost}: £{properties["lighting_cost_current"]}
        </p>
        <p className={isBiggestLightingSavings ? "highlight-green" : ""}>
          {t.potentialAnnualCost}: £{properties["lighting_cost_potential"]} ({t.savings}: £
          {(properties["lighting_cost_current"] - properties["lighting_cost_potential"]).toFixed(2)})
        </p>
        <div className="progressContainer">
          <p>{t.lowEnergyLighting}</p>
          <progress value={properties["low_energy_lighting"]} max={100} />
          <span>{properties["low_energy_lighting"]}%</span>
        </div>
        <p>{t.lightingDescription}: {properties["lighting_description"]}</p>
        <p className={isHighestLightingEff ? "highlight-green" : ""}>
          {t.lightingEnergyEfficiency}: {renderStarRating(properties["lighting_energy_eff"], t)}
        </p>
      </div>

      {/* Hot Water Section */}
      <div className={`${styles.energyBox} ${styles.hotWater}`}>
        <h2>{t.hotWaterCosts}</h2>
        <p className={isLowestHotWaterCost ? "highlight-green" : ""}>
          {t.currentAnnualCost}: £{properties["hot_water_cost_current"]}
        </p>
        <p className={isBiggestHotWaterSavings ? "highlight-green" : ""}>
          {t.potentialAnnualCost}: £{properties["hot_water_cost_potential"]} ({t.savings}: £
          {(properties["hot_water_cost_current"] - properties["hot_water_cost_potential"]).toFixed(2)})
        </p>
        <p>{t.hotWaterDescription}: {properties["hotwater_description"]}</p>
        <p className={isHighestHotWaterEff ? "highlight-green" : ""}>
          {t.hotWaterEnergyEfficiency}: {renderStarRating(properties["hot_water_energy_eff"], t)}
        </p>
      </div>
    </div>
  );
};

export default EnergyInformation;
