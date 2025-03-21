import React from "react";
import "./actionMessagePopUp.css";

const ActionMessagePopUp = ({ openStatus, title, messageContents, closeStatus, submitStatus, submitMessage }) => {
  if (!openStatus) return null;

  return (
   <div className="action-popup-base">
        <div className="action-popup-container">
            <button className="action-popup-close-button" onClick={closeStatus}>X</button>

            <h3 className="action-popup-title">{title}</h3>
            <p className="action-popup-message-content">{messageContents}</p>

            <div className="action-popup-buttons">
                <button className="action-cancel-popup-button" onClick={closeStatus}>Cancel</button>
                {submitStatus && (
                <button className="action-submit-popup-button" onClick={submitStatus}>{submitMessage || "Yes"}</button>
                )}
            </div>
        </div>
    </div>
  );
};
export default ActionMessagePopUp;

