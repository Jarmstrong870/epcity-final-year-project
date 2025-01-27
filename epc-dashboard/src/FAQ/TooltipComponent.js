import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({ message }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible(!visible)}
    >
      <span className="info-icon">i</span>
      {visible && <div className="tooltip-message">{message}</div>}
    </div>
  );
};

export default Tooltip;