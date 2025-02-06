

const PropertyStructureInfo = (properties) => {

return(
    <div className="epc-container">
    <h2>Property Structure Information</h2>
    <table className="epc-table">
        <tbody>
        <tr>
            <td className="epc-table-header">Property Age</td>
            <td>{properties.property_age}</td>
        </tr>
        <tr>
            <td className="epc-table-header">Property Condition</td>
            <td>{properties.property_condition}</td>
        </tr>
        <tr>
            <td className="epc-table-header">Property Size</td>
            <td>{properties.property_size}</td>
        </tr>
        <tr>
            <td className="epc-table-header">Property Layout</td>
            <td>{properties.property_layout}</td>
        </tr>
        <tr>
            <td className="epc-table-header">Property Features</td>
            <td>{properties.property_features}</td>
        </tr>
        <tr>
            <td className="epc-table-header">Property Description</td>
            <td>{properties.property_description}</td>
        </tr>
        </tbody>
    </table>
    </div>
)
};

export default PropertyStructureInfo;
