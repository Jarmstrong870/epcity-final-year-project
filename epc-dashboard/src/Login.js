import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import './Login.css';
import backgroundImage from './assets/house-bk.jpg'; 
import eyeIcon from './assets/eye-icon.jpg'; // Import the eye icon

function Login({ setUser, language }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Translations object
  const translations = {
    en: {
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      loginButton: 'Login',
      forgotPassword: 'Forgotten Password?',
      noAccount: "Don't have an account yet?",
      registerLink: 'Register',
      errorMessage: 'An error occurred. Please try again.',
    },
    fr: {
      emailPlaceholder: 'E-mail',
      passwordPlaceholder: 'Mot de passe',
      loginButton: 'Connexion',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: "Vous n'avez pas encore de compte ?",
      registerLink: "S'inscrire",
      errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
    },
    es: {
      emailPlaceholder: 'Correo electrónico',
      passwordPlaceholder: 'Contraseña',
      loginButton: 'Iniciar sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta aún?',
      registerLink: 'Registrarse',
      errorMessage: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
    },
  };

  const t = translations[language] || translations.en; // Default to English

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
              type={showPassword ? "text" : "password"}
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
          <p>{t.noAccount} <Link to="/register">{t.registerLink}</Link></p>
        </div>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
