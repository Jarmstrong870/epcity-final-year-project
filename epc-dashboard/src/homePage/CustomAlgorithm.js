import React, {useState} from "react";
import "../homePage/CustomAlgorithm.css"; 

const amenities = [
  { name: "Gym", image: require("../assets/amenities/gym.jpg") },
  { name: "Cafe", image: require("../assets/amenities/cafe.jpg") },
  { name: "Restaurant", image: require("../assets/amenities/restaurant.jpg") },
  { name: "Park", image: require("../assets/amenities/park.jpg") },
  { name: "Pubs", image: require("../assets/amenities/pub.jpg") },
  { name: "Nightclub", image: require("../assets/amenities/nightclub.jpg") },
  { name: "Library", image: require("../assets/amenities/library.jpg") },
  { name: "Shopping Centres", image: require("../assets/amenities/shopping centre.jpg") },
  { name: "Grocery Shops", image: require("../assets/amenities/grocery.jpg") },
];

const bedroom = [
    { name: "1 Bedroom", image: "1"},
    { name: "2 Bedroom", image: "2"},
    { name: "3 Bedroom", image: "3"},
    { name: "4 Bedroom", image: "4"},
    { name: "5 Bedroom", image: "5"},
    { name: "6 Bedroom", image: "6"},
    { name: "7 Bedroom", image: "7"},
    { name: "8 Bedroom", image: "8"},
];

const type = [
    { name: "Apartment", image: require("../assets/property types/apartment.png") },
    { name: "Bungalow", image: require("../assets/property types/bungalow.png") },
    { name: "House", image: require("../assets/property types/house.png") },
    { name: "Maisonette", image: require("../assets/property types/maisonette.png") },
];

const CustomAlgorithm = () => {

    const [surveyAppear, setSurveyAppear] = useState(false);

  return (

    <div className="custom-algorithm">
     <button className="custom-algorithm-button" onClick={() => setSurveyAppear(!surveyAppear)}>
        {surveyAppear ? "Click to minimise" : "Click here to complete the survey"}</button> {/*button on click to be added with functionality*/}
    
    {surveyAppear && (
      
     <div className="number-of-bedrooms-section"> {/*Amenities Choices */}
        <h2 className="number-of-bedrooms-title">How many beds are you looking for?</h2>
        <div className="number-of-bedrooms-grid">
          {bedroom.map((bedroom, index) => (
            <div key={index} className="number-of-bedrooms-card">
                <div className="number-of-bedrooms-image">{bedroom.image}</div>
            </div>
          ))}
        </div>

      <div className="property-type-section"> {/*Number of Bedrooms Choices */}
        <h2 className="property-type-title">What kind of property are you looking for?</h2>
        <div className="property-type-grid">
          {type.map((type, index) => (
            <div key={index} className="property-type-card">
              <img src={type.image} alt={type.name} className="property-type-image" />
              <div className="property-type-overlay">
                <span className="property-type-name">{type.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="number-of-bedrooms-section"> {/*Proximity/ Distance to Chosen Location Choices */}
        <h2 className="number-of-bedrooms-title">What Proximity/Distance from inputted location i.e. uni or work</h2>
      </div>

      <div className="number-of-bedrooms-section"> {/*Property Star Rating Insulation Choices */}
        <h2 className="number-of-bedrooms-title">How well insulated do you want a property to be?</h2>
      </div>
    
      <div className="number-of-bedrooms-section"> {/*Public Transport Choices */}
        <h2 className="number-of-bedrooms-title">Do you use public transport? If so, tick all that apply</h2>
      </div>

      <div className="amenities-section">    {/*Amenities Choices */}
        <h2 className="uk-amenities-title">Choose your favourite hobbies</h2>
        <div className="amenities-grid">
          {amenities.map((amenity, index) => (
            <div key={index} className="amenity-card">
              <img src={amenity.image} alt={amenity.name} className="amenity-image" />
              <div className="amenity-overlay">
                <span className="amenity-name">{amenity.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    )}
    </div>
  );
};

export default CustomAlgorithm;
