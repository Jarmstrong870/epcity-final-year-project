/**
 * Convert energy ratings (A-G) into numerical values for ranking.
 */
export const energyRatingToNumber = (rating) => {
  const ratingScale = { A: 7, B: 6, C: 5, D: 4, E: 3, F: 2, G: 1 };
  return ratingScale[rating] || 0;
};

/**
 * Convert energy efficiency rating descriptions into a ranking system (star-based).
 * Now handles "N/A" by returning 0, ensuring correct filtering.
 */
export const efficiencyRatingToNumber = (efficiency) => {
  if (!efficiency || efficiency.toUpperCase() === 'N/A') return 0; // Changed from null to 0
  const efficiencyScale = { "Very Good": 5, Good: 4, Average: 3, Poor: 2, "Very Poor": 1 };
  return efficiencyScale[efficiency] || 0;
};

/**
 * Parse numeric values from strings, handling cases with currency symbols.
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
 * Find the maximum and minimum values for EPC-related metrics.
 */
export const findMaxValues = (properties) => {
  if (!properties.length) return {};

  const getMaxEfficiency = (key) =>
    Math.max(
      0,
      ...properties
        .map((p) => efficiencyRatingToNumber(p[key]))
        .filter((val) => val > 0) // Ignore invalid values
    );

  // Max EPC ratings and efficiency
  const maxEnergyRating = Math.max(...properties.map((p) => energyRatingToNumber(p.current_energy_rating)));
  const maxEnergyEfficiency = Math.max(...properties.map((p) => parseNumericValue(p.current_energy_efficiency)));

  const maxPotentialEnergyRating = Math.max(...properties.map((p) => energyRatingToNumber(p.potential_energy_rating)));
  const maxPotentialEnergyEfficiency = Math.max(...properties.map((p) => parseNumericValue(p.potential_energy_efficiency)));

  // Energy consumption and cost
  const minEnergyConsumptionCurrent = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_current)));
  const minTotalEnergyUsage = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_current * p.total_floor_area)));
  const minTotalEnergyCost = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_current * p.total_floor_area * p.cost_per_kwh)));

  // Heating costs
  const minHeatingCostCurrent = Math.min(...properties.map((p) => parseNumericValue(p.heating_example)));
  const maxHeatingCostSavings = Math.max(
    ...properties.map((p) => {
      const current = parseNumericValue(p.heating_cost_current);
      const potential = parseNumericValue(p.heating_cost_potential);
      return current - potential;
    })
  );

  // Lighting costs
  const minLightingCostCurrent = Math.min(...properties.map((p) => parseNumericValue(p.lighting_example)));
  const maxLightingCostSavings = Math.max(
    ...properties.map((p) => {
      const current = parseNumericValue(p.lighting_cost_current);
      const potential = parseNumericValue(p.lighting_cost_potential);
      return current - potential;
    })
  );

  // Hot water costs
  const minHotWaterCostCurrent = Math.min(...properties.map((p) => parseNumericValue(p.hot_water_example)));
  const maxHotWaterCostSavings = Math.max(
    ...properties.map((p) => {
      const current = parseNumericValue(p.hot_water_cost_current);
      const potential = parseNumericValue(p.hot_water_cost_potential);
      return current - potential;
    })
  );

  // Star-based ratings for heating efficiency
  const maxMainheatEnergyEff = getMaxEfficiency('mainheat_energy_eff');
  const maxMainheatControllerEff = getMaxEfficiency('mainheatc_energy_eff');

  // Star-based ratings for hot water and lighting efficiency
  const maxHotWaterEnergyEff = getMaxEfficiency('hot_water_energy_eff');
  const maxLightingEnergyEff = getMaxEfficiency('lighting_energy_eff');

  // Star-based ratings for structure efficiency (Windows, Floor, Roof, Walls)
  const maxWindowsEnergyEff = getMaxEfficiency('windows_energy_eff');
  const maxFloorEnergyEff = getMaxEfficiency('floor_energy_eff');
  const maxRoofEnergyEff = getMaxEfficiency('roof_energy_eff');
  const maxWallsEnergyEff = getMaxEfficiency('walls_energy_eff');

  return {
    // EPC metrics
    maxEnergyRating,
    maxEnergyEfficiency,
    maxPotentialEnergyRating,
    maxPotentialEnergyEfficiency,

    // Energy consumption and costs
    minEnergyConsumptionCurrent,
    minTotalEnergyUsage,
    minTotalEnergyCost,

    // Heating costs
    minHeatingCostCurrent,
    maxHeatingCostSavings,

    // Lighting costs
    minLightingCostCurrent,
    maxLightingCostSavings,

    // Hot water costs
    minHotWaterCostCurrent,
    maxHotWaterCostSavings,

    // Star-based efficiency ratings
    maxMainheatEnergyEff,
    maxMainheatControllerEff,
    maxHotWaterEnergyEff,
    maxLightingEnergyEff,

    // Efficiency ratings for structure components
    maxWindowsEnergyEff,
    maxFloorEnergyEff,
    maxRoofEnergyEff,
    maxWallsEnergyEff
  };
};
