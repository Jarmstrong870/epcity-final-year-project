import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyOtp.css";
import translations from "./locales/translations_verifyotp"; // Import translations

function VerifyOtp({ language }) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Get email from navigation state
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const t = translations[language] || translations.en; // Load translations

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setMessage(response.data.message);
      navigate("/reset-password", { state: { email } }); // Redirect to ResetPassword
    } catch (error) {
      setMessage(error.response?.data?.message || t.invalidOtp);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <h2>{t.title}</h2>
        <p>{t.description}</p>
        <input
          type="text"
          placeholder={t.placeholder}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerifyOtp}>{t.button}</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default VerifyOtp;
