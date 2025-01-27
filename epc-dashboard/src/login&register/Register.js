import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import Tooltip from './FAQ/TooltipComponent';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from './assets/house_bkc.jpg';
import eyeIcon from './assets/eye-icon.jpg';

function Register({ language }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
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
    },
  };

  const t = translations[language] || translations.en;

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
    </div>
  );
}

export default Register;
