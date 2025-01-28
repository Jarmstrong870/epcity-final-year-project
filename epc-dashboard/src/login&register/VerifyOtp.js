import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyOtp.css";
import translations from "../locales/translations_verifyotp"; // Import translations

function VerifyOtp({ language }) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Get email from navigation state
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const t = translations[language] || translations.en; // Load translations

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [timeLeft]);

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setMessage(response.data.message);
      navigate("/reset-password", { state: { email } }); // Redirect to ResetPassword
    } catch (error) {
      setMessage(error.response?.data?.message || t.invalidOtp);
    }
  };

  // Format the timer into MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
          className="otp-input"
        />
        <button onClick={handleVerifyOtp} disabled={timeLeft === 0}>
          {timeLeft === 0 ? t.resendOtp : t.button}
        </button>
        {timeLeft > 0 && <p className="timer">{formatTime(timeLeft)}</p>}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default VerifyOtp;

