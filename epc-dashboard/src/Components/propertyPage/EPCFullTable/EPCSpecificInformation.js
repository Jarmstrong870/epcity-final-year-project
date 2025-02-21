import styles from "./EpcSpecificInfo.module.css";
import { energyRatingToNumber, parseNumericValue } from "../../Compare_utils/Compare_utils";
import "../../Compare_utils/HighlightedValue.css";
import translations from "./locales/translations_epcspecificinfo"; 

const EPCSpecificInformation = ({ properties, maxValues, language }) => {
  if (!maxValues) return null;

  const t = translations[language] || translations.en;

  // Determine highest and lowest values
  const isHighestEPCGrade = energyRatingToNumber(properties.current_energy_rating) === maxValues.maxEnergyRating;
  const isHighestEPCRating = parseNumericValue(properties.current_energy_efficiency) === maxValues.maxEnergyEfficiency;
  const isLowestConsumption = parseNumericValue(properties.energy_consumption_current) === maxValues.minEnergyConsumptionCurrent;
  const isLowestEnergyUsage = parseNumericValue(properties.energy_consumption_current * properties.total_floor_area) === maxValues.minTotalEnergyUsage;
  const isLowestEnergyCost = parseNumericValue(properties.energy_consumption_current * properties.total_floor_area * properties.cost_per_kwh) === maxValues.minTotalEnergyCost;
  
  const isHighestPotentialEPCGrade = energyRatingToNumber(properties.potential_energy_rating) === maxValues.maxPotentialEnergyRating;
  const isHighestPotentialEPCRating = parseNumericValue(properties.potential_energy_efficiency) === maxValues.maxPotentialEnergyEfficiency;

  return (
    <div className={styles.energyInfoContainer}>
      <div className={styles.energyHeader}>{t.headers.epcInformation}</div>

      {/* EPC Rating Box */}
      <div className={styles.energyBox}>
        <h2>{t.headers.epcRating}</h2>
        <p className={isHighestEPCGrade ? "highlight-green" : ""}>
          <strong>{t.headers.currentEPCGrade}:</strong> {properties.current_energy_rating}
        </p>
        <p className={isHighestEPCRating ? "highlight-green" : ""}>
          <strong>{t.headers.currentEPCRating}:</strong> {properties.current_energy_efficiency}
        </p>
        <p className={isHighestPotentialEPCGrade ? "highlight-green" : ""}>
          <strong>{t.headers.potentialEPCGrade}:</strong> {properties.potential_energy_rating}
        </p>
        <p className={isHighestPotentialEPCRating ? "highlight-green" : ""}>
          <strong>{t.headers.potentialEPCRating}:</strong> {properties.potential_energy_efficiency}
        </p>
        <p className={isLowestConsumption ? "highlight-green" : ""}>
          <strong>{t.headers.currentEnergyConsumption}:</strong> {properties.energy_consumption_current} KwH/m²
        </p>
        <p className={isLowestEnergyUsage ? "highlight-green" : ""}>
          <strong>{t.headers.totalEnergyUsage}:</strong> {properties.energy_consumption_current * properties.total_floor_area} KwH
        </p>
      </div>

      {/* "In This Property..." Box */}
      <div className={styles.energyBox}>
        <h2>{t.headers.inThisProperty}</h2>
        <p>{t.headers.heatingExample}: {properties.heating_example_formatted}</p>
        <p>{t.headers.showerExample}: {properties.hot_water_example_formatted}</p>
        <p>{t.headers.lightingExample}: {properties.lighting_example_formatted}</p>
      </div>

      {/* Property Information Box */}
      <div className={styles.energyBox}>
        <h2>{t.headers.propertyInformation}</h2>
        <p><strong>{t.headers.builtForm}:</strong> {properties.built_form}</p>
        <p><strong>{t.headers.extensionCount}:</strong> {properties.extension_count}</p>
        <p><strong>{t.headers.lodgementDate}:</strong> {properties.lodgement_date}</p>
        <p><strong>{t.headers.tenure}:</strong> {properties.tenure}</p>
        <p><strong>{t.headers.gasFlag}:</strong> {properties.mains_gas_flag}</p>
        <p><strong>{t.headers.energyTariff}:</strong> {properties.energy_tariff}</p>
      </div>
    </div>
  );
};

export default EPCSpecificInformation;
