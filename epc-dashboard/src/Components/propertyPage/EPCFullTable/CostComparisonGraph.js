

const CostComparisonGraph = ({ properties }) => {

    return(
        <div className="epc-container">
        <h2>Cost Comparison Graph</h2>
        <table className="epc-table">
            <tbody>
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

export default CostComparisonGraph;