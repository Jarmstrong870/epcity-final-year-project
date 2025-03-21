import React, { useState } from 'react';
import './PropertyStructureInfo.css';
import { efficiencyRatingToNumber } from '../../Compare_utils/Compare_utils';
import translations from './locales/translations_propertystructureinfo';
import { classifyWall } from './EfficiencyMeter';
import { classifyRoof } from './descriptionIcons/roofIcons';
import ProgressMeter from './ProgressMeter';
import ProgressDial from './ProgressDial'; // dial gauge
import InsulationMeter from './InsulationMeter'; // Progress Bar
import { windowEfficiency } from './descriptionIcons/windowIcons';
import { Link } from 'react-router-dom';  // Make sure this import is added

const PropertyStructureInfo = ({ properties, maxValues, language }) => {
  const t = translations[language] || translations.en;
  const [dropdownClick, setDropdownClick] = useState("");

  const {efficiencyGroup, transmittanceStatus} = classifyRoof(properties.roof_description);
  //const {efficiencyGroup, transmittanceStatus} = classifyRoof("Average thermal transmittance 0.001 W/m?K");


  // Utility function to replace variations of NO DATA! with N/A
  const formatValue = (value) => {
    if (!value) return t.headers.notAvailable;

    const cleanedValue = value.trim().toUpperCase();
    const noDataValues = ['NODATA!', 'NO DATA!', 'NO DATA', 'NODATA', 'NO-DATA'];

    return noDataValues.includes(cleanedValue) ? t.headers.notAvailable : value;
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

  const toggleDropdown = (infoArea) => {
    setDropdownClick(selection => (selection === infoArea ? null : infoArea));
  };

  return (
    <div className="propertyInfoContainer">
      <div className="info-dropdown">
        <button onClick={() => toggleDropdown("windows")}>
          <span className="data-headers"> 
            {t.headers.windowsInfo} <span className='dropdown-arrow'>▼</span>
          </span>
        </button>
        {/* Windows Information */}
        <div className={`infoBox ${dropdownClick === "windows" ? "active" : "inactive"}`}>
          <div className="progressContainer">
            <p><span className="data-headers">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.multiGlazeProportion)}`} className="greenQuestionMark"></Link>
              {t.headers.multiGlazeProportion}
            </span>
            </p>
            <p><span className='data-headers'>
            <progress value={properties.multi_glaze_proportion} max={100} />
              {properties.multi_glaze_proportion}%</span></p>
          </div>
          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.glazedType)}`} className="greenQuestionMark"></Link>
            {t.headers.glazedType} 
          </span></p>
          <p><span className="data-field"> {formatValue(properties.glazed_type)} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.glazedArea)}`} className="greenQuestionMark"></Link>
            {t.headers.glazedArea}
          </span></p>
          <p><span className="data-field"> {formatValue(properties.glazed_area)} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.windowsDescription)}`} className="greenQuestionMark"></Link>
            {t.headers.windowsDescription}
          </span></p>
          <p><span className="data-field"> {windowEfficiency(properties.windows_description)} </span></p>

          <p className={isHighestEfficiency(properties.windows_energy_eff, maxValues?.maxWindowsEnergyEff) ? 'highlight-green' : ''} >
            <span className="data-headers">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.windowsEnergyEff)}`} className="greenQuestionMark"></Link>
              {t.headers.windowsEnergyEff} 
            </span>:  
          </p>
          <p><span className="data-field"> {renderStarRating(properties.windows_energy_eff)}</span></p>
        </div>
      </div>

      <div className="info-dropdown">
        <button onClick={() => toggleDropdown("floor")}>
          <span className="data-headers">
            {t.headers.floorInfo}<span className='dropdown-arrow'>▼</span>
          </span>
        </button>
        {/* Floor Information */}
        <div className={`infoBox ${dropdownClick === "floor" ? "active" : "inactive"}`}>
          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.totalFloorArea)}`} className="greenQuestionMark"></Link>
            {t.headers.totalFloorArea}
          </span></p>
          <p><span className="data-field"> {formatValue(properties.total_floor_area + ' m²')} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.floorLevel)}`} className="greenQuestionMark"></Link>
            {t.headers.floorLevel}
          </span></p>
          <p><span className="data-field"> {formatValue(properties.floor_level)} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.flatTopStorey)}`} className="greenQuestionMark"></Link>
            {t.headers.flatTopStorey}
          </span></p>
          <p><span className="data-field"> {formatValue(properties.flat_top_storey)} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.floorHeight)}`} className="greenQuestionMark"></Link>
            {t.headers.floorHeight}
          </span></p>
          <p><span className="data-field"> {formatValue(properties.floor_height + ' m')} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.floorDescription)}`} className="greenQuestionMark"></Link>
            {t.headers.floorDescription}
          </span></p>
          <p><span className="data-field"> {formatValue(properties.floor_description)} </span> </p>

          <p className={isHighestEfficiency(properties.floor_energy_eff, maxValues?.maxFloorEnergyEff) ? 'highlight-green' : ''}>
            <span className="data-headers">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.floorEnergyEff)}`} className="greenQuestionMark"></Link>
              {t.headers.floorEnergyEff} 
            </span>: 
          </p>
          <p><span className="data-field"> {renderStarRating(properties.floor_energy_eff)}</span></p>
        </div>
      </div>

      <div className="info-dropdown">
        <button onClick={() => toggleDropdown("roof")}>
          <span className="data-headers">
            {t.headers.roofInfo}<span className='dropdown-arrow'>▼</span>
          </span>
        </button>
        {/* Roof Information */}
        <div className={`infoBox ${dropdownClick === "roof" ? "active" : "inactive"}`}>
          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.roofDescription)}`} className="greenQuestionMark"></Link>
            {t.headers.roofDescription}
          </span></p>

          {transmittanceStatus ? (
            <ProgressDial group={efficiencyGroup} />
          ) : (
            <InsulationMeter valueRange={efficiencyGroup} />
          )}

          <p className={isHighestEfficiency(properties.roof_energy_eff, maxValues?.maxRoofEnergyEff) ? 'highlight-green' : ''}>
            <span className="data-headers">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.roofEnergyEff)}`} className="greenQuestionMark"></Link>
              {t.headers.roofEnergyEff} 
            </span>: 
          </p>
          <p><span className="data-field">{renderStarRating(properties.roof_energy_eff)} </span> </p>
        </div>
      </div>

      <div className="info-dropdown">
        <button onClick={() => toggleDropdown("walls")}>
          <span className="data-headers">
            {t.headers.wallsInfo} <span className='dropdown-arrow'>▼</span>
          </span>
        </button>
        {/* walls Information */}
        <div className={`infoBox ${dropdownClick === "walls" ? "active" : "inactive"}`}>
          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.unheatedCorridorLength)}`} className="greenQuestionMark"></Link>
            {t.headers.unheatedCorridorLength}
          </span></p>
          <p><span className="data-field">{formatValue(properties.unheated_corridor_length)} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.heatLossCorridor)}`} className="greenQuestionMark"></Link>
            {t.headers.heatLossCorridor}
          </span></p>
          <p><span className="data-field">{formatValue(properties.heat_loss_corridor)} </span> </p>

          <p><span className="data-headers">
            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.wallsDescription)}`} className="greenQuestionMark"></Link>
            {t.headers.wallsDescription}
          </span></p>
          <p><span className="data-field">{formatValue(properties.walls_description)} </span> </p>

          <p>
            <span className="data-headers">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.wallsDescription)}`} className="greenQuestionMark"></Link>
              {t.headers.wallsDescription} 
            </span>
            
          </p>

          <ProgressMeter category={classifyWall(properties.walls_description)} />

          <p className={isHighestEfficiency(properties.walls_energy_eff, maxValues?.maxWallsEnergyEff) ? 'highlight-green' : ''} >
            <span className="data-headers">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.headers.wallsEnergyEff)}`} className="greenQuestionMark"></Link>
              {t.headers.wallsEnergyEff}
            </span>: 
          </p>
          <p><span className="data-field">{renderStarRating(properties.walls_energy_eff)} </span></p>
        </div>
      </div>
    </div>
  );
};

export default PropertyStructureInfo;
