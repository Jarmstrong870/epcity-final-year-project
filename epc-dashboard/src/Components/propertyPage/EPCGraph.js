import React from 'react';
import './EPCGraph.css'; // Import the CSS file
import translations from '../../locales/translations_epcgraph'; // Import translations for multiple languages.

const EPCGraph = ({ currentEnergyEfficiency, potentialEnergyEfficiency, language }) => {
  // Load translations based on the selected language; default to English if unavailable.
  const t = translations[language] || translations.en;

  // Define colors for each EPC rating label (A-G).
  const ratingColors = {
    A: '#006400', // Dark green
    B: '#228B22', // Green
    C: '#32CD32', // Light green
    D: '#FFD700', // Yellow
    E: '#FF8C00', // Orange
    F: '#FF4500', // Red-orange
    G: '#B22222', // Dark red
  };

  // Labels for EPC ratings and their corresponding thresholds.
  const ratingLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const thresholds = [92, 81, 69, 55, 39, 21, 1]; // Thresholds for each rating, starting from A.

  // Determine which rating a given efficiency score falls into.
  const getEfficiencyPosition = (efficiency) => {
    for (let i = 0; i < thresholds.length; i++) {
      if (efficiency >= thresholds[i]) {
        return i; // Return the index corresponding to the rating.
      }
    }
    return 6; // Default to the lowest rating (G) if no match is found.
  };

  // Find the index of the current and potential energy efficiency ratings.
  const currentEfficiencyPosition = getEfficiencyPosition(currentEnergyEfficiency);
  const potentialEfficiencyPosition = getEfficiencyPosition(potentialEnergyEfficiency);

  return (
    <div className="epc-graph-container">
      {/* Graph Title */}
      <h3 className="epc-title">{t.epcRatingGraph}</h3>

      {/* EPC Rating Bars */}
      <div className="epc-bars-container">
        {ratingLabels.map((label, index) => {
          const isCurrentEfficiency = currentEfficiencyPosition === index; // Check if the current efficiency matches this rating.
          const isPotentialEfficiency = potentialEfficiencyPosition === index; // Check if the potential efficiency matches this rating.

          return (
            <div key={label} className="epc-bar-wrapper">
              {/* Rating Bar */}
              <div
                className="epc-bar"
                style={{
                  backgroundColor: ratingColors[label], // Set the color based on the rating label.
                }}
              >
                {/* Display the rating range and label inside the bar */}
                <div className="epc-bar-label">
                  <span style={{ color: 'black' }}>{t.ranges[index].split(' ')[0]}</span>
                  <span style={{ color: 'white' }}>{t.ranges[index].split(' ')[1]}</span>
                </div>

                {/* Marker for Current Efficiency */}
                {isCurrentEfficiency && (
                  <div
                    className="epc-marker current"
                    style={{
                      backgroundColor: ratingColors[label], // Match color with the bar.
                    }}
                  >
                    <span>{t.current}</span> {/* Label for current rating */}
                    <span>{currentEnergyEfficiency}</span> {/* Current efficiency score */}
                  </div>
                )}

                {/* Marker for Potential Efficiency */}
                {isPotentialEfficiency && (
                  <div
                    className="epc-marker potential"
                    style={{
                      backgroundColor: ratingColors[label], // Match color with the bar.
                    }}
                  >
                    <span>{t.potential}</span> {/* Label for potential rating */}
                    <span>{potentialEnergyEfficiency}</span> {/* Potential efficiency score */}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EPCGraph;
// Export the component for use in other parts of the application.
