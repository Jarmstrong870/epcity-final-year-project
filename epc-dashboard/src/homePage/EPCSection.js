import React from 'react';
import './EPCSection.css';
import epcGraphImg from '../assets/epc-image.jpg';
import translations from '../locales/translations_epcsection';

const EPCSection = ({ language }) => {

  const epcInformationVideo = (videoId) => {
      window.open(`https://www.youtube.com/embed/${videoId}`,
        "EPC Information Youtube Video",
        "width = 600, height = 400, scrollbars = no"
      )  
  };

  const t = translations[language] || translations.en;  // Load translations

  return (
    <div className="epc-section">
      <div className="epc-section__left">
        <img 
          src={epcGraphImg} 
          alt="EPC Graph" 
          className="epc-section__image" 
        />
      </div>
      <div className="epc-section__right">
        <div className="epc-question-block">
          <h2>{t.whatIsEPC}</h2>
          <p>
            {t.epcDescription}
          </p>
        </div>

        <div className="epc-question-block">
          <h2>{t.whatDoWeDo}</h2>
          <p>
            {t.epcCityDescription}
          </p>
        </div>

        <div className="epc-question-block">
          <h2>{t.learnMoreAboutEPCs}</h2>
          <p>
            <button className="epcVideoButton" onClick={() => epcInformationVideo("4JuAytTMO-Q")}>
              {t.findOutMoreButton}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default EPCSection;
