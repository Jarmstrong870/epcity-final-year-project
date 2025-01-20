import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import Tooltip from './Components/TooltipComponent'; // Import your custom Tooltip component
import { useNavigate, Link } from 'react-router-dom'; 
import backgroundImage from './assets/house_bkc.jpg'; // Import the background image
import eyeIcon from './assets/eye-icon.jpg'; // Import the eye icon

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
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
      <div>
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
              alt="Show Password"
              className="toggle-password-icon"
              onMouseEnter={() => setShowPassword(true)} // Show password on hover
              onMouseLeave={() => setShowPassword(false)} // Hide password when hover ends
            />
          </div>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <select
                className="form-input"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="landlord">Landlord</option>
              </select>
              <Tooltip message="Please tell us whether you are a Student or a Landlord. This will affect how you interact with EPCity." />
            </div>
          </div>
          <button type="button" className="register-button" onClick={handleRegister}>
            <b>Register</b>
          </button>
          {message && <p className="register-message">{message}</p>}

          {/* New text below the register button */}
          <div className="login-redirect">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;



