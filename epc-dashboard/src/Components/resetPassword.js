import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css"; 

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Get the email from VerifyOtp navigation state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email,
        newPassword,
      });

      if (response.status === 200) {
        setMessage(response.data.message || "Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect
      } else {
        setMessage(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred while resetting your password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <p>Enter your new password below.</p>
      <div className="form-group">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleResetPassword}
        className="reset-password-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Reset Password"}
      </button>
      {message && <p className="reset-password-message">{message}</p>}
    </div>
  );
}

export default ResetPassword;


