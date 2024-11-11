import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom'; 
import backgroundImage from './assets/house-bk.jpg'; 

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5002/register', {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        userType
      });
      setMessage(response.data.message);

      if (response.status === 201) {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setUserType('');

        navigate('/login'); // Redirect to the login page
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
    <div className="register-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <form className="register-form">
        <h2 className="register-title"><b>Create your EPCity Profile..</b></h2>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder="Email Address"
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
        <div className="form-group">
          <label className="form-label"></label>
          <select
            className="form-input"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="">Select User Type</option>
            <option value="student">Student</option>
            <option value="landlord">Landlord</option>
          </select>
        </div>
        <button type="button" className="register-button" onClick={handleRegister}>
          <b>Register</b>
        </button>
        {message && <p className="register-message">{message}</p>}
      </form>
    </div>
  );
}

export default Register;

