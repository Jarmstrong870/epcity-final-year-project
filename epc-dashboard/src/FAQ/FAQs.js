import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQ.css';
import translations from '../locales/translations_faq'; // Import translations

const FAQ = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language] || translations.en; // Load translations

  return (
    <div>
      <h2 className="stylingTitle">{t.title}</h2>
      <div className="homePageGrid">
        {t.faqList.map((element, index) => (
          <div
            key={index}
            className="propertyCard"
            onClick={() => navigate(element.path)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{element.title}</h3>
            <p>{element.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
