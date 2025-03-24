import "./RecommendationTable.css";
import translations from '../../locales/translations_recommendationstable';

const RecommendationTable = ({ property, language }) => {
    const t = translations[language] || translations.en; // Get translations for the selected language
    const text_list = property.improvement_summary_text;
    const cost_list = property.indicative_cost;

    if(!text_list){
        return(
            <div>
                <p>{t.noRecommendations}</p> 
            </div>
        );
    }

    return (
        <div className="RecommendationTable">
            <table className="RecommendationTableStyling">
                <thead>
                    <tr>
                        <th>{t.recommendationDescription}</th> {/* Translated text */}
                        <th>{t.estimatedCost}</th> {/* Translated text */}
                    </tr>
                </thead>
                <tbody>
                    {text_list.map((item, index) => (
                        <tr key={index}>
                            <td>{item}</td>
                            <td>{cost_list[index]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecommendationTable;
