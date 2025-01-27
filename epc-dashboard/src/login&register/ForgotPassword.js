import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';
import translations from '../locales/translations_forgotpassword'; // Import translations

function ForgotPassword({ language }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const t = translations[language] || translations.en; // Load translations

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage(t.emailRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/request-reset-password', { email });
      setMessage(response.data.message || t.successMessage);
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.message || t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleForgotPassword}>
        <h2>{t.title}</h2>
        <p>{t.description}</p>

        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder={t.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="forgot-password-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? t.buttonSubmitting : t.button}
        </button>
        {message && <p className="forgot-password-message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
