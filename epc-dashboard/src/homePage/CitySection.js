import React, { useContext } from 'react';
import "../homePage/CitySection.css";
import { PropertyContext } from '../Components/utils/propertyContext';
import { useNavigate } from 'react-router-dom';
import TextToSpeech from "../Components/utils/TextToSpeech";
import translations from "../locales/translations_homepage";

const cities = [
  { name: "Liverpool", image: require("../assets/cities/liverpool.jpg"), value: "E08000012" },
  { name: "Leeds", image: require("../assets/cities/leeds.jpg"), value: "E08000035" },
  { name: "Manchester", image: require("../assets/cities/manchester.jpg"), value: "E08000003" },
  { name: "Bristol", image: require("../assets/cities/bristol.jpg"), value: "E06000023" },
  { name: "Sheffield", image: require("../assets/cities/sheffield.jpeg"), value: "E08000019" },
  { name: "Birmingham", image: require("../assets/cities/birmingham.jpg"), value: "E08000025" },
  { name: "Brighton", image: require("../assets/cities/brighton.jpg"), value: "E06000043" },
  { name: "Newcastle", image: require("../assets/cities/newcastle.jpg"), value: "E08000021" },
  { name: "Southampton", image: require("../assets/cities/southampton.jpeg"), value: "E06000045" },
];

const CitySection = ({ language }) => {
  const { setCity } = useContext(PropertyContext);
  const navigate = useNavigate();
  

  const handleCityChoice = (choice) => {
    setCity(choice)
    navigate(`/propertylist`);
  };

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
<<<<<<< HEAD
            <div className="city-overlay">
              <div className="city-info">
                <span className="city-name">{city.name}</span>
                <span className="city-count">
                  {city.propertyCount?.toLocaleString()}+ properties
                </span>
              </div>
=======
            <div className="city-overlay" onClick={() => handleCityChoice(city.value)}>
              <span className="city-name">{t.cities[city.name] || city.name}</span>
>>>>>>> 19e3f3909a6b9bae80f0a6ca1f0e4ff305ef6d0f
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySection;







