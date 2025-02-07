import React from "react";
import styles from "./EnergyInfo.module.css"; 


const EnergyInformation = ({ properties}) => {
    return (
        <div className={styles.energyInfoContainer}>
          <div className={styles.energyHeader}>Energy Information</div>
          
          <div className={`${styles.energyBox} ${styles.heating}`}>
            <h2>Heating</h2>
            <p>Heating Current Cost: £{properties["heating_cost_current"]}</p>
            <p>Heating Potential Cost: £{properties["heating_cost_potential"]}</p>
            <p>Cost(real world example)</p>
            <p>Main Fuel: {properties["main_fuel"]}</p>
            <p>Main Heating Controls: {properties["main_heating_controls"]} </p>
            <p>Mainheat Description: {properties["mainheat_description"]}</p>
            <p>Mainheat Energy Efficiency: star graphic(⭐)</p>
            <p>Mainheat Controller Description: {properties["mainheatcont_description"]}</p>
            <p>Mainheat Controller Energy Efficiency: star graphic(⭐)</p>
          </div>
    
          <div className={`${styles.energyBox} ${styles.lighting}`}>
            <h2>Lighting</h2>
            <p>Lighting Current Cost: £{properties["lighting_cost_current"]}</p>
            <p>Lighting Potential Cost: £{properties["lighting_cost_potential"]}: </p>
            <p>Low Energy Lighting (% bar) {properties["low_energy_lighting"]}</p>
            <p>Lighting Description: {properties["lighting_description"]}</p>
            <p>Lighting Energy Efficiency: {properties["lighting_energy_eff"]} (⭐)</p>
          </div>
    
          <div className={`${styles.energyBox} ${styles.hotWater}`}>
            <h2>Hot Water Costs </h2>
            <p>Hot water current Cost: £{properties["hot_water_cost_current"]} </p>
            <p>Hot Water Potential Cost: £{properties["hot_water_cost_potential"]}</p>
            <p>Cost(real world example)</p>
            <p>Hot Water Description: {properties["hotwater_description"]}</p>
            <p>Hot Water Energy Efficiency (stars) {properties["hot_water_energy_eff"]}</p>
          </div>
        </div>
      );
};

export default EnergyInformation;