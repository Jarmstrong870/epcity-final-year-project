import React, {useState} from "react";
import "../homePage/SliderComponent.css"; 

const SliderComponent = ({minValue, maxValue, process, startValue}) => {

    const [sliderValue, setSliderValue] = useState(startValue);

    const handleInput = (userInput) => {
        setSliderValue(userInput.target.sliderValue);
    }   

    return (
        <div className="slider-component">
            <input
                className = "slider-input"
                type = "range"
                minValue = {minValue}
                maxValue = {maxValue}
                process = {process}
                startValue = {startValue}
                onChange = {handleInput} 
            />

            <div className = "slider-value-output"> {sliderValue} </div>
        </div>
    );
};

export default SliderComponent;
