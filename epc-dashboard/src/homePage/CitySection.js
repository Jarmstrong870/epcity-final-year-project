import React, { useContext } from 'react';
import "../homePage/CitySection.css";
import { PropertyContext } from '../Components/utils/propertyContext';
import { useNavigate } from 'react-router-dom';
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
    setCity(choice);
    navigate(`/propertylist`);
  };

  const t = translations[language] || translations.en;

  return (
    <div className="uk-cities-section">
      {}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <h2 className="uk-cities-title">{"\u{1F30D}"}{t.ukCitiesTitle}</h2>
        {/*<TextToSpeech text={`${t.ukCitiesTitle} ${t.ukCitiesSubtitle}`} language={language} />*/}
      </div>

      <h4 className="uk-cities-subtitle">{t.ukCitiesSubtitle}</h4>

      {/* City Cards */}
      <div className="cities-grid">
        {cities.map((city, index) => (
          <div key={index} className="city-card">
            <img src={city.image} alt={city.name} className="city-image" />
            <div className="city-overlay" onClick={() => handleCityChoice(city.value)}>
              <span className="city-name">{t.cities[city.name] || city.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="about-us-button-block">
        <h2 className="about-us-button-header"> {"\u{1F4A1}"} Unsure of where to start looking?</h2>
        <p className="about-us-paragraph">
          Visit our 'View All Properties' page to navigate through all of the 
          properties without specifying a city first 
          <button className="about-us-page-button" onClick={() => navigate("/about-us")}>
            Visit Our About Us Page
          </button>
        </p>
      </div>

    </div>
  );
};

export default CitySection;
