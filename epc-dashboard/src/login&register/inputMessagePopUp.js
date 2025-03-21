import { useState, useEffect } from "react";
import "./inputMessagePopUp.css";

const InputMessagePopUp = ({ openStatus, title, userInputs, closeStatus, submitStatus, submitMessage }) => {
  const [inputValues, setInputValues] = useState({});

  // Reset inputs when the popup opens
  useEffect(() => {
    if (openStatus) {
      const originalValues = {};
      userInputs.forEach((input) => {
        originalValues[input.label] = "";
      });
      setInputValues(originalValues);
    }
  }, [openStatus, userInputs]); 

  // Update state when user types
  const handleInputChange = (label, value) => {
    setInputValues((prev) => ({ ...prev, [label]: value }));
  };

  // Submit function with updated values
  const handleSubmit = () => {
    userInputs.forEach((input) => input.onChange?.(inputValues[input.label])); 
    submitStatus?.(inputValues);
    closeStatus(); // Close and reset
  };

  if (!openStatus) return null; // Prevent rendering when closed

  return (
    <div className="input-popup-base">
      <div className="input-popup-container">
        <button className="input-popup-close-button" onClick={closeStatus}>X</button>
        <h3 className="input-popup-title">{title}</h3>

        <div className="input-popup-method-inputs">
          {userInputs.map((input, index) => (
            <div key={index} className="input-popup-input-base">
              <label>{input.label}</label>
              <input
                type="text"
                placeholder={input.placeholder}
                value={inputValues[input.label] ?? ""}
                onChange={(e) => handleInputChange(input.label, e.target.value)}
                className="input-popup-user-input"
              />
            </div>
          ))}
        </div>

        <div className="input-popup-buttons">
          <button className="input-cancel-popup-button" onClick={closeStatus}>Cancel</button>
          <button className="input-submit-popup-button" onClick={handleSubmit}>
            {submitMessage || "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputMessagePopUp;