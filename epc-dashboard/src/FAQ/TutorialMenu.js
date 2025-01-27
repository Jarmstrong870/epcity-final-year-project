import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TutorialMenu.css';
import introVideo from '../assets/intro.mp4';
import translations from '../locales/translations_tutorialmenu';

const TutorialMenu = ({ language }) => {
  const { tutorialCategory } = useParams();

  const [t, setTranslations] = useState(translations[language] || translations.en);
  const [selectedTutorialID, setSelectedTutorialID] = useState(null);

  const checkCategory = tutorialCategory.replace(/-/g, ' ').toLowerCase();

  const tutorialOptions = {
    'home page tutorials': [
      {
        tutorialID: 1,
        title: t.homePage.welcomeTutorialTitle,
        description: t.homePage.welcomeTutorialDesc,
        link: introVideo,
      },
      {
        tutorialID: 2,
        title: t.homePage.customAlgorithmTutorialTitle,
        description: t.homePage.customAlgorithmTutorialDesc,
        link: '/video/custom-algorithm',
      },
    ],
    'properties tutorials': [
      {
        tutorialID: 3,
        title: t.properties.viewAllPropertiesTitle,
        description: t.properties.viewAllPropertiesDesc,
        link: '/video/view-all-properties',
      },
      {
        tutorialID: 4,
        title: t.properties.propertyInfoTitle,
        description: t.properties.propertyInfoDesc,
        link: '/video/property-info',
      },
      {
        tutorialID: 5,
        title: t.properties.propertyFiltersTitle,
        description: t.properties.propertyFiltersDesc,
        link: '/video/filters',
      },
    ],
    'accounts tutorials': [
      {
        tutorialID: 6,
        title: t.accounts.signUpTitle,
        description: t.accounts.signUpDesc,
        link: '/video/sign-up',
      },
      {
        tutorialID: 7,
        title: t.accounts.manageAccountTitle,
        description: t.accounts.manageAccountDesc,
        link: '/video/manage-account',
      },
      {
        tutorialID: 8,
        title: t.accounts.loginTitle,
        description: t.accounts.loginDesc,
        link: '/video/login',
      },
      {
        tutorialID: 9,
        title: t.accounts.favouritesTitle,
        description: t.accounts.favouritesDesc,
        link: '/video/favourites',
      },
      {
        tutorialID: 10,
        title: t.accounts.passwordRecoveryTitle,
        description: t.accounts.passwordRecoveryDesc,
        link: '/video/password-recovery',
      },
    ],
  };

  const availableTutorials = tutorialOptions[checkCategory] || [];

  // Update translations dynamically when the language changes
  useEffect(() => {
    setTranslations(translations[language] || translations.en);
  }, [language]);

  // Update the selected tutorial dynamically when language or selected ID changes
  const selectedTutorial = availableTutorials.find(
    (tutorial) => tutorial.tutorialID === selectedTutorialID
  );

  useEffect(() => {
    if (availableTutorials.length > 0 && selectedTutorialID === null) {
      setSelectedTutorialID(availableTutorials[0].tutorialID);
    }
  }, [availableTutorials, selectedTutorialID]);

  return (
    <div className="tutorialMenu">
      {/* Navigation sidebar */}
      <div className="navigationSidebar">
        <h3>{t.categories[checkCategory]}</h3>

        {/* List all available tutorials for the category */}
        {availableTutorials.map((tutorial) => (
          <div
            key={tutorial.tutorialID}
            onClick={() => setSelectedTutorialID(tutorial.tutorialID)}
            className={`navigationBarElement ${
              selectedTutorialID === tutorial.tutorialID ? 'selected' : ''
            }`}
          >
            {tutorial.title}
          </div>
        ))}
        {availableTutorials.length === 0 && <p className="errorMessage">{t.errorNoTutorials}</p>}
      </div>

      {/* Main Page view */}
      <div className="contentView">
        <div className="titleStyle">
          <h3>{selectedTutorial?.title || t.noTutorialSelected}</h3>
        </div>

        {/* Tutorial description */}
        <p className="descriptionStyle">{selectedTutorial?.description || t.chooseTutorial}</p>

        {/* Video player for the selected tutorial */}
        {selectedTutorial?.link && (
          <video src={selectedTutorial.link} controls className="tutorialVideos" />
        )}
      </div>
    </div>
  );
};

export default TutorialMenu;
