import React, { useState } from "react";
import "./CustomAlgorithm.css";
import TopRatedPropertyCard from "../homePage/TopRatedPropertyCard";

// Import your university images (adjust the paths as needed)
import uniLiverpoolImg from "../assets/uni-liverpool.png";
import johnMooresImg from "../assets/john-moores.jfif";
import hopeUniImg from "../assets/hope-university.jfif";

function ExampleKnnForm() {
  const [number_bedrooms, setBedrooms] = useState(0);
  const [current_energy_rating, setEpcRating] = useState("C");
  const [property_type, setHouseType] = useState("HOUSE");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10); // default value in km
  const [recommendations, setRecommendations] = useState([]);

  // Define your university options with images, keys, and names.
  const universities = [
    {
      key: "liverpool",
      name: "University of Liverpool",
      image: uniLiverpoolImg,
    },
    {
      key: "johnmoores",
      name: "Liverpool John Moores University",
      image: johnMooresImg,
    },
    {
      key: "hope",
      name: "Liverpool Hope University",
      image: hopeUniImg,
    },
  ];

  const handleUniversitySelect = (uniKey) => {
    setSelectedUniversity(uniKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userPrefs = {
      number_bedrooms,
      current_energy_rating,
      property_type,
      selectedUniversity,
      maxDistance,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/property/knnSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPrefs),
      });
      const recommended = await response.json();
      setRecommendations(recommended);
      console.log("KNN Recommendations:", recommended);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div className="custom-algorithm-container">
      <form onSubmit={handleSubmit}>
        <label>
          Bedrooms:
          <input
            type="number"
            value={number_bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          />
        </label>
        <label>
          EPC Rating:
          <input
            type="text"
            value={current_energy_rating}
            onChange={(e) => setEpcRating(e.target.value)}
          />
        </label>
        <label>
          House Type:
          <input
            type="text"
            value={property_type}
            onChange={(e) => setHouseType(e.target.value)}
          />
        </label>

        <div className="university-selection">
          <p>Select your University:</p>
          <div className="universities">
            {universities.map((uni) => (
              <div
                key={uni.key}
                className={`university-option ${
                  selectedUniversity === uni.key ? "selected" : ""
                }`}
                onClick={() => handleUniversitySelect(uni.key)}
              >
                <img src={uni.image} alt={uni.name} />
                <p>{uni.name}</p>
                {selectedUniversity === uni.key && (
                  <div className="tick-overlay">✔</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="distance-slider">
          <p>
            How far would you like to be? {maxDistance} km
          </p>
          <input
            type="range"
            min="0"
            max="50"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {recommendations.length > 0 && (
        <div className="property-cards-container">
          {recommendations.map((property, index) => (
            <TopRatedPropertyCard key={index} property={property} language="en" />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExampleKnnForm;
