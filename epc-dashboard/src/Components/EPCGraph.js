import React from 'react';

const EPCGraph = ({ currentEnergyEfficiency, potentialEnergyEfficiency }) => {
  // Define the color ranges for EPC ratings with a darker yellow for 'D'
  const ratingColors = {
    A: '#006400', // Dark green
    B: '#228B22', // Green
    C: '#32CD32', // Light green
    D: '#FFD700', // Darkened yellow for better contrast
    E: '#FF8C00', // Orange
    F: '#FF4500', // Red-orange
    G: '#B22222', // Dark red
  };

  // Rating labels and corresponding thresholds (percentages)
  const ratingLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const thresholds = [92, 81, 69, 55, 39, 21, 1]; // Lower bounds for the ratings
  const ranges = [
    '(92+) A', '(81-91) B', '(69-80) C', '(55-68) D', 
    '(39-54) E', '(21-38) F', '(1-20) G'
  ]; // Boundaries to display inside the bars

  // Function to determine which section the energy efficiency falls into
  const getEfficiencyPosition = (efficiency) => {
    for (let i = 0; i < thresholds.length; i++) {
      if (efficiency >= thresholds[i]) {
        return i;
      }
    }
    return 6; // Default to the lowest section (G)
  };

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <h3>EPC Rating Graph</h3>

      {/* EPC Rating Bars */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        {ratingLabels.map((label, index) => {
          const barWidth = '90%'; // Increase bar width to 90% of the container
          const isCurrentEfficiency = getEfficiencyPosition(currentEnergyEfficiency) === index;
          const isPotentialEfficiency = getEfficiencyPosition(potentialEnergyEfficiency) === index;

          // The position for the text inside the square will be fixed, centered in the bar
          const currentPosition = '50%'; // Centered position for the text
          const potentialPosition = '50%'; // Centered position for the text

          return (
            <div 
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'flex-start', // Align bars to the left
                alignItems: 'center',
                marginBottom: '10px',
                position: 'relative',
              }}
            >
              {/* The bar itself */}
              <div
                style={{
                  height: '50px', // Increased height for wider bars
                  width: barWidth,
                  backgroundColor: ratingColors[label],
                  position: 'relative',
                  borderRadius: '5px',
                }}
              >
                {/* Display boundaries inside the bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px', // Move text to the left side of the bar
                    transform: 'translateY(-50%)',
                    color: 'black', // Black color for range text
                    fontWeight: 'bold',
                    fontSize: '20px', // Increased font size
                    textAlign: 'left',
                  }}
                >
                  {/* Split the range and letter for different styling */}
                  <span style={{ color: 'black' }}>
                    {ranges[index].split(' ')[0]} {/* Range part */}
                  </span>
                  <span style={{ color: 'white' }}>
                    {ranges[index].split(' ')[1]} {/* Letter part */}
                  </span>
                </div>

                {/* Current Efficiency Marker - Square icon with the percentage */}
                {isCurrentEfficiency && (
                  <div
                    style={{
                      position: 'absolute',
                      left: currentPosition, // Fixed position at center
                      top: '50%',
                      transform: 'translate(-50%, -50%)', // Centering the square marker
                      height: '40px', // Increased size of the square icon
                      width: '40px', // Same width for square
                      backgroundColor: ratingColors[label], // Match the bar's color
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '5px', // Rounded corners for the square
                      color: 'white',
                      fontSize: '16px', // Increased font size for percentage inside square
                      fontWeight: 'bold', // Bold text inside the square
                    }}
                  >
                    {currentEnergyEfficiency}%
                  </div>
                )}

                {/* Potential Efficiency Marker - Square icon with the percentage */}
                {isPotentialEfficiency && (
                  <div
                    style={{
                      position: 'absolute',
                      left: potentialPosition, // Fixed position at center
                      top: '50%',
                      transform: 'translate(-50%, -50%)', // Centering the square marker
                      height: '40px', // Increased size of the square icon
                      width: '40px', // Same width for square
                      backgroundColor: ratingColors[label], // Match the bar's color
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '5px', // Rounded corners for the square
                      color: 'white',
                      fontSize: '16px', // Increased font size for percentage inside square
                      fontWeight: 'bold', // Bold text inside the square
                    }}
                  >
                    {potentialEnergyEfficiency}%
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
