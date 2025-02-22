import React, { useState, useEffect } from "react";
import "./CitySection.css";

const initialCities = [
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
  const [cities, setCities] = useState([]);

  // Example: Generate random property counts for each city
  useEffect(() => {
    const updatedCities = initialCities.map((city) => ({
      ...city,
      propertyCount: Math.floor(Math.random() * (300000 - 100000 + 1)) + 100000,
    }));
    setCities(updatedCities);
  }, []);

  return (
    <div className="uk-cities-section">
      {/* Styled header container */}
      <div className="uk-cities-header">
        <h2 className="uk-cities-title">Explore Top UK Cities</h2>
        {/* Decorative divider bar under the heading */}
        <div className="uk-cities-divider"></div>
        <div className="uk-cities-subtitle">
          From historic streets to modern high-rises, find your perfect place to call home in the UK.
        </div>
      </div>

      {/* Grid of city cards */}
      <div className="cities-grid">
        {cities.map((city, index) => (
          <div key={index} className="city-card">
            <img src={city.image} alt={city.name} className="city-image" />
            <div className="city-overlay">
              <div className="city-info">
                <span className="city-name">{city.name}</span>
                <span className="city-count">
                  {city.propertyCount?.toLocaleString()}+ properties
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySection;







