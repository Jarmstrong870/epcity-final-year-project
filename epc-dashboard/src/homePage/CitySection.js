import React from "react";
import "../homePage/HomePage.css"; 

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

const CitySection = () => {
  return (
    <div className="uk-cities-section">
      <h2 className="uk-cities-title">Find Your Next Dream Property</h2>
      <p className="uk-cities-subtitle">
        Explore properties in top UK cities and find the perfect home that suits your lifestyle.
      </p>
      <div className="cities-grid">
        {cities.map((city, index) => (
          <div key={index} className="city-card">
            <img src={city.image} alt={city.name} className="city-image" />
            <div className="city-overlay">
              <span className="city-name">{city.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySection;
