import React from 'react';
import './PropertyStructureInfo.css';
import { efficiencyRatingToNumber } from '../../Compare_utils/Compare_utils';
import translations from './locales/translations_propertystructureinfo';


const PropertyStructureInfo = ({ properties, maxValues, language }) => {
  const t = translations[language] || translations.en;

  // Utility function to replace variations of NO DATA! with N/A
  const formatValue = (value, label) => {
    if (!value) return `${label}: ${t.headers.notAvailable}`;

    const cleanedValue = value.trim().toUpperCase();
    const noDataValues = ['NODATA!', 'NO DATA!', 'NO DATA', 'NODATA', 'NO-DATA'];

    return noDataValues.includes(cleanedValue) ? `${label}: ${t.headers.notAvailable}` : `${label}: ${value}`;
  };

  // Function to render star ratings based on efficiency
  const renderStarRating = (efficiency) => {
    if (!efficiency || efficiency.toUpperCase() === 'NODATA!') return t.headers.notAvailable;

    const rating = efficiency.toLowerCase();
    switch (rating) {
      case 'very good':
        return `${t.headers.veryGood} ⭐⭐⭐⭐⭐`;
      case 'good':
        return `${t.headers.good} ⭐⭐⭐⭐`;
      case 'average':
        return `${t.headers.average} ⭐⭐⭐`;
      case 'poor':
        return `${t.headers.poor} ⭐⭐`;
      case 'very poor':
        return `${t.headers.veryPoor} ⭐`;
      default:
        return `${efficiency} ☆`;
    }
  };

  // Highlight if the current efficiency is the highest
  const isHighestEfficiency = (efficiency, maxValue) => {
    const numericEfficiency = efficiencyRatingToNumber(efficiency);
    if (numericEfficiency === null) return false;
    return numericEfficiency === maxValue;
  };

  return (
    <div className="propertyInfoContainer">
      {/* Windows Information */}
      <div className="infoBox">
        <h3>{t.headers.windowsInfo}</h3>
        <div className="progressContainer">
          <p>{t.headers.multiGlazeProportion}:</p>
          <progress value={properties.multi_glaze_proportion} max={100} />
          <span>{properties.multi_glaze_proportion}%</span>
        </div>
        <p>{formatValue(properties.glazed_type, t.headers.glazedType)}</p>
        <p>{formatValue(properties.glazed_area, t.headers.glazedArea)}</p>
        <p>{formatValue(properties.windows_description, t.headers.windowsDescription)}</p>
        <p
          className={
            isHighestEfficiency(properties.windows_energy_eff, maxValues?.maxWindowsEnergyEff)
              ? 'highlight-green'
              : ''
          }
        >
          {t.headers.windowsEnergyEff}: {renderStarRating(properties.windows_energy_eff)}
        </p>
      </div>

      {/* Floor Information */}
      <div className="infoBox">
        <h3>{t.headers.floorInfo}</h3>
        <p>{formatValue(properties.total_floor_area + ' m²', t.headers.totalFloorArea)}</p>
        <p>{formatValue(properties.floor_level, t.headers.floorLevel)}</p>
        <p>{formatValue(properties.flat_top_storey, t.headers.flatTopStorey)}</p>
        <p>{formatValue(properties.floor_height + ' m', t.headers.floorHeight)}</p>
        <p>{formatValue(properties.floor_description, t.headers.floorDescription)}</p>
        <p
          className={
            isHighestEfficiency(properties.floor_energy_eff, maxValues?.maxFloorEnergyEff)
              ? 'highlight-green'
              : ''
          }
        >
          {t.headers.floorEnergyEff}: {renderStarRating(properties.floor_energy_eff)}
        </p>
      </div>

      {/* Roof Information */}
      <div className="infoBox">
        <h3>{t.headers.roofInfo}</h3>
        <p>{formatValue(properties.roof_description, t.headers.roofDescription)}</p>
        <p
          className={
            isHighestEfficiency(properties.roof_energy_eff, maxValues?.maxRoofEnergyEff)
              ? 'highlight-green'
              : ''
          }
        >
          {t.headers.roofEnergyEff}: {renderStarRating(properties.roof_energy_eff)}
        </p>
      </div>

      {/* Walls Information */}
      <div className="infoBox">
        <h3>{t.headers.wallsInfo}</h3>
        <p>{formatValue(properties.unheated_corridor_length, t.headers.unheatedCorridorLength)}</p>
        <p>{formatValue(properties.heat_loss_corridor, t.headers.heatLossCorridor)}</p>
        <p>{formatValue(properties.walls_description, t.headers.wallsDescription)}</p>
        <p
          className={
            isHighestEfficiency(properties.walls_energy_eff, maxValues?.maxWallsEnergyEff)
              ? 'highlight-green'
              : ''
          }
        >
          {t.headers.wallsEnergyEff}: {renderStarRating(properties.walls_energy_eff)}
        </p>
      </div>
    </div>
  );
};

export default PropertyStructureInfo;
