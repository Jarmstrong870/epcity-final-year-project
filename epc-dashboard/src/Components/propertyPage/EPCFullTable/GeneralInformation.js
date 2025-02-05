

const GeneralInformation = ({properties}) => {
    return (
        <div className="epc-container">
        <h2>General Information</h2>
        <table className="epc-table">
            <tbody>
            <tr>
                <td className="epc-table-header">Address</td>
                <td>{properties.address}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Property Type</td>
                <td>{properties.property_type}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Built Form</td>
                <td>{properties.built_form}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Main Heating Fuel</td>
                <td>{properties.main_heating_fuel}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Date of Assessment</td>
                <td>{properties.date_of_assessment}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Total Floor Area</td>
                <td>{properties.total_floor_area}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Energy Efficiency Rating</td>
                <td>{properties.current_energy_efficiency}</td>
            </tr>
            <tr>
                <td className="epc-table-header">Environmental Impact Rating</td>
                <td>{properties.current_environmental_impact}</td>
            </tr>
            </tbody>
        </table>
        </div>
    );
};

export default GeneralInformation;
