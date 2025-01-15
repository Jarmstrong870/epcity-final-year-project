import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import './Login.css';
import backgroundImage from './assets/house-bk.jpg'; 
import eyeIcon from './assets/eye-icon.jpg'; // Import the eye icon

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      setMessage(response.data.message);

      if (response.status === 200) {
        setUser({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email,
        });
        navigate('/'); // Redirect to the home page
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again.');
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="Password"
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
          <Link to="/forgot-password">Forgotten Password?</Link>
        </div>
        <button type="button" className="login-button" onClick={handleLogin}>
          <b>Login</b>
        </button>
        <div className="register-redirect">
          <p>Don't have an account yet? <Link to="/register">Register</Link></p>
        </div>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;




