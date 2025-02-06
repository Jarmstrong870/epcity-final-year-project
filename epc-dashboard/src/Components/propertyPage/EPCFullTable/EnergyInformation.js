
const EnergyInformation = ({ properties}) => {
    return(
        <div className="epc-container">
        <h2>Energy Information</h2>
        <table className="epc-table">
            <tbody>
            <tr>
                <td className="epc-table-header">Energy Efficiency Rating</td>
                <td>{properties.current_energy_efficiency}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Environmental Impact Rating</td>
                <td>{properties.current_environmental_impact}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Energy Usage</td>
                <td>{properties.energy_usage}</td>
            </tr>
            <tr>
                <td className="epc-table-header">CO2 Emissions</td>
                <td>{properties.co2_emissions}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Heating Costs</td>
                <td>{properties.heating_costs}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Hot Water Costs</td>
                <td>{properties.hot_water_costs}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Lighting Costs</td>
                <td>{properties.lighting_costs}</td>
            </tr>
            </tbody>
        </table>
        </div>
    )

};

export default EnergyInformation;