import React from "react";
import styles from "./EnergyInfo.module.css";
import { efficiencyRatingToNumber } from "../../Compare_utils/Compare_utils";
import "../../Compare_utils/HighlightedValue.css"; // Ensure correct CSS import
import translations from "./locales/translations_energyinformation";
import radiatorIcon from "../../../assets/heating_icons/radiator.png";
import boilerIcon from "../../../assets/heating_icons/boiler.png";
import gasCylinderIcon from "../../../assets/heating_icons/gas cylinder.png";
import gasMeterIcon from "../../../assets/heating_icons/gas meter.png";
import thermostatIcon from "../../../assets/heating_icons/thermostat.png";
import valveIcon from "../../../assets/heating_icons/valve.png";

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

const getProgressBarColor = (percentage) => {

  const darkGreen = "rgb(0, 100, 0)";
  const green = "rgb(34, 139, 34)";
  const yellow = "rgb(255, 215, 0)";
  const orange = "rgb(255, 140, 0)";
  const red = "rgb(178, 34, 34)";

  if(percentage < 90)
    return green;

  if(percentage < 70)
    return yellow;

  if(percentage < 50)
    return orange;

  if(percentage < 30)
    return red;
  
  return darkGreen;
}

const EnergyInformation = ({ properties, maxValues, language }) => {
  const t = translations[language] || translations.en;
  const progressValue = properties["low_energy_lighting"];
  const progressValueColour = getProgressBarColor(progressValue);

  // Highlight conditions for costs
  const isLowestHeatingCost = properties["heating_cost_current"] === maxValues?.minHeatingCostCurrent;
  const yearlyHeatingCost = properties["heating_cost_current"];
  const monthlyHeatingCost = (yearlyHeatingCost/12).toFixed(2);
  const weeklyHeatingCost = (yearlyHeatingCost/52).toFixed(2);
  const yearlyPotentialHeatingCost = properties["heating_cost_potential"];
  const monthlyPotentialHeatingCost = (yearlyPotentialHeatingCost/12).toFixed(2);
  const weeklyPotentialHeatingCost = (yearlyPotentialHeatingCost/52).toFixed(2);  
  const isBiggestHeatingSavings =
    properties["heating_cost_current"] - properties["heating_cost_potential"] === maxValues?.maxHeatingCostSavings;

  const isLowestLightingCost = properties["lighting_cost_current"] === maxValues?.minLightingCostCurrent;
  const yearlyLightingCost = properties["lighting_cost_current"];
  const monthlyLightingCost = (yearlyLightingCost/12).toFixed(2);
  const weeklyLightingCost = (yearlyLightingCost/52).toFixed(2);  
  const yearlyPotentialLightingCost = properties["lighting_cost_potential"];
  const monthlyPotentialLightingCost = (yearlyPotentialLightingCost/12).toFixed(2);
  const weeklyPotentialLightingCost = (yearlyPotentialLightingCost/52).toFixed(2);  
  const isBiggestLightingSavings =
    properties["lighting_cost_current"] - properties["lighting_cost_potential"] === maxValues?.maxLightingCostSavings;

  const isLowestHotWaterCost = properties["hot_water_cost_current"] === maxValues?.minHotWaterCostCurrent;
  const yearlyHotWaterCost = properties["hot_water_cost_current"];
  const monthlyHotWaterCost = (yearlyHotWaterCost/12).toFixed(2);
  const weeklyHotWaterCost = (yearlyHotWaterCost/52).toFixed(2);
  const yearlyPotentialHotWaterCost = properties["hot_water_cost_potential"];
  const monthlyPotentialHotWaterCost = (yearlyPotentialHotWaterCost/12).toFixed(2);
  const weeklyPotentialHotWaterCost = (yearlyPotentialHotWaterCost/52).toFixed(2);  
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
        <h2 className={styles.sectionHeader}>{t.heating}</h2>
        
        {/* Current Costs Section */}
        <table className="heating-current-costs-table">
          <thead>
            <tr>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          
        <tbody>
          <tr>
            <td>£{weeklyHeatingCost}</td>
            <td>£{monthlyHeatingCost}</td>
            <td className={isLowestHeatingCost ? "highlight-green" : ""}> £{(properties["heating_cost_current"])} </td>
          </tr>
        </tbody>
        </table>

        {/* Potential Costs Section */}        
        <table className="heating-potential-costs-table">
          <thead>
            <tr>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          
        <tbody>
          <tr>
            <td>£{weeklyPotentialHeatingCost}</td>
            <td>£{monthlyPotentialHeatingCost}</td>
            <td className={isBiggestHeatingSavings ? "highlight-green" : ""}> £{properties["heating_cost_potential"]} </td>
          </tr>
        </tbody>
        </table>

        {/* Heating Potential Savings Section */}
        <table className="heating-savings-table">
          <thead>
            <tr>
              <th>Potential Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>£{(properties["heating_cost_current"] - properties["heating_cost_potential"]).toFixed(2)}</td>            
            </tr>
          </tbody>
        </table>

      <div className={styles.heatingSummary}>
        <div className={styles.mainFuelSection}>
          <h4>{t.mainFuel}: {properties["main_fuel"]}</h4>
          <p>{properties["main_fuel"]}</p>
          </div>

          <div className={styles.energyStarRatings}>
          <p className={isHighestMainheatEff ? "highlight-green" : ""}>
            <h4>{t.mainheatEnergyEfficiency}:</h4> 
            <p>{renderStarRating(properties["mainheat_energy_eff"], t)}</p>
          </p>

          <p className={isHighestMainheatControllerEff ? "highlight-green" : ""}>
            <h4>{t.mainheatControllerEnergyEfficiency}: </h4>
            <p>{renderStarRating(properties["mainheatc_energy_eff"], t)}</p>
          </p>

        </div>
      </div>


        <div className={styles.equipmentExamples}>
          <grid className={styles.heatingEquipmentTable}>
              <tr className={styles.heatingIcons}>
                <td><img src={radiatorIcon} alt="radiator"/></td>            
                <td><img src={boilerIcon} alt="boilder"/></td>
                <td><img src={gasCylinderIcon} alt="gas cylinder"/></td>
                <td><img src={gasMeterIcon} alt="gas meter"/></td>
                <td><img src={thermostatIcon} alt="thermostat"/></td>
                <td><img src={valveIcon} alt="valve"/></td>
              </tr>

              <tr className={styles.heatingNames}>
                <td>Radiator</td>            
                <td>Boiler</td>
                <td>Gas Cylinder</td>
                <td>Gas Meter</td>
                <td>Thermostat</td>
                <td>Valve</td>
              </tr>
          </grid>
        </div>

        {/*<tr className={styles.heatingIcons}>
                {energyIcon || controllerEnergyIcon === "radiator" && <td><img src={radiatorIcon} alt="radiator"/></td>}            
                {energyIcon || controllerEnergyIcon === "boiler" && <td><img src={boilerIcon} alt="boiler"/></td>}
                {energyIcon || controllerEnergyIcon === "programmer" && <td><img src={gasMeterIcon} alt="gas meter"/></td>}
                {energyIcon || controllerEnergyIcon === "room thermostat" && <td><img src={thermostatIcon} alt="thermostat"/></td>}
                {energyIcon || controllerEnergyIcon === "applicance thermostat" && <td><img src={thermostatIcon} alt="thermostat"/></td>}
                {energyIcon || controllerEnergyIcon === "trvs" && <td><img src={valveIcon} alt="valve"/></td>}
                {energyIcon || controllerEnergyIcon === "underfloor heating" && <td><img src={valveIcon} alt="valve"/></td>}
                {energyIcon || controllerEnergyIcon === "electric storage heaters" && <td><img src={valveIcon} alt="valve"/></td>}
                {energyIcon || controllerEnergyIcon === "manual charge control" && <td><img src={valveIcon} alt="valve"/></td>}
                {energyIcon || controllerEnergyIcon === "" && <td><img src={valveIcon} alt="valve"/></td>}
              </tr> */}

        {/*<div className={styles.equipmentExamples}>
          <p>{t.mainheatDescription}: {properties["mainheat_description"]}</p>
          <p>{t.mainheatControllerDescription}: {properties["mainheatcont_description"]}</p>
        </div>*/}

        {/*<p>{t.mainHeatingControls}: {properties["main_heating_controls"]}</p>*/}
        
        
      </div>

      {/* Lighting Section */}
      <div className={`${styles.energyBox} ${styles.lighting}`}>
        <h2 className={styles.sectionHeader}>{t.lighting}</h2>

        {/* Current Costs Section */}
        <table className="lighting-current-costs-table">
          <thead>
            <tr>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          
        <tbody>
          <tr>
            <td>£{weeklyLightingCost}</td>
            <td>£{monthlyLightingCost}</td>
            <td className={isLowestLightingCost ? "highlight-green" : ""}> £{(properties["lighting_cost_current"])} </td>
          </tr>
        </tbody>
        </table>

        {/* Potential Costs Section */}        
        <table className="lighting-potential-costs-table">
          <thead>
            <tr>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          
        <tbody>
          <tr>
            <td>£{weeklyPotentialLightingCost}</td>
            <td>£{monthlyPotentialLightingCost}</td>
            <td className={isBiggestLightingSavings ? "highlight-green" : ""}> £{properties["lighting_cost_potential"]} </td>
          </tr>
        </tbody>
        </table>

        {/* Potential Savings Section */}
        <table className="lighting-potential-savings-table">
          <thead>
            <tr>
              <th>Potential Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>£{(properties["lighting_cost_current"] - properties["lighting_cost_potential"]).toFixed(2)}</td>            
            </tr>
          </tbody>
        </table>

      <div className={styles.progressBase}>
        <div className={styles.progressContainer}>
          <h4>{t.lowEnergyLighting}</h4>
          <progress 
            value={progressValue} max={100} style={{backgroundColor: progressValueColour}}/>
          <p>{progressValue}%</p>
        </div>
        
        <p className={isHighestLightingEff ? "highlight-green" : ""}></p>
          <div className={styles.lightingStarRating}>
            <h4>{t.lightingEnergyEfficiency}:</h4>
            <p>{renderStarRating(properties["lighting_energy_eff"], t)}</p> 
          </div>
      </div>
       
        <div className={styles.progressDescription}>
        <h4>{t.lightingDescription}</h4>
          <p>{properties["lighting_description"]}</p>
        </div>

      </div>
 
      {/* Hot Water Section */}
      <div className={`${styles.energyBox} ${styles.hotWater}`}>
        <h2 className={styles.sectionHeader}>{t.hotWaterCosts}</h2>

        {/* Current Costs Section */}
        <table className="hot-water-current-costs-table">
          <thead>
            <tr>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          
        <tbody>
          <tr>
            <td>£{weeklyHotWaterCost}</td>
            <td>£{monthlyHotWaterCost}</td>
            <td className={isLowestHotWaterCost ? "highlight-green" : ""}> £{properties["hot_water_cost_current"]} </td>
          </tr>
        </tbody>
        </table>

        {/* Potential Costs Section */}        
        <table className="hot-water-potential-costs-table">
          <thead>
            <tr>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          
        <tbody>
          <tr>
            <td>£{weeklyPotentialHotWaterCost}</td>
            <td>£{monthlyPotentialHotWaterCost}</td>
            <td className={isBiggestHotWaterSavings ? "highlight-green" : ""}> £{properties["hot_water_cost_potential"]} </td>
          </tr>
        </tbody>
        </table>

        {/* Potential Savings Section */}
        <table className="hot-water-potential-savings-table">
          <thead>
            <tr>
              <th>Potential Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>£{(properties["hot_water_cost_current"] - properties["hot_water_cost_potential"]).toFixed(2)}</td>            
            </tr>
          </tbody>
        </table>

    <div className={styles.hotWaterSummary}>
      <div className={styles.hotWaterDescriptionsSection}>
        <h4>{t.hotWaterDescription}:</h4>
        <p> {properties["hotwater_description"]}</p>
      </div>

        <p className={isHighestHotWaterEff ? "highlight-green" : ""}>
          <div className={styles.hotWaterStarRating}>
            <h4>{t.hotWaterEnergyEfficiency}:</h4>
            <p>{renderStarRating(properties["hot_water_energy_eff"], t)}</p>
          </div>
        </p>
      </div>
      </div>
    </div>
  );
};

export default EnergyInformation;
