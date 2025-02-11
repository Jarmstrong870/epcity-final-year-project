/**
 * Utility functions for property comparison calculations.
 */

/**
 * Convert energy ratings (A-G) into numerical values for ranking.
 *
 * @param {string} rating - The energy rating letter (A-G).
 * @returns {number} - The numerical representation of the rating.
 */
export const energyRatingToNumber = (rating) => {
    const ratingScale = { "A": 7, "B": 6, "C": 5, "D": 4, "E": 3, "F": 2, "G": 1 };
    return ratingScale[rating] || 0; // Default to 0 if not found
  };
  
  /**
   * Convert energy efficiency rating descriptions into a ranking system.
   *
   * @param {string} efficiency - The efficiency description.
   * @returns {number} - A numerical value representing the ranking.
   */
  export const efficiencyRatingToNumber = (efficiency) => {
    const efficiencyScale = { "Very Good": 5, "Good": 4, "Average": 3, "Poor": 2, "Very Poor": 1 };
    return efficiencyScale[efficiency] || 0; // Default to 0 if not found
  };
  
  /**
   * Parse numeric values from strings, handling cases with currency symbols.
   *
   * @param {string | number} value - The value to parse.
   * @returns {number} - The numeric representation of the value.
   */
  export const parseNumericValue = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
      return isNaN(numeric) ? 0 : numeric;
    }
    return 0;
  };
  
  /**
   * Find the maximum and minimum values for energy ratings, efficiency, and costs.
   *
   * @param {Array} properties - List of property objects.
   * @returns {Object} - Object containing the max/min values for key metrics.
   */
  export const findMaxValues = (properties) => {
    const maxEnergyRating = Math.max(...properties.map((p) => energyRatingToNumber(p.current_energy_rating)));
    const maxEnergyEfficiency = Math.max(...properties.map((p) => parseNumericValue(p.current_energy_efficiency)));
  
    // ✅ NEW: Find highest ranked Energy Efficiency Descriptions
    const maxHotWaterEfficiency = Math.max(...properties.map((p) => efficiencyRatingToNumber(p.hot_water_energy_eff)));
    const maxFloorEfficiency = Math.max(...properties.map((p) => efficiencyRatingToNumber(p.floor_energy_eff)));
    const maxWindowsEfficiency = Math.max(...properties.map((p) => efficiencyRatingToNumber(p.windows_energy_eff)));
    const maxWallsEfficiency = Math.max(...properties.map((p) => efficiencyRatingToNumber(p.walls_energy_eff)));
    const maxMainHeatEfficiency = Math.max(...properties.map((p) => efficiencyRatingToNumber(p.mainheat_energy_eff)));
    const maxMainHeatcEfficiency = Math.max(...properties.map((p) => efficiencyRatingToNumber(p.mainheatc_energy_eff)));
    const maxLightingEfficiency = Math.max(...properties.map((p) => efficiencyRatingToNumber(p.lighting_energy_eff)));
  
    const maxPotentialEnergyRating = Math.max(...properties.map((p) => energyRatingToNumber(p.potential_energy_rating)));
    const maxPotentialEnergyEfficiency = Math.max(...properties.map((p) => parseNumericValue(p.potential_energy_efficiency)));
  
    const minEnergyConsumptionCurrent = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_current)));
    const minEnergyConsumptionPotential = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_potential)));
  
    const minLightingCostCurrent = Math.min(...properties.map((p) => parseNumericValue(p.lighting_cost_current)));
    const minLightingCostPotential = Math.min(...properties.map((p) => parseNumericValue(p.lighting_cost_potential)));
    const minHeatingCostCurrent = Math.min(...properties.map((p) => parseNumericValue(p.heating_cost_current)));
    const minHeatingCostPotential = Math.min(...properties.map((p) => parseNumericValue(p.heating_cost_potential)));
  
    const minHotWaterCostCurrent = Math.min(...properties.map((p) => parseNumericValue(p.hot_water_cost_current)));
    const minHotWaterCostPotential = Math.min(...properties.map((p) => parseNumericValue(p.hot_water_cost_potential)));
  
    return {
      maxEnergyRating,
      maxEnergyEfficiency,
      maxPotentialEnergyRating,
      maxPotentialEnergyEfficiency,
      minEnergyConsumptionCurrent,
      minEnergyConsumptionPotential,
      minLightingCostCurrent,
      minLightingCostPotential,
      minHeatingCostCurrent,
      minHeatingCostPotential,
      minHotWaterCostCurrent,
      minHotWaterCostPotential,
      maxHotWaterEfficiency, //   Best hot water energy efficiency ranking
      maxFloorEfficiency,    //  Best floor energy efficiency ranking
      maxWindowsEfficiency,  //  Best windows energy efficiency ranking
      maxWallsEfficiency,    //  Best walls energy efficiency ranking
      maxMainHeatEfficiency, //  Best mainheat energy efficiency ranking
      maxMainHeatcEfficiency, //  Best mainheatc energy efficiency ranking
      maxLightingEfficiency, //  Best lighting energy efficiency ranking
    };
  };
  