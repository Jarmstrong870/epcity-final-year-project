import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import Tooltip from '../FAQ/TooltipComponent';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/liverpool_register.jpg';
import eyeIcon from '../assets/eye-icon.jpg';

function Register({ language }) {
  const [step, setStep] = useState(1); // Step 1: User details, Step 2: OTP verification
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0); // Countdown for OTP expiry
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Translations object
  const translations = {
    en: {
      title: 'Create your EPCity Profile..',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      password: 'Password',
      selectUserType: 'Select User Type',
      student: 'Student',
      landlord: 'Landlord',
      tooltip: 'Please tell us whether you are a Student or a Landlord. This will affect how you interact with EPCity.',
      register: 'Register',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Login',
      emailExists: 'An account with this email already exists. Please use a different email.',
      enterOtp: 'Enter the OTP sent to your email',
      otpPlaceholder: 'Enter OTP',
      verifyOtp: 'Verify OTP',
      resendOtp: 'Resend OTP',
      loading: 'Loading...',
      verifyingOtp: 'Verifying OTP...',
    },
    // Other language translations go here (e.g., `fr`, `es`)
  };

  const t = translations[language] || translations.en;

  // Handle countdown timer for OTP expiry
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Check if the email already exists in the database
  const checkEmailExists = async () => {
    if (!email) return;
    try {
      const response = await axios.post('http://localhost:5000/check-email', { email });
      setEmailExists(response.data.exists); // Update emailExists state
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  // Request an OTP for email verification
  const handleRequestOtp = async () => {
    if (!firstName || !lastName || !email || !password || !userType) {
      setMessage('All fields are required to proceed.');
      return;
    }

    if (emailExists) {
      setMessage('An account with this email already exists. Please use a different email.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/request-registration-otp', { email });
      if (response.status === 200) {
        setMessage(response.data.message); // Display success message
        setTimer(600); // Start 10-minute countdown
        setStep(2); // Move to OTP verification step
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify the OTP entered by the user
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage('Please enter the OTP to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/verify-registration-otp', { email, otp });
      if (response.status === 200) {
        handleRegister(); // Proceed to finalise registration
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while verifying OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Finalise registration after successful OTP verification
  const handleRegister = async () => {
    if (emailExists) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/register', {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        userType,
      });

      if (response.status === 201) {
        setMessage(response.data.message);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setUserType('');
        setOtp('');
        navigate('/login');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend the OTP
  const handleResendOtp = async () => {
    setMessage('');
    await handleRequestOtp();
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="content-wrapper">
        <div className="flex-container">
          <form className="register-form">
            {step === 1 && (
              <>
                <h2 className="register-title">
                  <b>{t.title}</b>
                </h2>
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
                    onBlur={checkEmailExists}
                  />
                </div>
                {emailExists && <p className="error-message">{t.emailExists}</p>}
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
                <button
                  type="button"
                  className="register-button"
                  onClick={handleRequestOtp}
                  disabled={emailExists || isLoading}
                >
                  {isLoading ? t.loading : <b>{t.register}</b>}
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="register-title">
                  <b>{t.enterOtp}</b>
                </h2>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t.otpPlaceholder}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="register-button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? t.verifyingOtp : <b>{t.verifyOtp}</b>}
                </button>
                <p className="resend-link" onClick={handleResendOtp}>
                  {t.resendOtp}
                </p>
              </>
            )}
            {message && <p className="message">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
