import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import Tooltip from './FAQ/TooltipComponent';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from './assets/house_bkc.jpg';
import eyeIcon from './assets/eye-icon.jpg';
import translations from './locales/translations_register'; // Import translations

function Register({ language }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const t = translations[language] || translations.en; // Load translations

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        userType,
      });
      setMessage(response.data.message);

      if (response.status === 201) {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setUserType('');
        navigate('/login');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || t.errorMessage);
    }
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <form className="register-form">
        <h2 className="register-title"><b>{t.title}</b></h2>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder={t.firstName}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder={t.lastName}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={eyeIcon}
              alt="Show Password"
              className="toggle-password-icon"
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
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
              <option value="">{t.selectUserType}</option>
              <option value="student">{t.student}</option>
              <option value="landlord">{t.landlord}</option>
            </select>
            <Tooltip message={t.tooltip} />
          </div>
        </div>
        <button type="button" className="register-button" onClick={handleRegister}>
          <b>{t.register}</b>
        </button>
        {message && <p className="register-message">{message}</p>}

        <div className="login-redirect">
          <p>{t.alreadyHaveAccount} <Link to="/login">{t.login}</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Register;
