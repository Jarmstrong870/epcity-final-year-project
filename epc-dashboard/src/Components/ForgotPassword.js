import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword({ language }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Translations object
  const translations = {
    en: {
      title: 'Forgot Your Password?',
      description: "Enter your email address below, and we'll send you a one-time code to reset your password.",
      placeholder: 'Enter your email',
      buttonSubmitting: 'Submitting...',
      button: 'Send One-Time Code',
      emailRequired: 'Please enter your email.',
      successMessage: 'If the email exists, a link with a one-time passcode has been sent.',
      errorMessage: 'An error occurred. Please try again later.',
    },
    fr: {
      title: 'Mot de passe oublié ?',
      description: "Entrez votre adresse e-mail ci-dessous et nous vous enverrons un code unique pour réinitialiser votre mot de passe.",
      placeholder: 'Entrez votre e-mail',
      buttonSubmitting: 'Envoi en cours...',
      button: 'Envoyer un code unique',
      emailRequired: 'Veuillez entrer votre e-mail.',
      successMessage: "Si l'e-mail existe, un lien avec un code unique a été envoyé.",
      errorMessage: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    },
    es: {
      title: '¿Olvidaste tu contraseña?',
      description: 'Ingresa tu dirección de correo electrónico a continuación y te enviaremos un código único para restablecer tu contraseña.',
      placeholder: 'Ingresa tu correo electrónico',
      buttonSubmitting: 'Enviando...',
      button: 'Enviar código único',
      emailRequired: 'Por favor, ingresa tu correo electrónico.',
      successMessage: 'Si el correo electrónico existe, se ha enviado un enlace con un código único.',
      errorMessage: 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.',
    },
  };

  const t = translations[language] || translations.en;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage(t.emailRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/request-reset-password', { email });
      setMessage(response.data.message || t.successMessage);
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.message || t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleForgotPassword}>
        <h2>{t.title}</h2>
        <p>{t.description}</p>

        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder={t.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="forgot-password-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? t.buttonSubmitting : t.button}
        </button>
        {message && <p className="forgot-password-message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
