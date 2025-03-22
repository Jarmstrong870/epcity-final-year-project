import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tutorials.css';
import translationsTutorials from '../locales/translations_tutorials'; // Import translations
import homepage from '../assets/homepage.jpg';
import properties from '../assets/house_bkc.jpg';
import account from '../assets/account.png';

const Tutorials = ({ language }) => {
  const t = translationsTutorials[language] || translationsTutorials.en; // Fetch translations based on language
  const navigate = useNavigate();

  const tutorialOptions = {
    [t.homePageTutorials]: {
      path: 'home-page-tutorials',
      image: homepage,
    },
    [t.propertiesTutorials]: {
      path: 'properties-tutorials',
      image: properties,
    },
    [t.accountTutorials]: {
      path: 'accounts-tutorials',
      image: account,
    },
  };

  return (
    <div className="tutorials-base">
      <div className="sidebar-header">
        <button className="back-to-menu" onClick={() => navigate(-1)}>
          ← {t.backToProperties || "Back to Menu"}
        </button>
        </div>
      <div className="faq-options-header">
        <h2 className="tutorials-title">{t.title}</h2>
        <p className="tutorials-subtitle">{t.description}</p>

    </div>

      <div className="tutorialGrid">
        {Object.entries(tutorialOptions).map(([title, { path, image }]) => (
          <div
            key={path}
            className="tutorialCard"
            onClick={() => navigate(`/tutorials/${path}`)}
            style={{
              backgroundImage: `url(${image})`
            }}
          >
            <h2 className="tutorial-title">{title}</h2>
          <div className="tutorial-watch-base">
            <span className="tutorial-watch"> {"\u{1F50E}"} Watch Now! </span>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
