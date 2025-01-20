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
    <div>
      <h2 className="stylingTitle">{t.title}</h2>
      <p>{t.description}</p>
      <div className="tutorialGrid">
        {Object.entries(tutorialOptions).map(([title, { path, image }]) => (
          <div
            key={path}
            className="tutorialCard"
            onClick={() => navigate(`/tutorials/${path}`)}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#ffffff',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            <h3>{title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
