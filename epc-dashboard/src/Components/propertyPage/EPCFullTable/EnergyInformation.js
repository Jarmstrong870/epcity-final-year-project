
import React, { useEffect, useState } from "react";
import styles from "./EnergyInfo.module.css";
import { Link } from 'react-router-dom';
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
import programmerIcon from "../../../assets/heating_icons/programmer.png";
import RankingCard from "./RankingCard";
import { mainFuelIcon } from "./descriptionIcons/mainFuelIcons";
import { waterDescriptionIcon } from "./descriptionIcons/hotWaterIcons";
import { fetchGraphData } from "../propertyUtils";

const iconGrouping = {
  radiator: { icon: radiatorIcon, label: "Radiator" },
  boiler: { icon: boilerIcon, label: "Boiler" },
  electric: { icon: electricIcon, label: "Electric" },
  thermostat: { icon: thermostatIcon, label: "Thermostat" },
  valve: { icon: valveIcon, label: "Thermostatic Radiator Valves" },
  heater: { icon: heaterIcon, label: "Electric Radiators" },
  unspecified: { icon: unspecifiedIcon, label: "Unspecified" },
  gas: { icon: gasCylinderIcon, label: "Gas" },
  programmer: { icon: programmerIcon, label: "Programmer" },
};

const renderStarRating = (efficiency, t) => {
  if (!efficiency || efficiency.toUpperCase() === "NODATA!") return t.na;
  const rating = efficiency.toLowerCase();
  switch (rating) {
    case "very good":
      return `${t.veryGood} ⭐⭐⭐⭐⭐`;
    case "good":
      return `${t.good} ⭐⭐⭐⭐`;
    case "average":
      return `${t.average} ⭐⭐⭐`;
    case "poor":
      return `${t.poor} ⭐⭐`;
    case "very poor":
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

  if (percentage < 90) return green;
  if (percentage < 70) return yellow;
  if (percentage < 50) return orange;
  if (percentage < 30) return red;
  return darkGreen;
};

const getHeatingIcon = (description) => {
  if (!description) {
    return [{ icon: unspecifiedIcon, label: "Unknown" }];
  }
  // Convert to lowercase and take everything before the first comma
  const mainPart = description.toLowerCase().split(",")[0].trim();
  const icons = [];
  if (mainPart.includes("boiler")) icons.push("boiler");
  if (mainPart.includes("radiator")) icons.push("radiator");
  if (mainPart.includes("gas")) icons.push("gas");
  if (mainPart.includes("electric ")) icons.push("electric");
  if (mainPart.includes("room heaters")) icons.push("heater");
  if (mainPart.includes("trvs")) icons.push("valve");
  if (mainPart.includes("thermostat")) icons.push("thermostat");
  return icons.length > 0
    ? icons.map((iconKey) => iconGrouping[iconKey])
    : [
        {
          icon: unspecifiedIcon,
          label: description.trim(),
        },
      ];
};

const getHeatingIconCont = (description) => {
  if (!description) {
    return [
      {
        icon: unspecifiedIcon,
        label: "Unknown",
      },
    ];
  }
  const lowerDesc = description.toLowerCase().trim();
  const icons = [];
  if (lowerDesc.includes("boiler")) icons.push("boiler");
  if (lowerDesc.includes("radiator")) icons.push("radiator");
  if (lowerDesc.includes("gas")) icons.push("gas");
  if (lowerDesc.includes("electric")) icons.push("electric");
  if (lowerDesc.includes("room heaters")) icons.push("heater");
  if (lowerDesc.includes("trvs")) icons.push("valve");
  if (lowerDesc.includes("thermostat")) icons.push("thermostat");
  if (lowerDesc.includes("programmer")) icons.push("programmer");
  return icons.length > 0
    ? icons.map((iconKey) => iconGrouping[iconKey])
    : [
        {
          icon: unspecifiedIcon,
          label: description.trim(),
        },
      ];
};

const EnergyInformation = ({ properties, maxValues, language }) => {
  const t = translations[language] || translations.en;
  const progressValue = properties["low_energy_lighting"];
  const progressValueColour = getProgressBarColor(progressValue);
  const hotWaterIcon = waterDescriptionIcon(properties.hotwater_description);
  const [graphData, setGraphData1] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  

  useEffect(() => {
          if (properties) {
              fetchGraphData(properties.number_bedrooms, properties.postcode, setGraphData1, setErrorMessage);
          }
      }, [properties.number_bedrooms, properties.postcode]);
      console.log("graph data", graphData)

      const chartData = graphData.map((prop) => ({
        uprn: prop.uprn, // Unique identifier
        Heating: prop.heating_cost_current,
        "Hot Water": prop.hot_water_cost_current,
        Lighting: prop.lighting_cost_current,
        "Total Floor Area": prop.total_floor_area,
      }));
  
      const computeRank = (metric) => {
        if (!chartData || chartData.length === 0) return null;
        let sorted;
        if (metric === "Total Floor Area") {
          // For floor area, higher is better so sort in descending order
          sorted = [...chartData].sort((a, b) => b[metric] - a[metric]);
        } else {
          // For other metrics, lower is better so sort in ascending order
          sorted = [...chartData].sort((a, b) => a[metric] - b[metric]);
        }
        const rank = sorted.findIndex((item) => item.uprn === properties.uprn) + 1;
        return { rank, total: sorted.length };
      };
      

      const heatingRankData = computeRank("Heating");
      const hotWaterRankData = computeRank("Hot Water");
      const lightingRankData = computeRank("Lighting");
      const totalFloorAreaRankData = computeRank("Total Floor Area");

  

  

  // Heating cost calculations
  const isLowestHeatingCost =
    properties["heating_cost_current"] === maxValues?.minHeatingCostCurrent;
  const yearlyHeatingCost = properties["heating_cost_current"];
  const monthlyHeatingCost = (yearlyHeatingCost / 12).toFixed(2);
  const weeklyHeatingCost = (yearlyHeatingCost / 52).toFixed(2);
  const yearlyPotentialHeatingCost = properties["heating_cost_potential"];
  const monthlyPotentialHeatingCost = (yearlyPotentialHeatingCost / 12).toFixed(2);
  const weeklyPotentialHeatingCost = (yearlyPotentialHeatingCost / 52).toFixed(2);
  const isBiggestHeatingSavings =
    properties["heating_cost_current"] - properties["heating_cost_potential"] ===
    maxValues?.maxHeatingCostSavings;
  const bedrooms = properties["number_bedrooms"] || 1;
  const weeklyPerPersonCost = (weeklyHeatingCost / bedrooms).toFixed(2);
  const monthlyPerPersonCost = (monthlyHeatingCost / bedrooms).toFixed(2);
  const yearlyPerPersonCost = (yearlyHeatingCost / bedrooms).toFixed(2);

  // Lighting cost calculations
  const isLowestLightingCost =
    properties["lighting_cost_current"] === maxValues?.minLightingCostCurrent;
  const yearlyLightingCost = properties["lighting_cost_current"];
  const monthlyLightingCost = (yearlyLightingCost / 12).toFixed(2);
  const weeklyLightingCost = (yearlyLightingCost / 52).toFixed(2);
  const weeklyLightingCostPerPerson = (weeklyLightingCost / bedrooms).toFixed(2);
  const monthlyLightingCostPerPerson = (monthlyLightingCost / bedrooms).toFixed(2);
  const yearlyLightingCostPerPerson = (yearlyLightingCost / bedrooms).toFixed(2);

  // Hot Water cost calculations
  const isLowestHotWaterCost =
    properties["hot_water_cost_current"] === maxValues?.minHotWaterCostCurrent;
  const yearlyHotWaterCost = properties["hot_water_cost_current"];
  const monthlyHotWaterCost = (yearlyHotWaterCost / 12).toFixed(2);
  const weeklyHotWaterCost = (yearlyHotWaterCost / 52).toFixed(2);
  const weeklyHotWaterCostPerPerson = (weeklyHotWaterCost / bedrooms).toFixed(2);
  const monthlyHotWaterCostPerPerson = (monthlyHotWaterCost / bedrooms).toFixed(2);
  const yearlyHotWaterCostPerPerson = (yearlyHotWaterCost / bedrooms).toFixed(2);

  // Key Insights
    const billsPerSquareMeter = (yearlyHeatingCost+yearlyHotWaterCost+yearlyLightingCost) / parseInt(properties.total_floor_area);
    const areaPerPerson = properties.total_floor_area / properties.number_bedrooms;
    const areaLabel = getAreaRating(areaPerPerson);

    function getAreaRating(areaValue) {
      if (areaValue < 15) return "Very Poor";
      if (areaValue < 20) return "Poor";
      if (areaValue < 25) return "Average";
      if (areaValue < 30) return "Good";
      return "Very Good";
    }

    function getBillsRating(bills) {
      // These thresholds are examples – adjust them based on your market data:
      if (bills < 10.0) return "Very Good";
      if (bills < 15.0) return "Good";
      if (bills < 29.0) return "Average";
      if (bills < 25.0) return "Poor";
      return "Very Poor";
    }
    


  

  // Star rating conditions
  const isHighestMainheatEff =
    efficiencyRatingToNumber(properties["mainheat_energy_eff"]) ===
    maxValues?.maxMainheatEnergyEff;
  const isHighestMainheatControllerEff =
    efficiencyRatingToNumber(properties["mainheatc_energy_eff"]) ===
    maxValues?.maxMainheatControllerEff;
  const isHighestLightingEff =
    efficiencyRatingToNumber(properties["lighting_energy_eff"]) ===
    maxValues?.maxLightingEnergyEff;
  const isHighestHotWaterEff =
    efficiencyRatingToNumber(properties["hot_water_energy_eff"]) ===
    maxValues?.maxHotWaterEnergyEff;

  
    return (
      <div className={styles.EnergyInfo_energyInfoContainer}>
        <div className={styles.EnergyInfo_energyHeader}>{t.energyInformation}</div>
  
        {/* Main Grid Section */}
        <div className={styles.EnergyInfo_energySection}>
  
          {/* LEFT COLUMN (Heating), spans two rows */}
          <div className={styles.EnergyInfo_leftColumn}>
            {/* === Heating Section === */}
            <div className={`${styles.EnergyInfo_energyBox} ${styles.heating}`}>
              <h2 className={styles.EnergyInfo_sectionHeader}>{t.heating}</h2>
  
              {/* Heating Table */}
              <table className={styles.EnergyInfo_costTable}>
                <thead>
                  <tr>
                    <th>{t.timePeriod}</th>
                    <th>{t.propertyCost}</th>
                    <th>{t.costPerPerson}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t.weekly}</td>
                    <td>£{weeklyHeatingCost}</td>
                    <td>£{weeklyPerPersonCost}</td>
                  </tr>
                  <tr>
                    <td>{t.monthly}</td>
                    <td>£{monthlyHeatingCost}</td>
                    <td>£{monthlyPerPersonCost}</td>
                  </tr>
                  <tr>
                    <td>{t.yearly}</td>
                    <td>£{yearlyHeatingCost}</td>
                    <td>£{yearlyPerPersonCost}</td>
                  </tr>
                </tbody>
              </table>
  
              {/* Key Info (Fuel, Gas Flag, CO2) */}
              <div className={styles.EnergyInfo_visualisedDescriptions}>
                <div className={styles.EnergyInfo_keyInfoRow}>
  
                  {/* Main Fuel */}
                  <div className={styles.EnergyInfo_keyInfoItem}>
                    <h4>{t.mainFuel}</h4>
                    <p>{properties.main_fuel}</p>
                    <div className={styles.EnergyInfo_keyIconsRow}>
                      {mainFuelIcon(properties["main_fuel"]).map(({ icon, label }, idx) => (
                        <div key={idx} className={styles.EnergyInfo_iconItem}>
                          <img src={icon} alt={label} title={label} />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className={styles.EnergyInfo_divider}></div>
  
                  {/* Mains Gas Flag */}
                  <div className={styles.EnergyInfo_keyInfoItem}>
                    <h4>{t.isGasConnected}</h4>
                    <p>{properties.mains_gas_flag === "Y" ? t.yes : t.no}</p>
                  </div>
  
                  <div className={styles.EnergyInfo_divider}></div>
  
                  {/* CO₂ Emissions Current */}
                  <div className={styles.EnergyInfo_keyInfoItem}>
                    <h4>{t.co2Emissions}</h4>
                    <p>{properties.co2_emissions_current} {t.co2TonsPerYear}</p>
                  </div>
                </div>
              </div>
  
              {/* Efficiency Star Ratings */}
              <div
                className={styles.EnergyInfo_efficiencyStarRatings}
                data-value={properties["mainheat_energy_eff"].toLowerCase()}
              >
                <h4>{t.mainheatEnergyEfficiency}:</h4>
                <p>{renderStarRating(properties["mainheat_energy_eff"], t)}</p>
              </div>
  
              <div
                className={styles.EnergyInfo_efficiencyStarRatings}
                data-value={properties["mainheatc_energy_eff"].toLowerCase()}
              >
                <h4>{t.mainheatControllerEnergyEfficiency}:</h4>
                <p>{renderStarRating(properties["mainheatc_energy_eff"], t)}</p>
              </div>
  
              {/* Heating Sources & Controls */}
              <div className={styles.EnergyInfo_iconSection}>
                {/* Main Heating Sources */}
                <div className={styles.EnergyInfo_heatingIcons}>
                  <h4>{t.mainHeatingSources}</h4>
                  <div className={styles.EnergyInfo_iconsRow}>
                    {getHeatingIcon(properties["mainheat_description"]).map(({ icon, label }, idx) => (
                      <div key={idx} className={styles.EnergyInfo_iconWithLabel}>
                        <img src={icon} alt={label} title={label} />
                        <p>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Extra Heating Controls */}
                <div className={styles.EnergyInfo_heatingIcons}>
                  <h4>{t.extraHeatingControls}</h4>
                  <div className={styles.EnergyInfo_iconsRow}>
                    {getHeatingIconCont(properties["mainheatcont_description"]).map(({ icon, label }, idx) => (
                      <div key={idx} className={styles.EnergyInfo_iconWithLabel}>
                        <img src={icon} alt={label} title={label} />
                        <p>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* MIDDLE COLUMN (Lighting), row 1 only */}
          <div className={styles.EnergyInfo_middleColumn}>
            <div className={`${styles.EnergyInfo_energyBox} ${styles.lighting}`}>
              <h2 className={styles.EnergyInfo_sectionHeader}>{t.lighting}</h2>
  
              {/* Lighting Table */}
              <table className={styles.EnergyInfo_costTable}>
                <thead>
                  <tr>
                    <th>{t.timePeriod}</th>
                    <th>{t.propertyCost}</th>
                    <th>{t.costPerPerson}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t.weekly}</td>
                    <td>£{weeklyLightingCost}</td>
                    <td>£{weeklyLightingCostPerPerson}</td>
                  </tr>
                  <tr>
                    <td>{t.monthly}</td>
                    <td>£{monthlyLightingCost}</td>
                    <td>£{monthlyLightingCostPerPerson}</td>
                  </tr>
                  <tr>
                    <td>{t.yearly}</td>
                    <td>£{yearlyLightingCost}</td>
                    <td>£{yearlyLightingCostPerPerson}</td>
                  </tr>
                </tbody>
              </table>
  
              {/* Lighting Progress & Star Ratings */}
              <div className={styles.EnergyInfo_visualisedDescriptions}>
                
                  <div className={styles.EnergyInfo_progressContainer}>
                    <h4>{t.lowEnergyLighting}</h4>
                    <progress
                      value={progressValue}
                      max={100}
                      style={{ backgroundColor: progressValueColour }}
                    />
                    <p>{progressValue}%</p>
                  </div>
  
                  <div
                    className={styles.EnergyInfo_efficiencyStarRatings}
                    data-value={properties["lighting_energy_eff"].toLowerCase()}
                  >
                    <h4>{t.lightingEnergyEfficiency}:</h4>
                    <p className={isHighestLightingEff ? "highlight-green" : ""}>
                      {renderStarRating(properties["lighting_energy_eff"], t)}
                    </p>
                  </div>
                
              </div>
            </div>
          </div>
  
          {/* RIGHT COLUMN (Hot Water), row 1 only */}
          <div className={styles.EnergyInfo_rightColumn}>
            <div className={`${styles.EnergyInfo_energyBox} ${styles.hotWater}`}>
              <h2 className={styles.EnergyInfo_sectionHeader}>{t.hotWaterCosts}</h2>
  
              {/* Hot Water Table */}
              <table className={styles.EnergyInfo_costTable}>
                <thead>
                  <tr>
                    <th>{t.timePeriod}</th>
                    <th>{t.propertyCost}</th>
                    <th>{t.costPerPerson}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t.weekly}</td>
                    <td>£{weeklyHotWaterCost}</td>
                    <td>£{weeklyHotWaterCostPerPerson}</td>
                  </tr>
                  <tr>
                    <td>{t.monthly}</td>
                    <td>£{monthlyHotWaterCost}</td>
                    <td>£{monthlyHotWaterCostPerPerson}</td>
                  </tr>
                  <tr>
                    <td>{t.yearly}</td>
                    <td>£{yearlyHotWaterCost}</td>
                    <td>£{yearlyHotWaterCostPerPerson}</td>
                  </tr>
                </tbody>
              </table>
  
              {/* Hot Water Efficiency */}
              <div className={styles.EnergyInfo_visualisedDescriptions}>
              <div className={styles.EnergyInfo_progressContainer}>
                <h4>{t.hotWaterHeatingSystem}</h4>
                <p>{properties["hotwater_description"]}</p>
              </div>
              <div
                className={styles.EnergyInfo_efficiencyStarRatingsWater}
                data-value={properties["hot_water_energy_eff"].toLowerCase()}
              >
                <h4>{t.hotWaterEnergyEfficiency}:</h4>
                <p>{renderStarRating(properties["hot_water_energy_eff"], t)}</p>
              </div>
              </div>
            </div>
          </div>
  
          {/* KEY INSIGHTS (optional) - row 2 columns 2 & 3 */}
          <div className={styles.EnergyInfo_keyInsights}>
            <div className={styles.KeyInsights_container}>
              <div className={styles.KeyInsights_twoColumn}>
  
                {/* LEFT COLUMN: Title + Insight Boxes */}
                <div className={styles.KeyInsights_left}>
                  <h2 className={styles.KeyInsights_header}>{t.keyInsights}</h2>
  
                  <div className={styles.KeyInsightCard}>
                    <h4>{t.billsPerSquareMeter}</h4>
                    <p>£{billsPerSquareMeter.toFixed(2)}/m²</p>
                    <span className={styles.insightRating}>{getBillsRating(billsPerSquareMeter)}</span>
                  </div>
  
                  <div className={styles.KeyInsightCard}>
                    <h4>{t.totalEstimatedBills}</h4>
                    <p>£{(yearlyHeatingCost + yearlyHotWaterCost + yearlyLightingCost).toFixed(2)}/yr</p>
                  </div>
  
                  <div className={styles.KeyInsightCard}>
                    <h4>{t.areaPerPerson}</h4>
                    <p>{(properties.total_floor_area / properties.number_bedrooms).toFixed(1)} m²/bedroom</p>
                    <span className={styles.insightRating}>{areaLabel}</span>
                  </div>
                </div>
  
                {/* RIGHT COLUMN: Ranking Cards (stacked vertically) */}
                <div className={styles.KeyInsights_right}>
                  {heatingRankData ? (
                    <RankingCard title={t.heatingRank} metricName="Heating" rankData={heatingRankData} />
                  ) : (
                    <p>{t.loadingRanking}</p>
                  )}
  
                  {hotWaterRankData ? (
                    <RankingCard title={t.hotWaterRank} metricName="Hot Water" rankData={hotWaterRankData} />
                  ) : (
                    <p>{t.loadingRanking}</p>
                  )}
  
                  {lightingRankData ? (
                    <RankingCard title={t.lightingRank} metricName="Lighting" rankData={lightingRankData} />
                  ) : (
                    <p>{t.loadingRanking}</p>
                  )}
  
                  {totalFloorAreaRankData ? (
                    <RankingCard title={t.totalFloorAreaRank} metricName="Total Floor Area" rankData={totalFloorAreaRankData} />
                  ) : (
                    <p>{t.loadingRanking}</p>
                  )}
                </div>
  
              </div>
            </div>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default EnergyInformation;
