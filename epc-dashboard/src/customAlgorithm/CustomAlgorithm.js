import React, { useState, useEffect } from "react";
import "./CustomAlgorithm.css";
import PropertyCard from "../homePage/PropertyCard";

// University images for Liverpool
import uniLiverpoolImg from "../assets/Universities/university-of-liverpool.jpg";
import johnMooresImg from "../assets/Universities/liverpool-john-moores-university.jpg";
import hopeUniImg from "../assets/Universities/liverpool-hope-university.jpg";

// University images for Bristol
import bristolUni from "../assets/Universities/university-of-bristol.jpg";
import uweBristol from "../assets/Universities/uwe-bristol.jpg";

// University images for Brighton
import brightonUni from "../assets/Universities/university-of-brighton.jpg";
import sussexUni from "../assets/Universities/university-of-sussex.jpg";

// University images for Southampton
import southamptonUni from "../assets/Universities/university-of-southampton.jpg";
import solentUni from "../assets/Universities/solent-university-southampton.jpg";

// University images for Manchester
import manchesterUni from "../assets/Universities/university-of-manchester.jpg";
import manchesterMet from "../assets/Universities/manchester-metropolitan-university.jpg";

// University images for Sheffield
import sheffieldUni from "../assets/Universities/sheffield-of-university.jpg";
import sheffieldHallam from "../assets/Universities/sheffield-hallam-university.jpg";

// University images for Newcastle
import newcastleUni from "../assets/Universities/newcastle-university.jpg";
import northumbriaUni from "../assets/Universities/northumbria-university.jpg";

// University images for Birmingham
import birminghamUni from "../assets/Universities/university-of-birmingham.jpg";
import birminghamCity from "../assets/Universities/birmingham-city-university.jpg";

// University images for Leeds
import leedsUni from "../assets/Universities/university-of-leeds.jpg";
import leedsBeckett from "../assets/Universities/leeds-beckett-university.jpg";

import apartmentImg from "../assets/property types/apartment.png";
import bungalowImg from "../assets/property types/bungalow.png";
import houseImg from "../assets/property types/house.png";
import maisonetteImg from "../assets/property types/maisonette.png";

