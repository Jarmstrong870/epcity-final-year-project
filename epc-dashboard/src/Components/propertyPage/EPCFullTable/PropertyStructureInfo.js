import React from 'react';
import './PropertyStructureInfo.css';

const PropertyStructureInfo = ({ properties }) => {
  // Utility function to replace variations of NO DATA! with N/A
  const formatValue = (value, label) => {
    if (!value) return `${label}: N/A`;

    const cleanedValue = value.trim().toUpperCase();
    const noDataValues = ['NODATA!', 'NO DATA!', 'NO DATA', 'NODATA', 'NO-DATA'];

    return noDataValues.includes(cleanedValue) ? `${label}: N/A` : `${label}: ${value}`;
  };

  // Function to render star ratings based on efficiency
  const renderStarRating = (efficiency) => {
    if (!efficiency || efficiency.toUpperCase() === 'NODATA!') return 'N/A ☆';

    const rating = efficiency.toLowerCase();
    switch (rating) {
      case 'very good':
        return 'Very Good ⭐⭐⭐⭐';
      case 'good':
        return 'Good ⭐⭐⭐';
      case 'average':
        return 'Average ⭐⭐';
      case 'poor':
        return 'Poor ⭐';
      case 'very poor':
        return 'Very Poor ☆';
      default:
        return `${efficiency} ☆`;
    }
  };

  return (
    <div className="propertyInfoContainer">
      {/* Windows Information */}
      <div className="infoBox">
        <h3>Windows Information</h3>
        <p>{formatValue(properties.multi_glaze_proportion + '%', 'Multi Glaze Proportion')}</p>
        <p>{formatValue(properties.glazed_type, 'Glazed Type')}</p>
        <p>{formatValue(properties.glazed_area, 'Glazed Area')}</p>
        <p>{formatValue(properties.windows_description, 'Windows Description')}</p>
        <p>Windows Energy Efficiency: {renderStarRating(properties.windows_energy_eff)}</p>
      </div>

      {/* Floor Information */}
      <div className="infoBox">
        <h3>Floor Information</h3>
        <p>{formatValue(properties.total_floor_area + ' m²', 'Total Floor Area')}</p>
        <p>{formatValue(properties.floor_level, 'Floor Level')}</p>
        <p>{formatValue(properties.flat_top_storey, 'Flat Top Storey')}</p>
        <p>{formatValue(properties.floor_height + ' m', 'Floor Height')}</p>
        <p>{formatValue(properties.floor_description, 'Floor Description')}</p>
        <p>Floor Energy Efficiency: {renderStarRating(properties.floor_energy_eff)}</p>
      </div>

      {/* Roof Information */}
      <div className="infoBox">
        <h3>Roof Information</h3>
        <p>{formatValue(properties.roof_description, 'Roof Description')}</p>
        <p>Roof Energy Efficiency: {renderStarRating(properties.roof_energy_eff)}</p>
      </div>

      {/* Walls Information */}
      <div className="infoBox">
        <h3>Walls Information</h3>
        <p>{formatValue(properties.unheated_corridor_length, 'Unheated Corridor Length')}</p>
        <p>{formatValue(properties.heat_loss_corridor, 'Heat Loss Corridor')}</p>
        <p>{formatValue(properties.walls_description, 'Walls Description')}</p>
        <p>Walls Energy Efficiency: {renderStarRating(properties.walls_energy_eff)}</p>
      </div>
    </div>
  );
};

export default PropertyStructureInfo;
