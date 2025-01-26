import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyOtp.css';
function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ''; // Get email
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      setMessage(response.data.message);
      navigate('/reset-password', { state: { email } }); // Redirect to ResetPassword 
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid OTP.');
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <h2>Verify OTP</h2>
        <p>An OTP has been sent to your email.</p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerifyOtp}>Verify</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default VerifyOtp;