function CustomAlgorithm({ closePopUp }) {
  // Form states
  const [selectedLocalAuthority, setSelectedLocalAuthority] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [number_bedrooms, setBedrooms] = useState(0);
  const [current_energy_rating, setEpcRating] = useState("C");
  const [property_type, setHouseType] = useState("HOUSE");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedRating, setSelectedEPCRating] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Define your local authorities.
  const localAuthorities = [
    { key: "E06000023", name: "Bristol" },
    { key: "E06000043", name: "Brighton" },
    { key: "E06000045", name: "Southampton" },
    { key: "E08000003", name: "Manchester" },
    { key: "E08000012", name: "Liverpool" },
    { key: "E08000019", name: "Sheffield" },
    { key: "E08000021", name: "Newcastle" },
    { key: "E08000025", name: "Birmingham" },
    { key: "E08000035", name: "Leeds" },
  ];

  // Map each local authority to its universities.
  const universitiesByCity = {
    "E08000012": [
      { key: "liverpool", name: "University of Liverpool", image: uniLiverpoolImg },
      { key: "johnmoores", name: "Liverpool John Moores University", image: johnMooresImg },
      { key: "hope", name: "Liverpool Hope University", image: hopeUniImg },
    ],
    "E06000023": [
      { key: "bristolUni", name: "University of Bristol", image: bristolUni },
      { key: "uweBristol", name: "UWE Bristol", image: uweBristol },
    ],
    "E06000043": [
      { key: "brightonUni", name: "University of Brighton", image: brightonUni },
      { key: "sussexUni", name: "University of Sussex", image: sussexUni },
    ],
    "E06000045": [
      { key: "southamptonUni", name: "University of Southampton", image: southamptonUni },
      { key: "solentUni", name: "Solent University", image: solentUni },
    ],
    "E08000003": [
      { key: "manchesterUni", name: "University of Manchester", image: manchesterUni },
      { key: "manchesterMet", name: "Manchester Metropolitan University", image: manchesterMet },
    ],
    "E08000019": [
      { key: "sheffieldUni", name: "University of Sheffield", image: sheffieldUni },
      { key: "sheffieldHallam", name: "Sheffield Hallam University", image: sheffieldHallam },
    ],
    "E08000021": [
      { key: "newcastleUni", name: "Newcastle University", image: newcastleUni },
      { key: "northumbriaUni", name: "Northumbria University", image: northumbriaUni },
    ],
    "E08000025": [
      { key: "birminghamUni", name: "University of Birmingham", image: birminghamUni },
      { key: "birminghamCity", name: "Birmingham City University", image: birminghamCity },
    ],
    "E08000035": [
      { key: "leedsUni", name: "University of Leeds", image: leedsUni },
      { key: "leedsBeckett", name: "Leeds Beckett University", image: leedsBeckett },
    ],
  };

  const universities = selectedLocalAuthority ? universitiesByCity[selectedLocalAuthority] || [] : [];

  // Handle local authority selection: clear previously selected university if any.
  const handleLocalAuthorityChange = (e) => {
    setSelectedLocalAuthority(e.target.value);
    setSelectedUniversity(null);
  };

  const handleUniversitySelect = (uniKey) => {
    setSelectedUniversity(uniKey);
  };

  const handlePropertyType = (propertyKey) => {
    setSelectedProperty(propertyKey);
  };

  const handleEPCRating = (ratingKey) => {
    setEpcRating(ratingKey);
    setSelectedEPCRating(ratingKey);
  };

  const reverseEPCMapping = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'N/A'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userPrefs = {
      number_bedrooms,
      current_energy_rating,
      property_type,
      selectedUniversity,
      maxDistance,
      local_authority: selectedLocalAuthority,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/property/knnSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPrefs),
      });
      const recommended = await response.json();

      const convertedRecommendations = recommended.map(property => ({
        ...property,
        current_energy_rating: reverseEPCMapping[property.current_energy_rating] || property.current_energy_rating
      }));

      setRecommendations(convertedRecommendations);
      console.log("KNN Recommendations:", convertedRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setHasSearched(true);
      setIsLoading(false);
    }
  };

  // Scroll into view when loading finishes and recommendations are available.
  useEffect(() => {
    if (!isLoading && recommendations.length > 0) {
      const container = document.querySelector(".property-cards-container");
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isLoading, recommendations]);

  return (
    <div className="custom-algorithm-popup">
      <div className="custom-algorithm-container">
        <div className="custom-algorithm-base">
          <div className="custom-algorithm-close">
            <button className="cancel-button" onClick={closePopUp}>
              {"\u2716"}
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Local Authority Dropdown */}
            <div className="local-authority-dropdown">
              <label htmlFor="local-authority">Select your city:</label>
              <select
                id="local-authority"
                value={selectedLocalAuthority}
                onChange={handleLocalAuthorityChange}
              >
                <option value="">Select City</option>
                {localAuthorities.map((city) => (
                  <option key={city.key} value={city.key}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Bedrooms */}
            <div className="number-of-bedrooms-selection">
              <p>How many rooms are you looking for?</p>
              <div className="number-of-bedrooms-grid">
                {[
                  { key: "1 bedroom", name: "1" },
                  { key: "2 bedrooms", name: "2" },
                  { key: "3 bedrooms", name: "3" },
                  { key: "4 bedrooms", name: "4" },
                  { key: "5 bedrooms", name: "5" },
                  { key: "6 bedrooms", name: "6" },
                  { key: "7 bedrooms", name: "7" },
                  { key: "8 bedrooms", name: "8" },
                ].map((bedroom) => (
                  <div
                    key={bedroom.key}
                    className={`number-of-bedrooms-card ${number_bedrooms === bedroom.name ? "selected" : ""}`}
                    onClick={() => setBedrooms(bedroom.name)}
                  >
                    <div className="number-of-bedrooms-image">{bedroom.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* EPC Rating Selection */}
            <div className="epc-rating-selection">
              <p>How efficient do you want your property to be</p>
              <div className="epc-rating-grid">
                {["A", "B", "C", "D", "E", "F", "G"].map((rating) => (
                  <div
                    key={rating}
                    className={`epc-rating-card ${selectedRating === rating ? "selected" : ""}`}
                    onClick={() => handleEPCRating(rating)}
                  >
                    <div className={`epc-rating-house ${selectedRating === rating ? "selected" : ""}`}>
                      <span className="epc-rating-letter">{rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Type Selection */}
            <div className="property-type-selection">
              <p>What kind of property do you want to live in?</p>
              <div className="property-types">
                {[
                  { key: "Apartment", name: "Apartment", image: apartmentImg },
                  { key: "Bungalow", name: "Bungalow", image: bungalowImg },
                  { key: "House", name: "House", image: houseImg },
                  { key: "Maisonette", name: "Maisonette", image: maisonetteImg },
                ].map((type) => (
                  <div
                    key={type.key}
                    className={`property-type-option ${selectedProperty === type.key ? "selected" : ""}`}
                    onClick={() => handlePropertyType(type.key)}
                  >
                    <img src={type.image} alt={type.name} />
                    <p>{type.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* University Selection */}
            <div className="university-selection">
              <p>Select your University:</p>
              <div className="universities">
                {selectedLocalAuthority && universities.length > 0 ? (
                  universities.map((uni) => (
                    <div
                      key={uni.key}
                      name={uni.name}
                      className={`university-option ${selectedUniversity === uni.name ? "selected" : ""}`}
                      onClick={() => handleUniversitySelect(uni.name)}
                    >
                      <img src={uni.image} alt={uni.name} />
                      <p>{uni.name}</p>
                    </div>
                  ))
                ) : (
                  <p>Please select a city to see available universities.</p>
                )}
              </div>
            </div>

            {/* Distance Slider */}
            <div className="distance-slider">
              <p>
                How far would you like to be? {maxDistance} km
              </p>
              <input
                type="range"
                min="0"
                max="20"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              />
            </div>

            <button type="submit">Submit</button>
          </form>

          {/* Loading indicator */}
          {isLoading && <p className="loading-indicator">Loading...</p>}

          {/* No properties message */}
          {hasSearched && recommendations.length === 0 && (
            <p className="no-properties-message">No properties found matching your criteria.</p>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="property-cards-container">
              {recommendations.map((property, index) => (
                <PropertyCard key={index} property={property} language="en" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomAlgorithm;
