// EPCFullTable.js
import React from 'react';

const EPCFullTable = ({ properties, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (properties.length === 0) {
    return <p>No properties found.</p>;
  }

  return (
    <div className="epc-full-table">
      <h2>EPC Full Table</h2>
      <table>
        <thead>
          <tr>
            <th>Low Energy Fixed Light Count</th>
            <th>Address</th>
            <th>UPRN Source</th>
            <th>Floor Height</th>
            <th>Heating Cost Potential</th>
            <th>Unheated Corridor Length</th>
            <th>Hot Water Cost Potential</th>
            <th>Construction Age Band</th>
            <th>Potential Energy Rating</th>
            <th>Main Heat Energy Efficiency</th>
            <th>Windows Environmental Efficiency</th>
            <th>Lighting Energy Efficiency</th>
            <th>Environmental Impact Potential</th>
            <th>Glazed Type</th>
            <th>Heating Cost Current</th>
            <th>Address3</th>
            <th>Main Heat Control Description</th>
            <th>Secondary Heating Energy Efficiency</th>
            <th>Property Type</th>
            <th>Local Authority Label</th>
            <th>Fixed Lighting Outlets Count</th>
            <th>Energy Tariff</th>
            <th>Mechanical Ventilation</th>
            <th>Hot Water Cost Current</th>
            <th>County</th>
            <th>Postcode</th>
            <th>Solar Water Heating Flag</th>
            <th>Constituency</th>
            <th>CO2 Emissions Potential</th>
            <th>Number Heated Rooms</th>
            <th>Floor Description</th>
            <th>Energy Consumption Potential</th>
            <th>Local Authority</th>
            <th>Built Form</th>
            <th>Number Open Fireplaces</th>
            <th>Windows Description</th>
            <th>Glazed Area</th>
            <th>Inspection Date</th>
            <th>Mains Gas Flag</th>
            <th>CO2 Emissions Current Per Floor Area</th>
            <th>Address1</th>
            <th>Heat Loss Corridor</th>
            <th>Flat Storey Count</th>
            <th>Constituency Label</th>
            <th>Roof Energy Efficiency</th>
            <th>Total Floor Area</th>
            <th>Building Reference Number</th>
            <th>Environmental Impact Current</th>
            <th>CO2 Emissions Current</th>
            <th>Roof Description</th>
            <th>Floor Energy Efficiency</th>
            <th>Number Habitable Rooms</th>
            <th>Address2</th>
            <th>Hot Water Environmental Efficiency</th>
            <th>Posttown</th>
            <th>Main Heat Control Energy Efficiency</th>
            <th>Main Fuel</th>
            <th>Lighting Environmental Efficiency</th>
            <th>Windows Energy Efficiency</th>
            <th>Floor Environmental Efficiency</th>
            <th>Secondary Heating Environmental Efficiency</th>
            <th>Lighting Description</th>
            <th>Roof Environmental Efficiency</th>
            <th>Walls Energy Efficiency</th>
            <th>Photo Supply</th>
            <th>Lighting Cost Potential</th>
            <th>Main Heat Environmental Efficiency</th>
            <th>Multi Glaze Proportion</th>
            <th>Main Heating Controls</th>
            <th>Lodgement DateTime</th>
            <th>Flat Top Storey</th>
            <th>Current Energy Rating</th>
            <th>Second Heat Description</th>
            <th>Walls Environmental Efficiency</th>
            <th>Transaction Type</th>
            <th>UPRN</th>
            <th>Current Energy Efficiency</th>
            <th>Energy Consumption Current</th>
            <th>Main Heat Description</th>
            <th>Lighting Cost Current</th>
            <th>Lodgement Date</th>
            <th>Extension Count</th>
            <th>Main Heat Control Environmental Efficiency</th>
            <th>LMK Key</th>
            <th>Wind Turbine Count</th>
            <th>Tenure</th>
            <th>Floor Level</th>
            <th>Potential Energy Efficiency</th>
            <th>Hot Water Energy Efficiency</th>
            <th>Low Energy Lighting</th>
            <th>Walls Description</th>
            <th>Hot Water Description</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr key={index}>
              <td>{property.low_energy_fixed_light_count}</td>
              <td>{property.address}</td>
              <td>{property.uprn_source}</td>
              <td>{property.floor_height}</td>
              <td>{property.heating_cost_potential}</td>
              <td>{property.unheated_corridor_length}</td>
              <td>{property.hot_water_cost_potential}</td>
              <td>{property.construction_age_band}</td>
              <td>{property.potential_energy_rating}</td>
              <td>{property.mainheat_energy_eff}</td>
              <td>{property.windows_env_eff}</td>
              <td>{property.lighting_energy_eff}</td>
              <td>{property.environmental_impact_potential}</td>
              <td>{property.glazed_type}</td>
              <td>{property.heating_cost_current}</td>
              <td>{property.address3}</td>
              <td>{property.mainheatcont_description}</td>
              <td>{property.sheating_energy_eff}</td>
              <td>{property.property_type}</td>
              <td>{property.local_authority_label}</td>
              <td>{property.fixed_lighting_outlets_count}</td>
              <td>{property.energy_tariff}</td>
              <td>{property.mechanical_ventilation}</td>
              <td>{property.hot_water_cost_current}</td>
              <td>{property.county}</td>
              <td>{property.postcode}</td>
              <td>{property.solar_water_heating_flag}</td>
              <td>{property.constituency}</td>
              <td>{property.co2_emissions_potential}</td>
              <td>{property.number_heated_rooms}</td>
              <td>{property.floor_description}</td>
              <td>{property.energy_consumption_potential}</td>
              <td>{property.local_authority}</td>
              <td>{property.built_form}</td>
              <td>{property.number_open_fireplaces}</td>
              <td>{property.windows_description}</td>
              <td>{property.glazed_area}</td>
              <td>{property.inspection_date}</td>
              <td>{property.mains_gas_flag}</td>
              <td>{property.co2_emiss_curr_per_floor_area}</td>
              <td>{property.address1}</td>
              <td>{property.heat_loss_corridor}</td>
              <td>{property.flat_storey_count}</td>
              <td>{property.constituency_label}</td>
              <td>{property.roof_energy_eff}</td>
              <td>{property.total_floor_area}</td>
              <td>{property.building_reference_number}</td>
              <td>{property.environmental_impact_current}</td>
              <td>{property.co2_emissions_current}</td>
              <td>{property.roof_description}</td>
              <td>{property.floor_energy_eff}</td>
              <td>{property.number_habitable_rooms}</td>
              <td>{property.address2}</td>
              <td>{property.hot_water_env_eff}</td>
              <td>{property.posttown}</td>
              <td>{property.mainheatc_energy_eff}</td>
              <td>{property.main_fuel}</td>
              <td>{property.lighting_env_eff}</td>
              <td>{property.windows_energy_eff}</td>
              <td>{property.floor_env_eff}</td>
              <td>{property.sheating_env_eff}</td>
              <td>{property.lighting_description}</td>
              <td>{property.roof_env_eff}</td>
              <td>{property.walls_energy_eff}</td>
              <td>{property.photo_supply}</td>
              <td>{property.lighting_cost_potential}</td>
              <td>{property.mainheat_env_eff}</td>
              <td>{property.multi_glaze_proportion}</td>
              <td>{property.main_heating_controls}</td>
              <td>{property.lodgement_datetime}</td>
              <td>{property.flat_top_storey}</td>
              <td>{property.current_energy_rating}</td>
              <td>{property.secondheat_description}</td>
              <td>{property.walls_env_eff}</td>
              <td>{property.transaction_type}</td>
              <td>{property.uprn}</td>
              <td>{property.current_energy_efficiency}</td>
              <td>{property.energy_consumption_current}</td>
              <td>{property.mainheat_description}</td>
              <td>{property.lighting_cost_current}</td>
              <td>{property.lodgement_date}</td>
              <td>{property.extension_count}</td>
              <td>{property.mainheatc_env_eff}</td>
              <td>{property.lmk_key}</td>
              <td>{property.wind_turbine_count}</td>
              <td>{property.tenure}</td>
              <td>{property.floor_level}</td>
              <td>{property.potential_energy_efficiency}</td>
              <td>{property.hot_water_energy_eff}</td>
              <td>{property.low_energy_lighting}</td>
              <td>{property.walls_description}</td>
              <td>{property.hotwater_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EPCFullTable;
