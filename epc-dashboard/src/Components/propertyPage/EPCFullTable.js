import React from 'react';
import { Link } from 'react-router-dom';
import './EPCFullTable.css'; // Styles for the layout
import translations from '../../locales/translations_epcfulltable'; // Import translations

const EPCFullTable = ({ properties, loading, language }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!properties || properties.length === 0) {
    return <p>No property details available.</p>;
  }

  const property = properties[0]; // Access the first property in the array
  const t = translations[language] || translations.en; // Load translations

  return (
    <div className="epc-container">
      <h2 className="epc-title">{t.propertyDetails}</h2>

      {/* Basic Info Section */}
      <section className="epc-section">
        <h3 className="section-title">{t.basicInfo}</h3>
        <div className="card-container">
          <div className="epc-card">
            <h4>
              {t.address}{' '}
              <Link to="/glossary#address" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.address || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>
              {t.postcode}{' '}
              <Link to="/glossary#postcode" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.postcode || 'N/A'}</p>
          </div>
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
          <div className="epc-card">
            <h4>
              {t.currentEnergyRating}{' '}
              <Link to="/glossary#current-energy-rating" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.current_energy_rating || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>
              {t.currentEnergyEfficiency}{' '}
              <Link to="/glossary#current-energy-efficiency" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.current_energy_efficiency || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>
              {t.potentialEnergyEfficiency}{' '}
              <Link to="/glossary#potential-energy-efficiency" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.potential_energy_efficiency || 'N/A'}</p>
          </div>
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
          <div className="epc-card">
            <h4>
              {t.heatingCost}{' '}
              <Link to="/glossary#heating-cost" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.heating_cost_current ? `${property.heating_cost_current}` : 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>
              {t.lightingCost}{' '}
              <Link to="/glossary#lighting-cost" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.lighting_cost_current ? `${property.lighting_cost_current}` : 'N/A'}</p>
          </div>
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
          <div className="epc-card">
            <h4>
              {t.constructionAgeBand}{' '}
              <Link to="/glossary#construction-age-band" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.construction_age_band || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>
              {t.totalFloorArea}{' '}
              <Link to="/glossary#total-floor-area" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.total_floor_area ? `${property.total_floor_area} m²` : 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>
              {t.numberHeatedRooms}{' '}
              <Link to="/glossary#number-heated-rooms" className="glossary-link">
                ?
              </Link>
            </h4>
            <p>{property.number_heated_rooms || 'N/A'}</p>
          </div>
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
