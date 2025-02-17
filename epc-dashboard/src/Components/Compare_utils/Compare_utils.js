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
  const ratingScale = { A: 7, B: 6, C: 5, D: 4, E: 3, F: 2, G: 1 };
  return ratingScale[rating] || 0; // Default to 0 if not found
};

/**
 * Convert energy efficiency rating descriptions into a ranking system.
 *
 * @param {string} efficiency - The efficiency description.
 * @returns {number} - A numerical value representing the ranking.
 */
export const efficiencyRatingToNumber = (efficiency) => {
  const efficiencyScale = { "Very Good": 5, Good: 4, Average: 3, Poor: 2, "Very Poor": 1 };
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
    const numeric = parseFloat(value.replace(/[^0-9.]/g, "")); // Remove non-numeric characters
    return isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

/**
 * Find the maximum and minimum values for EPC-related metrics.
 *
 * @param {Array} properties - List of property objects.
 * @returns {Object} - Object containing the max and min values for EPC metrics.
 */
export const findMaxValues = (properties) => {
  if (!properties.length) return {}; // Prevent errors if properties array is empty

  const maxEnergyRating = Math.max(...properties.map((p) => energyRatingToNumber(p.current_energy_rating)));
  const maxEnergyEfficiency = Math.max(...properties.map((p) => parseNumericValue(p.current_energy_efficiency)));

  const minEnergyConsumptionCurrent = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_current)));
  const minTotalEnergyUsage = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_current * p.total_floor_area)));
  const minTotalEnergyCost = Math.min(...properties.map((p) => parseNumericValue(p.energy_consumption_current * p.total_floor_area * p.cost_per_kwh)));

  return {
    maxEnergyRating,
    maxEnergyEfficiency,
    minEnergyConsumptionCurrent,
    minTotalEnergyUsage,
    minTotalEnergyCost
  };
};
