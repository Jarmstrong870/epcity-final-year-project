import "./RecommendationTable.css";
const RecommendationTable = ({ property }) => {
    console.log(property)
    const text_list = property.improvement_summary_text;
    const cost_list = property.indicative_cost
    if(!text_list){
        return(
            <div>
                <p>No Recommendations for this property</p>
            </div>
        )
    }
    return (
        <div className="RecommendationTable">
            <table className="RecommendationTableStyling">
                <thead>
                    <tr>
                        <th>Recommendation Description</th>
                        <th>Estimated Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {text_list.map((item, index) => (
                        <tr>
                            <td>{item}</td>
                            <td>{cost_list[index]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RecommendationTable;
