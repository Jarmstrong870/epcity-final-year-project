import "./RecommendationTable.css";
import translations from '../../locales/translations_recommendationstable';

const RecommendationTable = ({ property, language }) => {
    const t = translations[language] || translations.en; // Get translations for the selected language
    const text_list = property.improvement_summary_text;
    const cost_list = property.indicative_cost;

    if(!text_list){
        return(
            <div className="recommendation-base">
                <p className="no-recommendations-table">{t.noRecommendations}</p> 
            </div>
        );
    }

    return (
    <div className="recommendation-base">
        <div className="recommendation-cards">
                    {text_list.map((item, index) => (
                        <div className="recommendation-card" key={index}>
                            <p className="recommendation-description">{item}</p>
                            <p className="recommendation-cost">{cost_list[index]}</p>
                        </div>
                    ))}
            </div>
    </div>
    );
};

export default RecommendationTable;
