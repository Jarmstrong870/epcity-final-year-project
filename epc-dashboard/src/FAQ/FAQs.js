import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQ.css';
import translations from '../locales/translations_faq'; // Import translations

const FAQ = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language] || translations.en; // Load translations

  return (
    <div className="faq-base">
      <h2 className="stylingTitle">{t.title}</h2>
      <div className="homePageGrid">
        {t.faqList.map((element, index) => (
          <div key={index} className="propertyCard"> 
            <h3 className="faq-title">{element.title}</h3>
            <p>{element.description}</p>

            <button className="faqButton" onClick={() => navigate(element.path)}>
              {"Find Out More"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
