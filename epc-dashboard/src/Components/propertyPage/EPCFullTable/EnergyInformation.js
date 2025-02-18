import React from "react";
import styles from "./EnergyInfo.module.css";

// Function to render star ratings based on efficiency
const renderStarRating = (efficiency) => {
  if (!efficiency || efficiency.toUpperCase() === 'NODATA!') return 'N/A ☆';

  const rating = efficiency.toLowerCase();
  switch (rating) {
    case 'very good':
      return 'Very Good ⭐⭐⭐⭐⭐';
    case 'good':
      return 'Good ⭐⭐⭐⭐';
    case 'average':
      return 'Average ⭐⭐⭐';
    case 'poor':
      return 'Poor ⭐⭐';
    case 'very poor':
      return 'Very Poor ⭐';
    default:
      return `${efficiency} ☆`;
  }
};


const EnergyInformation = ({ properties }) => {
  return (
    <div className={styles.energyInfoContainer}>
      <div className={styles.energyHeader}>Energy Information</div>

      <div className={`${styles.energyBox} ${styles.heating}`}>
        <h2>Heating</h2>
        <p>Current Annual Cost: £{properties["heating_cost_current"]}</p>
        <p>Potential Annual Cost: £{properties["heating_cost_potential"]}</p>
        <p>Main Fuel: {properties["main_fuel"]}</p>
        <p>Main Heating Controls: {properties["main_heating_controls"]} </p>
        <p>Mainheat Description: {properties["mainheat_description"]}</p>
        <p>Mainheat Energy Efficiency: {renderStarRating(properties["mainheat_energy_eff"])}</p>
        <p>Mainheat Controller Description: {properties["mainheatcont_description"]}</p>
        <p>Mainheat Controller Energy Efficiency: {renderStarRating(properties["mainheatc_energy_eff"])}</p>
      </div>

      <div className={`${styles.energyBox} ${styles.lighting}`}>
        <h2>Lighting</h2>
        <p>Current Annual Cost: £{properties["lighting_cost_current"]}</p>
        <p>Potential Annual Cost: £{properties["lighting_cost_potential"]}: </p>
        <div className="progressContainer">
          <p>Low Energy Lighting</p>
          {/* <p>Low Energy Lighting (% bar) {properties["low_energy_lighting"]}</p> */}
          <progress value={properties["low_energy_lighting"]} max={100} />
          <span>     {properties["low_energy_lighting"]}%</span>
        </div>
        <p>Lighting Description: {properties["lighting_description"]}</p>
        <p>Lighting Energy Efficiency: {renderStarRating(properties["lighting_energy_eff"])}</p>
      </div>

      <div className={`${styles.energyBox} ${styles.hotWater}`}>
        <h2>Hot Water Costs </h2>
        <p>Current Annual Cost: £{properties["hot_water_cost_current"]} </p>
        <p>Potential Annual Cost: £{properties["hot_water_cost_potential"]}</p>
        <p>Hot Water Description: {properties["hotwater_description"]}</p>
        <p>Hot Water Energy Efficiency: {renderStarRating(properties["hot_water_energy_eff"])}</p>
      </div>
    </div>
  );
};

export default EnergyInformation;