import React from 'react';
import { Link } from 'react-router-dom';
import './EPCFullTable.css';
import translations from '../../../locales/translations_epcfulltable';
import GeneralInformation from './GeneralInformation';
import EPCSpecificInformation from './EPCSpecificInformation';
import EnergyInformation from './EnergyInformation';
import CostComparisonGraph from './CostComparisonGraph';
import PropertyStructureInfo from './PropertyStructureInfo';


const EPCFullTable = ({ properties, loading, language }) => {
  // Show a loading message if the data is still being fetched.
  if (loading) {
    return <p>Loading...</p>;
  }

  // Show a message if no property details are available.
  if (!properties || properties.length === 0) {
    return <p>No property details available.</p>;
  }

  const property = properties[0]; // Use the first property in the array.
  

  return (
    <div className="epc-container">
      <GeneralInformation properties={property} />
      <EPCSpecificInformation properties={property} />
      <EnergyInformation properties={property} />
      <CostComparisonGraph properties={property} />
      <PropertyStructureInfo properties={property} />
    </div>
  );
};

export default EPCFullTable;

