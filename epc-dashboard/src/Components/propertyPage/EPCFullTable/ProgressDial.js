import React from "react";
import PropTypes from "prop-types";
import "./ProgressMeter.css";

const insulationRange = {
    "Very Good": {value: 90, color: "#00b300"},
    "Good": {value: 70, color: "#66cc00"},
    "Moderate": {value: 50, color: "#ffcc00"},
    "Poor": {value: 30, color: "#ff6600"},
    "Very Poor": {value: 10, color: "#ff0000"}
};

const ProgressDial = ({ group }) => {
  const efficiencyCategory = insulationRange[group] || {value: 0, color: "#ccc"};
  const {value, color} = efficiencyCategory;

  return (
    <div className="dial-container">
        <svg width="120" height="70" viewBox="0 0 120 70">
            <path d="M 10, 60 A 50, 50 0 0, 1 110, 60" stroke = "#ddd" strokeWidth="10" fill="none"/>
            
            <path d="M 10, 60 A 50, 50 0 0, 1 110, 60" 
                  stroke = {color} strokeWidth="10" fill="none" 
                  strokeDasharray="157"
                  strokeDashoffset={(157 * (1 - value / 100))}/>
        
            <line x1="60" y1="60" x2="60" y2="20" 
              stroke = {color} strokeWidth="4" transform={`rotate(${value-90} 60 60)`} />
        
        </svg>
        <div className="progress-text">{group}</div>
      </div>
  );
};

ProgressDial.propTypes = {
  group: PropTypes.string.isRequired,
};

export default ProgressDial;
