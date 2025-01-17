import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setMessage(response.data.message || 'If the email exists, a reset link has been sent.');
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
        <p>Enter your email address below, and we'll send you a link to reset your password.</p>

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
          {isSubmitting ? 'Submitting...' : 'Send Reset Link'}
        </button>
        {message && <p className="forgot-password-message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
