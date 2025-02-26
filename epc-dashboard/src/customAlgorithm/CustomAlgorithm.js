import React, { useState } from "react";
import "./CustomAlgorithm.css";
import TopRatedPropertyCard from "../homePage/TopRatedPropertyCard";

// Import your university images (adjust the paths as needed)
import uniLiverpoolImg from "../assets/uni-liverpool.png";
import johnMooresImg from "../assets/john-moores.jfif";
import hopeUniImg from "../assets/hope-university.jfif";
import apartmentImg from "../assets/property types/apartment.png";
import bungalowImg from "../assets/property types/bungalow.png";
import houseImg from "../assets/property types/house.png";
import maisonetteImg from "../assets/property types/maisonette.png";

function ExampleKnnForm({closePopUp}) {
  const [caPopUp, setCustomAlgorithmPopUp] = useState(false);
  const [number_bedrooms, setBedrooms] = useState(0);
  const [current_energy_rating, setEpcRating] = useState("C");
  const [property_type, setHouseType] = useState("HOUSE");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedRating, setSelectedEPCRating] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxDistance, setMaxDistance] = useState(10); // default value in km
  const [recommendations, setRecommendations] = useState([]);

  // Define your university options with images, keys, and names.
  const universities = [
    {
      key: "liverpool", name: "University of Liverpool", image: uniLiverpoolImg,
    },
    {
      key: "johnmoores", name: "Liverpool John Moores University", image: johnMooresImg,
    },
    {
      key: "hope", name: "Liverpool Hope University", image: hopeUniImg,
    },
  ];

  const total_bedrooms = [
    {key: "1 bedroom", name: "1"},
    {key: "2 bedrooms", name: "2"},
    {key: "3 bedrooms", name: "3"},
    {key: "4 bedrooms", name: "4"},
    {key: "5 bedrooms", name: "5"},
    {key: "6 bedrooms", name: "6"},
    {key: "7 bedrooms", name: "7"},
    {key: "8 bedrooms", name: "8"},
  ];

  const property_types = [
    {
      key: "Apartment", name: "Apartment", image: apartmentImg,
    },
    {
      key: "Bungalow", name: "Bungalow", image: bungalowImg,
    },
    {
      key: "House", name: "House", image: houseImg,
    },
    {
      key: "Maisonette", name: "Maisonette", image: maisonetteImg,
    },
  ];

  const epc_ratings = [
    { key: "A",},
    { key: "B",},
    { key: "C",},
    { key: "D",},
    { key: "E",},
    { key: "F",},
    { key: "G",},
  ];

  const amenities = [
    { key: "gym", name: "Gym", image: require("../assets/amenities/gym.jpg") },
    { key: "cafe", name: "Cafe", image: require("../assets/amenities/cafe.jpg") },
    { key: "restaurant", name: "Restaurant", image: require("../assets/amenities/restaurant.jpg") },
    { key: "park", name: "Park", image: require("../assets/amenities/park.jpg") },
    { key: "pubs", name: "Pubs", image: require("../assets/amenities/pub.jpg") },
    { key: "nightclub", name: "Nightclub", image: require("../assets/amenities/nightclub.jpg") },
    { key: "library", name: "Library", image: require("../assets/amenities/library.jpg") },
    { key: "scentre", name: "Shopping Centres", image: require("../assets/amenities/shopping centre.jpg") },
    { key: "gshop", name: "Grocery Shops", image: require("../assets/amenities/grocery.jpg") },
  ];
  


  const handleUniversitySelect = (uniKey) => {
    setSelectedUniversity(uniKey);
  };

  const handlePropertyType = (propertyKey) => {
    setSelectedProperty(propertyKey);
  }

  const handleEPCRating = (ratingKey) => {
    setSelectedEPCRating(ratingKey);
  }

  const handleAmenitySelection = (amenityKey) => {
    for(let i = 0; i < selectedAmenities.length; i++){
    if(selectedAmenities[i] === amenityKey){
      selectedAmenities.push(amenityKey);
      setSelectedAmenities(selectedAmenities);
      }
    }
  }

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
    <div className="custom-algorithm-popup">
    <div className="custom-algorithm-container">
      <div className="custom-algorithm-base">
        <div className="custom-algorithm-close">
          <button className="cancel-button" onClick={closePopUp}>{"\u2716"}</button>
      
        <form onSubmit={handleSubmit}>
        <div className="number-of-bedrooms-selection">
        <p>How many rooms are you looking for?</p>
        <div className="number-of-bedrooms-grid">
            {total_bedrooms.map((bedroom_number) => (
              <div 
                key={bedroom_number.key} 
                className={`number-of-bedrooms-card ${number_bedrooms === bedroom_number.key ? "selected" : ""}`}
                onClick={() => setBedrooms(bedroom_number.key)}>
                
                <div className="number-of-bedrooms-image">{bedroom_number.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="epc-rating-selection">
        <p>How efficient do you want your property to be</p>
        <div className="epc-rating-grid">
            {epc_ratings.map((rating) => (
              <div 
                key={rating.key} 
                className={`epc-rating-card ${selectedRating === rating.key ? "selected" : ""}`}
                onClick={() => setSelectedEPCRating(rating.key)}>
                
                <div className={`epc-rating-house ${selectedRating === rating.key ? "selected" : ""}`}>
                  <span className="epc-rating-letter">{rating.key}</span>
                </div>
            </div>
          ))}
        </div>
      </div>

        <div className="property-type-selection">
          <p>What kind of property do you want to live in?</p>
          <div className="property-types">
            {property_types.map((type) => (
              <div
                key={type.key}
                className={`property-type-option ${
                  selectedProperty === type.key ? "selected" : ""
                }`}
                onClick={() => handlePropertyType(type.key)}
              >
                <img src={type.image} alt={type.name} />
                <p>{type.name}</p>
                
              </div>
            ))}
          </div>
        </div>
      

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


        <div className="amenities-section">    {/*Amenities Choices */}
        <p>What do you like to do in your free time</p>
          <div className="amenities">
            {amenities.map((amenity) => (
              <div
                key={amenity.key}
                className={`amenity-card ${
                  selectedAmenities.includes(amenity.key) ? "selected" : ""
                }`}
                onClick={() => handleAmenitySelection(amenity.key)}
              >
                <img src={amenity.image} alt={amenity.name} className="amenity-image"/>
                  <div className="amenity-overlay">
                    <span className="amenity-name">{amenity.name}</span>
                  </div>
                {selectedAmenities.includes(amenity.key) && (
                  <div className="tick-overlay">✔</div>
                )}
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default ExampleKnnForm;
