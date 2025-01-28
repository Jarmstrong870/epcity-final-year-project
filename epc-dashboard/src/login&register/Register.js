import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import Tooltip from '../FAQ/TooltipComponent';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/liverpool_register.jpg';
import eyeIcon from '../assets/eye-icon.jpg';

function Register({ language }) {
  const [step, setStep] = useState(1); // Step 1: User details, Step 2: OTP verification
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(false); // Track if email already exists
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0); // Countdown for OTP expiry
  const navigate = useNavigate();

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
      verifyOtp: 'Verify OTP',
      resendOtp: 'Resend OTP',
    },
    fr: {
      title: 'Créez votre profil EPCity..',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      selectUserType: 'Sélectionnez le type d’utilisateur',
      student: 'Étudiant',
      landlord: 'Propriétaire',
      tooltip: 'Veuillez nous indiquer si vous êtes étudiant ou propriétaire. Cela influencera votre interaction avec EPCity.',
      register: 'S’inscrire',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      login: 'Connexion',
      emailExists: 'Un compte avec cet e-mail existe déjà. Veuillez utiliser un autre e-mail.',
      enterOtp: 'Entrez le code OTP envoyé à votre e-mail',
      verifyOtp: 'Vérifier OTP',
      resendOtp: 'Renvoyer le code OTP',
    },
    es: {
      title: 'Crea tu perfil de EPCity..',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      selectUserType: 'Seleccionar tipo de usuario',
      student: 'Estudiante',
      landlord: 'Propietario',
      tooltip: 'Por favor dinos si eres estudiante o propietario. Esto afectará cómo interactúas con EPCity.',
      register: 'Registrar',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      login: 'Iniciar Sesión',
      emailExists: 'Ya existe una cuenta con este correo electrónico. Utilice un correo diferente.',
      enterOtp: 'Introduce el OTP enviado a tu correo electrónico',
      verifyOtp: 'Verificar OTP',
      resendOtp: 'Reenviar OTP',
    },
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const checkEmailExists = async () => {
    if (!email) return;
  
    try {
      const response = await axios.post('http://localhost:5000/check-email', { email });
      setEmailExists(response.data.exists); // Update emailExists without displaying a separate message
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleRequestOtp = async () => {
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !userType) {
      setMessage('All fields are required to proceed.');
      return;
    }
  
    if (emailExists) {
      setMessage('An account with this email already exists. Please use a different email.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/request-registration-otp', { email });
      setMessage(response.data.message); // Display success or error message
  
      if (response.status === 200) {
        setTimer(600); // Start 10-minute countdown
        setStep(2); // Move to OTP verification step
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    }
  };
  

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-registration-otp', { email, otp });
      if (response.status === 200) {
        // Proceed with registration
        handleRegister();
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (emailExists) return; // Prevent registration if email exists

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
        setOtp('');
        navigate('/login');
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    }
  };

  const handleResendOtp = () => {
    setMessage('');
    handleRequestOtp();
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
  <div className="content-wrapper">
    <div className="flex-container">
      <form className="register-form">
        {/* Registration form fields remain unchanged */}
        {step === 1 && (
          <>
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
              disabled={emailExists}
            >
              <b>{t.register}</b>
            </button>
          </>
        )}
      </form>
    </div>
  </div>
</div>

  );
}

export default Register;


