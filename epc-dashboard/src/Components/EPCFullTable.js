import React from 'react';
import './EPCFullTable.css';

const EPCFullTable = ({ property }) => {
  if (!property) {
    return <p>No property details available.</p>;
  }

  return (
    <div className="epc-details-container">
      <h2>Property Details</h2>

      <div className="epc-row">
        {/* Column 1 */}
        <div className="epc-column">
          <p><strong>Address:</strong> {property.address || 'Not available'}</p>
          <p><strong>Postcode:</strong> {property.postcode || 'Not available'}</p>
          <p><strong>Property Type:</strong> {property.property_type || 'Not available'}</p>
          <p><strong>Construction Age Band:</strong> {property.construction_age_band || 'Not available'}</p>
        </div>

        {/* Column 2 */}
        <div className="epc-column">
          <p><strong>Current Energy Rating:</strong> {property.current_energy_rating || 'Not available'}</p>
          <p><strong>Potential Energy Rating:</strong> {property.potential_energy_rating || 'Not available'}</p>
          <p><strong>Current Heating Cost:</strong> £{property.heating_cost_current || 'Not available'}</p>
          <p><strong>Potential Heating Cost:</strong> £{property.heating_cost_potential || 'Not available'}</p>
        </div>

        {/* Column 3 */}
        <div className="epc-column">
          <p><strong>Energy Consumption (Current):</strong> {property.energy_consumption_current || 'Not available'}</p>
          <p><strong>Tenure:</strong> {property.tenure || 'Not available'}</p>
          {property.tenure === 'rental (private)' && (
            <p><em>This property is available for rent. Look for it online!</em></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EPCFullTable;
