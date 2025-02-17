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
        <p className={isLowestConsumption ? "highlight-green" : ""}>
          <strong>Current Energy Consumption:</strong> {properties.energy_consumption_current} KWh/m²
        </p>
        <p className={isLowestEnergyUsage ? "highlight-green" : ""}>
          <strong>Total Energy Usage:</strong> {properties.energy_consumption_current * properties.total_floor_area}
        </p>
        <p className={isLowestEnergyCost ? "highlight-green" : ""}>
          <strong>Total Energy Cost:</strong> £{(properties.energy_consumption_current * properties.total_floor_area * properties.cost_per_kwh).toFixed(2)}
        </p>
      </div>

      {/* Yearly Costs Box */}
      <div className={styles.energyBox}>
        <h2>Yearly Costs</h2>
        <p>
          <strong>Yearly Cost:</strong> {properties.energy_consumption_cost_formatted}
        </p>
      </div>

      {/* Property Information Box */}
      <div className={styles.energyBox}>
        <h2>Property Information</h2>
        <p><strong>Built From:</strong> {properties.built_form}</p>
        <p><strong>Extension Count:</strong> {properties.extension_count}</p>
        <p><strong>Lodgement Date:</strong> {properties.logdement_date}</p>
        <p><strong>Tenure:</strong> {properties.tenure}</p>
        <p><strong>Gas Flag:</strong> {properties.tenure}</p>
        <p><strong>Energy Tariff:</strong> {properties.energy_tariff}</p>
      </div>
    </div>
  );
};

export default EPCSpecificInformation;
