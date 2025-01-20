import React, { useState } from 'react';
import './EICalculator.css';

// Function to calculate the environmental impact based on user inputs
const calculateImpact = (propertyType, heatingType, duration) => {
    const elephantEnergy = 500; // Energy equivalent of one elephant weight (kWh)
    const phoneChargeEnergy = 0.015; // Energy required to charge one phone (kWh)
    const airplaneEnergyPerKm = 0.2; // Energy used for 1 km of airplane travel (kWh)

    // Energy consumption rates based on property type and heating type
    const energyRates = {
        House: { Electric: 3, Gas: 8.79 },
        Flat: { Electric: 2, Gas: 7 },
        Bungalow: { Electric: 2.5, Gas: 7.5 },
    };

    // Get the specific energy rate for the given property and heating type
    const energyRate = energyRates[propertyType]?.[heatingType];

    // If the inputs are invalid (property type or heating type missing), return an error message
    if (!energyRate) {
        return {
            message: 'Invalid inputs. Please ensure property type and heating type are correct.',
            images: [],
        };
    }

    // Calculate the total energy used based on the duration and energy rate
    const totalEnergyUsed = (energyRate * duration).toFixed(2);

    // Calculate the equivalent impacts
    const elephantEquivalent = (totalEnergyUsed / elephantEnergy).toFixed(2); // Elephant weight equivalent
    const phoneEquivalent = Math.round(totalEnergyUsed / phoneChargeEnergy); // Number of phones charged
    const airplaneEquivalent = (totalEnergyUsed / airplaneEnergyPerKm).toFixed(2); // Airplane distance equivalent

    // URLs for the images to represent the impact
    const images = [
        '../assets/elephant.jpg', // Elephant image
        '../assets/chargingphone.png', // Phone image
        '../assets/airplane.jpg', // Airplane image
    ];

    // Return the calculated results along with the images
    return {
        message: `For a ${propertyType} with ${heatingType} heating over ${duration} hours:
        - Elephant weight equivalent: ${elephantEquivalent} elephants
        - Phone charges: ${phoneEquivalent} phones
        - Airplane travel: ${airplaneEquivalent} km`,
        images,
    };
};

// Main Environmental Impact Calculator component
const EICalculator = () => {
    // State variables for user inputs and results
    const [propertyType, setPropertyType] = useState(''); // Property type (e.g., House, Flat, Bungalow)
    const [heatingType, setHeatingType] = useState(''); // Heating type (e.g., Electric, Gas)
    const [duration, setDuration] = useState(''); // Heating duration in hours
    const [results, setResults] = useState(null); // Results of the calculation

    // Function to handle the calculation when the button is clicked
    const handleCalculate = () => {
        const impact = calculateImpact(propertyType, heatingType, Number(duration)); // Perform calculation
        setResults(impact); // Store the results in the state
    };

    return (
        <div className="ei-calculator">
            <h1>Environmental Impact Calculator</h1>

            {/* Dropdown for selecting property type */}
            <div className="input-group">
                <label>Property Type</label>
                <select onChange={(e) => setPropertyType(e.target.value)} value={propertyType}>
                    <option value="">Select</option>
                    <option value="House">House</option>
                    <option value="Flat">Flat</option>
                    <option value="Bungalow">Bungalow</option>
                </select>
            </div>

            {/* Dropdown for selecting heating type */}
            <div className="input-group">
                <label>Heating Type</label>
                <select onChange={(e) => setHeatingType(e.target.value)} value={heatingType}>
                    <option value="">Select</option>
                    <option value="Electric">Electric</option>
                    <option value="Gas">Gas</option>
                </select>
            </div>

            {/* Input for heating duration */}
            <div className="input-group">
                <label>Heating Duration (hours)</label>
                <input
                    type="number"
                    placeholder="Enter hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)} // Update duration state
                />
            </div>

            {/* Button to process results */}
            <button className="calculate-button" onClick={handleCalculate}>
                Process Results
            </button>

            {/* Display results if available */}
            {results && (
                <div className="results">
                    <p>{results.message}</p>
                    <div className="images">
                        {results.images.map((img, index) => (
                            <img key={index} src={img} alt={`Impact ${index}`} /> // Display impact images
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EICalculator;