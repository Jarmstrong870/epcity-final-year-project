import React from "react";
import PropTypes from "prop-types";
import "./ProgressMeter.css";

const insulationRanges = {
  "Unspecified Value": {value: "0%", color: "#9200000"}, // Green
  "Limited Insulation (<100mm)": {value: "10%", color: "#00b30"},
  "Partial Insulation (100-199mm)": {value: "30%", color: "#ff6600"},
  "Moderate Insulation (200-299mm)": {value: "50%", color: "#ffcc00"},
  "Well Insulated (300-399mm)": {value: "70%", color: "#00b300"}, // Red
  "Very Well Insulated (400mm+)": {value: "90%", color: "#7d7c7c"}, // Red
};

const InsulationMeter = ({ valueRange }) => {
  const {value, color} = insulationRanges[valueRange] || {value: "0%", color: "#ccc"};

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: value, backgroundColor: color }}>
        <span className="progress-text">{valueRange}</span>
      </div>
    </div>
  );
};

InsulationMeter.propTypes = {
  valueRange: PropTypes.string.isRequired,
};

export default InsulationMeter;
