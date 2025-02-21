import React from "react";
import "../homePage/CitySection.css";
import TextToSpeech from "../Components/utils/TextToSpeech";
import translations from "../locales/translations_homepage";

const cities = [
  { name: "Liverpool", image: require("../assets/cities/liverpool.jpg") },
  { name: "Leeds", image: require("../assets/cities/leeds.jpg") },
  { name: "Manchester", image: require("../assets/cities/manchester.jpg") },
  { name: "Bristol", image: require("../assets/cities/bristol.jpg") },
  { name: "Sheffield", image: require("../assets/cities/sheffield.jpeg") },
  { name: "Birmingham", image: require("../assets/cities/birmingham.jpg") },
  { name: "Brighton", image: require("../assets/cities/brighton.jpg") },
  { name: "Newcastle", image: require("../assets/cities/newcastle.jpg") },
  { name: "Southampton", image: require("../assets/cities/southampton.jpeg") },
];

const CitySection = ({ language }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="uk-cities-section">
      {/* Title with Microphone */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <h2 className="uk-cities-title">{t.ukCitiesTitle}</h2>
        <TextToSpeech text={`${t.ukCitiesTitle} ${t.ukCitiesSubtitle}`} language={language} />
      </div>

      <p className="uk-cities-subtitle">{t.ukCitiesSubtitle}</p>

      {/* City Cards */}
      <div className="cities-grid">
        {cities.map((city, index) => (
          <div key={index} className="city-card">
            <img src={city.image} alt={city.name} className="city-image" />
            <div className="city-overlay">
              <span className="city-name">{t.cities[city.name] || city.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySection;
