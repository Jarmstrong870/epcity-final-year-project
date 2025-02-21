import React, { useContext } from 'react';
import "../homePage/CitySection.css"; 
import { PropertyContext } from '../Components/utils/propertyContext';
import { useNavigate } from 'react-router-dom';

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

const CitySection = () => {
  const { setCity } = useContext(PropertyContext);
  const navigate = useNavigate();
  

  const handleCityChoice = (choice) => {
    setCity(choice)
    navigate(`/propertylist`);
  };

  return (
    <div className="uk-cities-section">
      <h2 className="uk-cities-title">Find Your Next Dream Property in the UK</h2>
      <div className="cities-grid">
        {cities.map((city, index) => (
          <div key={index} className="city-card">
            <img src={city.image} alt={city.name} className="city-image" />
            <div className="city-overlay" onClick={() => handleCityChoice(city.value)}>
              <span className="city-name">{city.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySection;
