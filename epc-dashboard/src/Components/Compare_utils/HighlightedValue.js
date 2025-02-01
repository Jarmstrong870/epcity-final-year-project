import React from "react";
import "./HighlightedValue.css";

/**
 * Component for displaying a highlighted table cell.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.value - The value to display inside the table cell.
 * @param {boolean} props.isBest - Whether the value is the best among the compared properties.
 * @returns {JSX.Element} - A table cell element.
 */
const HighlightedValue = ({ value, isBest }) => {
  return (
    <td className={isBest ? "highlight-green" : ""}>
      {value || "N/A"}
    </td>
  );
};

export default HighlightedValue;
