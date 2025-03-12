import React from "react";
import styles from "./EnergyInfo.module.css";
import { efficiencyRatingToNumber } from "../../Compare_utils/Compare_utils";
import "../../Compare_utils/HighlightedValue.css";
import translations from "./locales/translations_energyinformation";
import radiatorIcon from "../../../assets/heating_icons/radiator.png";
import boilerIcon from "../../../assets/heating_icons/boiler.png";
import gasCylinderIcon from "../../../assets/heating_icons/gas cylinder.png";
import thermostatIcon from "../../../assets/heating_icons/thermostat.png";
import valveIcon from "../../../assets/heating_icons/valve.png";
import unspecifiedIcon from "../../../assets/heating_icons/unspecified.png";
import heaterIcon from "../../../assets/heating_icons/electric heater.png";
import electricIcon from "../../../assets/heating_icons/electric.png";
import heatPumpIcon from "../../../assets/heating_icons/heat pump.png"
import {mainFuelIcon} from './descriptionIcons/mainFuelIcons';
import {waterDescriptionIcon} from './descriptionIcons/hotWaterIcons';

const iconGrouping = {
  radiator: {icon: radiatorIcon, label: "Radiator"},
  boiler: {icon: boilerIcon, label: "Boiler"},
  electric: {icon: electricIcon, label: "Electric"},
  thermostat: {icon: thermostatIcon, label: "Thermostat"},
  valve: {icon: valveIcon, label: "Valve"},
  heater: {icon: heaterIcon, label: "Heater"},
  heat_pump: {icon: heatPumpIcon, label: "Heat Pump"},
  unspecified: {icon: unspecifiedIcon, label: "Unspecified"},
  gas: {icon: gasCylinderIcon, label: "Gas"},
}


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

const getHeatingIcon = (description) => {
  const icons = [];
  if(description.toLowerCase().includes("boiler")) 
    icons.push("boiler");

  if(description.toLowerCase().includes("radiators"))
    icons.push("radiator");

  if(description.toLowerCase().includes("gas"))
    icons.push("gas");

  if(description.toLowerCase().includes("electric"))
    icons.push("electric")

  if(description.toLowerCase().includes("room heaters"))
    icons.push("heater");

  if(description.toLowerCase().includes("TRVs"))
    icons.push("valve");

  if(description.toLowerCase().includes("heat pump"))
    icons.push("heat pump");

  if(description.toLowerCase().includes("thermostat"))
    icons.push("thermostat");

  return icons.length > 0 ? icons.map(icon => iconGrouping[icon]) : [iconGrouping.unspecified];
};



const EnergyInformation = ({ properties, maxValues, language }) => {
  const t = translations[language] || translations.en;
  const progressValue = properties["low_energy_lighting"];
  const progressValueColour = getProgressBarColor(progressValue);
  const hotWaterIcon = waterDescriptionIcon(properties.hotwater_description);

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

      <div className={styles.energySection}>

      {/* Heating Section */}
      <div className={`${styles.energyBox} ${styles.heating}`}>
        <h2 className={styles.sectionHeader}>{t.heating}</h2>
        
        {/* Current Costs Section */}
        <table>
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

        {/* Heating Potential Savings Section */}
          <table className="savingsSummary">
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

              <div>
                <div className={styles.visualisedDescriptions}>
                  <div className={styles.heatingIcons}>
                    <h4 className = "mainfuel">{t.mainFuel}:</h4>
                    <span>{mainFuelIcon(`${properties["main_fuel"]}`)
                      .map(({icon, label}, index) => (
                      <img key = {index} src = {icon} alt = {label} title = {label} />
                    ))}</span>
                  </div>
                </div>

              <div className={styles.efficiencyStarRatings}
                    data-value = {properties["mainheat_energy_eff"].toLowerCase()}>
                  <h4>{t.mainheatEnergyEfficiency}:</h4> 
                  <p> {/* className={isHighestMainheatEff ? "highlight-green" : ""}*/}
                    {renderStarRating(properties["mainheat_energy_eff"], t)}
                  </p>
                </div>
        
                <div className={styles.efficiencyStarRatings}
                    data-value = {properties["mainheat_energy_eff"].toLowerCase()}>
                 {/*className={isHighestMainheatControllerEff ? "highlight-green" : ""}*/}
                  <h4>{t.mainheatControllerEnergyEfficiency}: </h4>
                  <p>{renderStarRating(properties["mainheatc_energy_eff"], t)}</p>

                </div>
              </div>

              <div className={styles.iconSection}>
                <div className={styles.heatingIcons}>
                  <h4>{t.mainheatControllerEnergyEfficiency}: </h4>
                    <span>{getHeatingIcon(`${properties["mainheat_description"]} ${properties["mainheatcont_description"]}`)
                      .map(({icon, label}, index) => (
                        <img key = {index} src = {icon} alt = {label} title = {label} />
                      ))}</span>
                </div>
              </div>
          </div>      

      {/* Lighting Section */}
      <div className={`${styles.energyBox} ${styles.lighting}`}>
        <h2 className={styles.sectionHeader}>{t.lighting}</h2>

        {/* Current Costs Section */}
        <table>
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

        {/* Potential Savings Section */}
        <table className="savingsSummary">
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

      <div className={styles.visualisedDescriptions}>
        <div className={styles.progressBase}>
          <div className={styles.progressContainer}>
            <h4>{t.lowEnergyLighting}</h4>
              <progress 
                value={progressValue} max={100} style={{backgroundColor: progressValueColour}}/>
              <p>{progressValue}%</p>
          </div>
                

            <div className={styles.efficiencyStarRatings}
                data-value = {properties["lighting_energy_eff"].toLowerCase()}>
                  <h4>{t.lightingEnergyEfficiency}:</h4>
                  <p className={isHighestLightingEff ? "highlight-green" : ""}>
                    {renderStarRating(properties["lighting_energy_eff"], t)}</p>
            </div>
          </div>    
        </div>
      </div>
        
      {/* Hot Water Section */}
      <div className={`${styles.energyBox} ${styles.hotWater}`}>
        <h2 className={styles.sectionHeader}>{t.hotWaterCosts}</h2>

        {/* Current Costs Section */}
        <table>
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

      {/* Potential Savings Section */}
              <table className="savingsSummary">
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

          <div className={styles.visualisedDescriptions}>
            <div className={styles.heatingIcons}>
              <h4>{t.hotWaterDescription}:</h4>
                <span>{properties.hotwater_description}</span>
                    {hotWaterIcon.map((icon, index) => (
                    <span key = {index}>{icon}</span> 
                    ))}
              </div>

              <div className={styles.efficiencyStarRatings}
                data-value = {properties["hot_water_energy_eff"].toLowerCase()}>
                  <h4>{t.hotWaterEnergyEfficiency}:</h4>
                  <p>
                    {renderStarRating(properties["hot_water_energy_eff"], t)}</p>
                </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default EnergyInformation;
