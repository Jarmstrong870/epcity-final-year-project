import React from "react";
import styles from "./EnergyInfo.module.css"; 


const EnergyInformation = ({ properties}) => {
    return (
        <div className={styles.energyInfoContainer}>
          <div className={styles.energyHeader}>Energy Information</div>
          
          <div className={`${styles.energyBox} ${styles.heating}`}>
            <h2>Heating</h2>
            <p>Cost(annual) Current/potential</p>
            <p>Cost(real world example)</p>
            <p>Main Fuel</p>
            <p>Main Heating Controls</p>
            <p>Mainheat Description</p>
            <p>Mainheat Energy Efficiency (⭐)</p>
            <p>Mainheat Controller Description</p>
            <p>Mainheat Controller Energy Efficiency (⭐)</p>
          </div>
    
          <div className={`${styles.energyBox} ${styles.lighting}`}>
            <h2>Lighting</h2>
            <p>Cost(annual) Current/potential</p>
            <p>Cost(real world example)</p>
            <p>Low Energy Lighting (% bar)</p>
            <p>Lighting Description</p>
            <p>Lighting Energy Efficiency (⭐)</p>
          </div>
    
          <div className={`${styles.energyBox} ${styles.hotWater}`}>
            <h2>Hot Water Costs</h2>
            <p>Hot water</p>
            <p>Cost(annual) Current/potential</p>
            <p>Cost(real world example)</p>
            <p>Hot Water Description</p>
            <p>Hot Water Energy Efficiency (stars)</p>
          </div>
        </div>
      );
};

export default EnergyInformation;