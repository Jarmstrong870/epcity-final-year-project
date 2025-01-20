import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Use navigate for routing

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/request-reset-password', { email });
      setMessage(response.data.message || 'If the email exists, a link with a one-time passcode has been sent.');
      // Navigate to VerifyOtp page and pass the email as state
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'An error occurred. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleForgotPassword}>
        <h2>Forgot Your Password?</h2>
        <p>Enter your email address below, and we'll send you a one-time code to reset your password.</p>

        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="forgot-password-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Send One-Time Code'}
        </button>
        {message && <p className="forgot-password-message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;

