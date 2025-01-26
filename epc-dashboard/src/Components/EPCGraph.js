import React from 'react';
import translations from '../locales/translations_epcgraph'; // Import translations

const EPCGraph = ({ currentEnergyEfficiency, potentialEnergyEfficiency, language }) => {
  const t = translations[language] || translations.en; // Load translations

  // Define color ranges for EPC ratings
  const ratingColors = {
    A: '#006400', // Dark green
    B: '#228B22', // Green
    C: '#32CD32', // Light green
    D: '#FFD700', // Yellow
    E: '#FF8C00', // Orange
    F: '#FF4500', // Red-orange
    G: '#B22222', // Dark red
  };

  // Rating labels and thresholds
  const ratingLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const thresholds = [92, 81, 69, 55, 39, 21, 1];

  // Determine the section each energy efficiency score falls into
  const getEfficiencyPosition = (efficiency) => {
    for (let i = 0; i < thresholds.length; i++) {
      if (efficiency >= thresholds[i]) {
        return i;
      }
    }
    return 6; // Default to lowest section (G)
  };

  const currentEfficiencyPosition = getEfficiencyPosition(currentEnergyEfficiency);
  const potentialEfficiencyPosition = getEfficiencyPosition(potentialEnergyEfficiency);

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <h3>{t.epcRatingGraph}</h3>

      {/* EPC Rating Bars */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        {ratingLabels.map((label, index) => {
          const barWidth = '90%';
          const isCurrentEfficiency = currentEfficiencyPosition === index;
          const isPotentialEfficiency = potentialEfficiencyPosition === index;

          return (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: '10px',
                position: 'relative',
              }}
            >
              {/* Rating Bar */}
              <div
                style={{
                  height: '50px',
                  width: barWidth,
                  backgroundColor: ratingColors[label],
                  position: 'relative',
                  borderRadius: '5px',
                }}
              >
                {/* Display rating range inside the bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ color: 'black' }}>
                    {t.ranges[index].split(' ')[0]} {/* Range part */}
                  </span>
                  <span style={{ color: 'white' }}>
                    {t.ranges[index].split(' ')[1]} {/* Label part */}
                  </span>
                </div>

                {/* Current Efficiency Marker with label */}
                {isCurrentEfficiency && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '80%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      height: '40px',
                      width: '60px',
                      backgroundColor: ratingColors[label],
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '5px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      flexDirection: 'column',
                    }}
                  >
                    <span>{t.current}</span>
                    <span>{currentEnergyEfficiency}</span>
                  </div>
                )}

                {/* Potential Efficiency Marker with label */}
                {isPotentialEfficiency && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '20%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      height: '40px',
                      width: '60px',
                      backgroundColor: ratingColors[label],
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '5px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      flexDirection: 'column',
                    }}
                  >
                    <span>{t.potential}</span>
                    <span>{potentialEnergyEfficiency}</span>
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
