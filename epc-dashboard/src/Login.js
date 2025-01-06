import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';
import backgroundImage from './assets/house-bk.jpg'; 


function Login({ setUser }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigation after login

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      setMessage(response.data.message);

      if (response.status === 200) {
        // Set the user information in the state
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
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" className="login-button" onClick={handleLogin}>
          <b>Login</b>
        </button>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;

