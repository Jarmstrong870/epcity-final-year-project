import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import backgroundImage from '../assets/liverpool_login.jpg';
import eyeIcon from '../assets/eye-icon.jpg'; // Import the eye icon
import translations from '../locales/translations_login'; // Import translations

function Login({ setUser, language }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false); // State for success message
  const navigate = useNavigate();

  const t = translations[language] || translations.en; // Load translations

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/login', { email, password });

        if (response.status === 200) {
            const { firstname, lastname, is_admin } = response.data;

            setUser({
                firstname,
                lastname,
                email,
                isAdmin: is_admin,  // Store admin status
            });

            // Set different messages based on user type
            if (is_admin) {
                setMessage('Login successful, welcome back, Admin!');
            } else {
                setMessage('Login successful, welcome back!');
            }

            setSuccess(true); // Set success state to true

            setTimeout(() => {
                // Redirect based on user type
                navigate(is_admin ? '/admin-dashboard' : '/');
            }, 1000);
        }
    } catch (error) {
        setSuccess(false); // Reset success state
        if (error.response) {
            setMessage(error.response.data.message);
        } else {
            setMessage(t.errorMessage); // Use translated error message
        }
    }
};

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form className="login-form">
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder={t.emailPlaceholder} // Translated placeholder
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder={t.passwordPlaceholder} // Translated placeholder
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={eyeIcon}
              alt="Toggle visibility"
              className="toggle-password-icon"
              onMouseEnter={() => setShowPassword(true)} // Show password on hover
              onMouseLeave={() => setShowPassword(false)} // Hide password when hover ends
            />
          </div>
        </div>
        <div className="forgot-password">
          <Link to="/forgot-password">{t.forgotPassword}</Link>
        </div>
        <button type="button" className="login-button" onClick={handleLogin}>
          <b>{t.loginButton}</b>
        </button>
        <div className="register-redirect">
          <p>
            {t.noAccount} <Link to="/register">{t.registerLink}</Link>
          </p>
        </div>
        {message && (
          <p className={`login-message ${success ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
