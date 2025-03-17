import React from 'react';
import './EPCGraph.css';  // Import the CSS file
import translations from '../../locales/translations_epcgraph'; // Import translations for multiple languages.
import { Link } from 'react-router-dom';  // Make sure to import Link

const EPCGraph = ({ currentEnergyEfficiency, potentialEnergyEfficiency, language }) => {
  const t = translations[language] || translations.en;

  const ratingColors = {
    A: '#006400', // Dark green
    B: '#228B22', // Green
    C: '#32CD32', // Light green
    D: '#FFD700', // Yellow
    E: '#FF8C00', // Orange
    F: '#FF4500', // Red-orange
    G: '#B22222', // Dark red
  };

  const ratingLengths = {
    A: "40%", B: "50%", C: "60%", D: "70%", E: "80%", F: "90%", G: "100%",
  };

  const ratingLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const thresholds = [92, 81, 69, 55, 39, 21, 1];

  const getEfficiencyPosition = (efficiency) => {
    for (let i = 0; i < thresholds.length; i++) {
      if (efficiency >= thresholds[i]) {
        return i;
      }
    }
    return 6;
  };

  const currentEfficiencyPosition = getEfficiencyPosition(currentEnergyEfficiency);
  const potentialEfficiencyPosition = getEfficiencyPosition(potentialEnergyEfficiency);

  return (
    <div className="epc-graph-container">
      <h3 className="epc-title">{t.epcRatingGraph}</h3>

      <div className="graph-content">
        <div className="epc-bars-container">
          {ratingLabels.map((label, index) => {
            const isCurrentEfficiency = currentEfficiencyPosition === index;
            const isPotentialEfficiency = potentialEfficiencyPosition === index;

            return (
              <div key={label} className="epc-bar-wrapper">
                <div className="epc-bar"
                  style={{
                    backgroundColor: ratingColors[label],
                    width: ratingLengths[label],
                  }}>
                  <span className="epc-bar-range" style={{ color: 'black' }}>
                    {t.ranges[index].split(' ')[0]}
                  </span>

                  <span className="epc-bar-letter" style={{ color: 'white' }}>
                    {t.ranges[index].split(' ')[1]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="epc-marker-summary">
          <div className="epc-marker-base">
            <h4 className="epc-current-title">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.currentEPCRating)}`} className="greenQuestionMark"></Link>
              <span>{t.currentEfficiencyTitle}</span>
            </h4>

            <div className="epc-current">
              {ratingLabels.map((label, index) => (
                currentEfficiencyPosition === index && (
                  <div key={label} className="epc-marker current" style={{ backgroundColor: ratingColors[label] }}>
                    <span>{t.current}</span>
                    <span>{currentEnergyEfficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="epc-marker-base">
            <h4 className="epc-potential-title">
              <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.potentialEPCRating)}`} className="greenQuestionMark"></Link>
              <span>{t.potentialEfficiencyTitle}</span>
            </h4>

            <div className="epc-potential">
              {ratingLabels.map((label, index) => (
                potentialEfficiencyPosition === index && (
                  <div key={label} className="epc-marker potential" style={{ backgroundColor: ratingColors[label] }}>
                    <span>{t.potential}</span>
                    <span>{potentialEnergyEfficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPCGraph;
