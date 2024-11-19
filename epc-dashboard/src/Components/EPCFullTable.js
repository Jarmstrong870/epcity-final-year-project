import React from 'react';
import './EPCFullTable.css'; // Styles for the layout

const EPCFullTable = ({ properties, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!properties || properties.length === 0) {
    return <p>No property details available.</p>;
  }

  const property = properties[0]; // Access the first property in the array

  return (
    <div className="epc-container">
      <h2 className="epc-title">Property Details</h2>

      {/* Basic Info Section */}
      <section className="epc-section">
        <h3 className="section-title">Basic Information</h3>
        <div className="card-container">
          <div className="epc-card">
            <h4>Address</h4>
            <p>{property.address || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Postcode</h4>
            <p>{property.postcode || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Property Type</h4>
            <p>{property.property_type || 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Energy Performance Section */}
      <section className="epc-section">
        <h3 className="section-title">Energy Performance</h3>
        <div className="card-container">
          <div className="epc-card">
            <h4>Current Energy Rating</h4>
            <p>{property.current_energy_rating || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Current Energy Efficiency</h4>
            <p>{property.current_energy_efficiency || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Potential Energy Efficiency</h4>
            <p>{property.potential_energy_efficiency || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Main Heat Energy Efficiency</h4>
            <p>{property.mainheat_energy_eff || 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Cost Information Section */}
      <section className="epc-section">
        <h3 className="section-title">Cost Information</h3>
        <div className="card-container">
          <div className="epc-card">
            <h4>Heating Cost (Current)</h4>
            <p>{property.heating_cost_current ? `£${property.heating_cost_current}` : 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Lighting Cost (Current)</h4>
            <p>{property.lighting_cost_current ? `£${property.lighting_cost_current}` : 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Hot Water Cost (Current)</h4>
            <p>{property.hot_water_cost_current ? `£${property.hot_water_cost_current}` : 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Property Details Section */}
      <section className="epc-section">
        <h3 className="section-title">Property Details</h3>
        <div className="card-container">
          <div className="epc-card">
            <h4>Construction Age Band</h4>
            <p>{property.construction_age_band || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Total Floor Area</h4>
            <p>{property.total_floor_area ? `${property.total_floor_area} m²` : 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Number of Heated Rooms</h4>
            <p>{property.number_heated_rooms || 'N/A'}</p>
          </div>
          <div className="epc-card">
            <h4>Tenure</h4>
            <p>{property.tenure || 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Additional Notes */}
      {property.tenure && property.tenure.toLowerCase().includes('rental') && (
        <section className="epc-section">
          <h3 className="section-title">Note for Renters</h3>
          <p>This property is available for rent; check online for availability.</p>
        </section>
      )}
    </div>
  );
};

export default EPCFullTable;
