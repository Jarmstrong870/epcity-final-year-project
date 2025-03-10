import React from "react";
import PropTypes from "prop-types";
import "./ProgressMeter.css";

const categoryColors = {
  "Very Good": "#00b300", // Green
  "Good": "#66cc00",
  "Medium": "#ffcc00",
  "Poor": "#ff6600",
  "Very Poor": "#ff0000", // Red
};

const categoryPositions = {
  "Very Good": "100%",
  "Good": "75%",
  "Medium": "50%",
  "Poor": "25%",
  "Very Poor": "5%",
};

const ProgressMeter = ({ category }) => {
  const progress = categoryPositions[category] || "0%";
  const color = categoryColors[category] || "#ccc";

  const graphRadius = 40;
  const graphCircumference = 2 * Math.PI * graphRadius;
  const progressValue = (progress / 100) * graphCircumference;

  const angle = (progress / 100) * 180;

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: progress, backgroundColor: color }}>
        <span className="progress-text">{category}</span>
      </div>
    </div>
  );
};

ProgressMeter.propTypes = {
  category: PropTypes.string.isRequired,
};

export default ProgressMeter;
