import React from 'react';
import { Link } from 'react-router-dom';
// Import `Link` to create navigable links to the glossary page.
import './EPCFullTable.css';
// Import CSS for styling the table layout.
import translations from '../../locales/translations_epcfulltable';
// Import translations for multiple languages.

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
  const t = translations[language] || translations.en; // Load translations based on the selected language.

  return (
    <div className="epc-container">
      {/* Title Section */}
      <h2 className="epc-title">{t.propertyDetails}</h2>

      {/* Basic Information Section */}
      <section className="epc-section">
        <h3 className="section-title">{t.basicInfo}</h3>
        <div className="card-container">
          {/* Address */}
          <div className="epc-card">
            <h4>
              {t.address}{' '}
              <Link to="/glossary#address" className="glossary-link">
                ? {/* Glossary link for address */}
              </Link>
            </h4>
            <p>{property.address || 'N/A'}</p>
          </div>
          {/* Postcode */}
          <div className="epc-card">
            <h4>
              {t.postcode}{' '}
              <Link to="/glossary#postcode" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.postcode || 'N/A'}</p>
          </div>
          {/* Property Type */}
          <div className="epc-card">
            <h4>
              {t.propertyType}{' '}
              <Link to="/glossary#property-type" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.property_type || 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Energy Performance Section */}
      <section className="epc-section">
        <h3 className="section-title">{t.energyPerformance}</h3>
        <div className="card-container">
          {/* Current Energy Rating */}
          <div className="epc-card">
            <h4>
              {t.currentEnergyRating}{' '}
              <Link to="/glossary#current-energy-rating" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.current_energy_rating || 'N/A'}</p>
          </div>
          {/* Current Energy Efficiency */}
          <div className="epc-card">
            <h4>
              {t.currentEnergyEfficiency}{' '}
              <Link to="/glossary#current-energy-efficiency" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.current_energy_efficiency || 'N/A'}</p>
          </div>
          {/* Potential Energy Efficiency */}
          <div className="epc-card">
            <h4>
              {t.potentialEnergyEfficiency}{' '}
              <Link to="/glossary#potential-energy-efficiency" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.potential_energy_efficiency || 'N/A'}</p>
          </div>
          {/* Main Heat Energy Efficiency */}
          <div className="epc-card">
            <h4>
              {t.mainHeatEnergyEfficiency}{' '}
              <Link to="/glossary#main-heat-energy-efficiency" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.mainheat_energy_eff || 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Cost Information Section */}
      <section className="epc-section">
        <h3 className="section-title">{t.costInfo}</h3>
        <div className="card-container">
          {/* Heating Cost */}
          <div className="epc-card">
            <h4>
              {t.heatingCost}{' '}
              <Link to="/glossary#heating-cost" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.heating_cost_current ? `${property.heating_cost_current}` : 'N/A'}</p>
          </div>
          {/* Lighting Cost */}
          <div className="epc-card">
            <h4>
              {t.lightingCost}{' '}
              <Link to="/glossary#lighting-cost" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.lighting_cost_current ? `${property.lighting_cost_current}` : 'N/A'}</p>
          </div>
          {/* Hot Water Cost */}
          <div className="epc-card">
            <h4>
              {t.hotWaterCost}{' '}
              <Link to="/glossary#hot-water-cost" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.hot_water_cost_current ? `${property.hot_water_cost_current}` : 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Property Details Section */}
      <section className="epc-section">
        <h3 className="section-title">{t.propertyDetailsSection}</h3>
        <div className="card-container">
          {/* Construction Age Band */}
          <div className="epc-card">
            <h4>
              {t.constructionAgeBand}{' '}
              <Link to="/glossary#construction-age-band" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.construction_age_band || 'N/A'}</p>
          </div>
          {/* Total Floor Area */}
          <div className="epc-card">
            <h4>
              {t.totalFloorArea}{' '}
              <Link to="/glossary#total-floor-area" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.total_floor_area ? `${property.total_floor_area} m²` : 'N/A'}</p>
          </div>
          {/* Number of Heated Rooms */}
          <div className="epc-card">
            <h4>
              {t.numberHeatedRooms}{' '}
              <Link to="/glossary#number-heated-rooms" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.number_heated_rooms || 'N/A'}</p>
          </div>
          {/* Tenure */}
          <div className="epc-card">
            <h4>
              {t.tenure}{' '}
              <Link to="/glossary#tenure" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.tenure || 'N/A'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EPCFullTable;
// Export the component for use in other parts of the application.
