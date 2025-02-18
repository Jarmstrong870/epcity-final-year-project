import styles from "./EpcSpecificInfo.module.css";
import { energyRatingToNumber, parseNumericValue } from "../../Compare_utils/Compare_utils";
import "../../Compare_utils/HighlightedValue.css"; // Ensure correct CSS import

const EPCSpecificInformation = ({ properties, maxValues }) => {
  if (!maxValues) return null; // Prevent crash if maxValues is undefined

  // Determine highest and lowest values
  const isHighestEPCGrade = energyRatingToNumber(properties.current_energy_rating) === maxValues.maxEnergyRating;
  const isHighestEPCRating = parseNumericValue(properties.current_energy_efficiency) === maxValues.maxEnergyEfficiency;
  const isLowestConsumption = parseNumericValue(properties.energy_consumption_current) === maxValues.minEnergyConsumptionCurrent;
  const isLowestEnergyUsage = parseNumericValue(properties.energy_consumption_current * properties.total_floor_area) === maxValues.minTotalEnergyUsage;
  const isLowestEnergyCost = parseNumericValue(properties.energy_consumption_current * properties.total_floor_area * properties.cost_per_kwh) === maxValues.minTotalEnergyCost;
  
  // New Highlighting for Potential EPC
  const isHighestPotentialEPCGrade = energyRatingToNumber(properties.potential_energy_rating) === maxValues.maxPotentialEnergyRating;
  const isHighestPotentialEPCRating = parseNumericValue(properties.potential_energy_efficiency) === maxValues.maxPotentialEnergyEfficiency;

  return (
    <div className={styles.energyInfoContainer}>
      <div className={styles.energyHeader}>EPC Information</div>

      {/* EPC Rating Box */}
      <div className={styles.energyBox}>
        <h2>EPC Rating</h2>
        <p className={isHighestEPCGrade ? "highlight-green" : ""}>
          <strong>Current EPC Grade:</strong> {properties.current_energy_rating}
        </p>
        <p className={isHighestEPCRating ? "highlight-green" : ""}>
          <strong>Current EPC Rating:</strong> {properties.current_energy_efficiency}
        </p>
        <p className={isHighestPotentialEPCGrade ? "highlight-green" : ""}>
          <strong>Potential EPC Grade:</strong> {properties.potential_energy_rating}
        </p>
        <p className={isHighestPotentialEPCRating ? "highlight-green" : ""}>
          <strong>Potential EPC Rating:</strong> {properties.potential_energy_efficiency}
        </p>
        <p className={isLowestConsumption ? "highlight-green" : ""}>
          <strong>Current Energy Consumption:</strong> {properties.energy_consumption_current} KwH/m²
        </p>
        <p className={isLowestEnergyUsage ? "highlight-green" : ""}>
          <strong>Total Energy Usage:</strong> {properties.energy_consumption_current * properties.total_floor_area} KwH
        </p>
      </div>

      {/* "In This Property..." Box */}
      <div className={styles.energyBox}>
        <h2>In This Property...</h2>
        <p>If you left the heating on accidentally over the weekend it would roughly cost: {properties.heating_example_formatted}</p>
        <p>Taking a half-hour long hot shower would roughly cost: {properties.hot_water_example_formatted}</p>
        <p>Leaving the lighting on overnight would roughly cost: {properties.lighting_example_formatted}</p>
      </div>

      {/* Property Information Box */}
      <div className={styles.energyBox}>
        <h2>Property Information</h2>
        <p><strong>Built From:</strong> {properties.built_form}</p>
        <p><strong>Extension Count:</strong> {properties.extension_count}</p>
        <p><strong>Lodgement Date:</strong> {properties.lodgement_date}</p>
        <p><strong>Tenure:</strong> {properties.tenure}</p>
        <p><strong>Gas Flag:</strong> {properties.mains_gas_flag}</p>
        <p><strong>Energy Tariff:</strong> {properties.energy_tariff}</p>
      </div>
    </div>
  );
};

export default EPCSpecificInformation;
