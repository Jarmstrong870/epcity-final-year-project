import React from 'react';
import { Link } from 'react-router-dom';
import './EPCFullTable.css';
import translations from '../../../locales/translations_epcfulltable';
import GeneralInformation from './GeneralInformation';
import EPCSpecificInformation from './EPCSpecificInformation';
import EnergyInformation from './EnergyInformation';
import CostComparisonGraph from './CostComparisonGraph';
import PropertyStructureInfo from './PropertyStructureInfo';

const EPCFullTable = ({ properties, maxValues, loading, language }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!properties || properties.length === 0) {
    return <p>No property details available.</p>;
  }

  const property = properties[0]; // Ensure the first property is correctly used.

  return (
    <div className="epc-container">
      <GeneralInformation properties={property} />
      
      {maxValues && <EPCSpecificInformation properties={property} maxValues={maxValues} />}
      <EnergyInformation properties={property} />
      <CostComparisonGraph properties={property} />
      <PropertyStructureInfo properties={property} />
    </div>
  );
};

export default EPCFullTable;
