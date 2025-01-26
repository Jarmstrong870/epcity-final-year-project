import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./resetPassword.css";
import translations from "./locales/translations_resetpassword"; // Import translations

function ResetPassword({ language }) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Get the email from VerifyOtp navigation state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[language] || translations.en; // Load translations

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage(t.allFieldsRequired);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(t.passwordsDoNotMatch);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email,
        newPassword,
      });

      if (response.status === 200) {
        setMessage(response.data.message || t.resetSuccess);
        setTimeout(() => navigate("/login"), 2000); // Redirect to login
      } else {
        setMessage(response.data.message || t.resetFailure);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || t.resetError
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>{t.title}</h2>
        <p>{t.description}</p>
        <input
          type="password"
          placeholder={t.newPasswordPlaceholder}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder={t.confirmPasswordPlaceholder}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleResetPassword}
          className="reset-password-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? t.resetButtonSubmitting : t.resetButton}
        </button>
        {message && <p className="reset-password-message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
