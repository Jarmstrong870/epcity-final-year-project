import React, { useState } from 'react';
import './EICalculator.css';
import translationsEICalculator from '../locales/translations_ei_calculator';

const calculateImpact = (propertyType, heatingType, duration, t) => {
  const elephantEnergy = 500;
  const phoneChargeEnergy = 0.015;
  const airplaneEnergyPerKm = 0.2;

  const energyRates = {
    House: { Electric: 3, Gas: 8.79 },
    Flat: { Electric: 2, Gas: 7 },
    Bungalow: { Electric: 2.5, Gas: 7.5 },
  };

  const energyRate = energyRates[propertyType]?.[heatingType];
  if (!energyRate) {
    return { message: t.invalidInput };
  }

  const totalEnergyUsed = (energyRate * duration).toFixed(2);
  const elephantEq = (totalEnergyUsed / elephantEnergy).toFixed(2);
  const phoneEq = Math.round(totalEnergyUsed / phoneChargeEnergy);
  const airplaneEq = (totalEnergyUsed / airplaneEnergyPerKm).toFixed(2);

  // URLs for the images to represent the impact
  const images = [
    '/assets/elephant.jpg', // Elephant image
    '/assets/chargingphone.png', // Phone image
    '/assets/airplane.jpg', // Airplane image
  ];

  return {
    message: t.results(propertyType, heatingType, duration, elephantEq, phoneEq, airplaneEq),
    images,
  };
};

const EICalculator = ({ language }) => {
  const t = translationsEICalculator[language] || translationsEICalculator.en;

  const [propertyType, setPropertyType] = useState('');
  const [heatingType, setHeatingType] = useState('');
  const [duration, setDuration] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const impact = calculateImpact(propertyType, heatingType, Number(duration), t);
    setResults(impact);
  };

  return (
    <div className="ei-calculator">
      <h1>{t.title}</h1>

      <div className="input-group">
        <label>{t.propertyType}</label>
        <select onChange={(e) => setPropertyType(e.target.value)} value={propertyType}>
          <option value="">{t.select}</option>
          <option value="House">{t.house}</option>
          <option value="Flat">{t.flat}</option>
          <option value="Bungalow">{t.bungalow}</option>
        </select>
      </div>

      <div className="input-group">
        <label>{t.heatingType}</label>
        <select onChange={(e) => setHeatingType(e.target.value)} value={heatingType}>
          <option value="">{t.select}</option>
          <option value="Electric">{t.electric}</option>
          <option value="Gas">{t.gas}</option>
        </select>
      </div>

      <div className="input-group">
        <label>{t.duration}</label>
        <input
          type="number"
          placeholder={t.placeholder}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <button className="calculate-button" onClick={handleCalculate}>
        {t.calculateButton}
      </button>

      {results && (
        <div className="results">
          <p>{results.message}</p>
          <div className="images">
            {results.images.map((img, index) => (
              <img key={index} src={img} alt={`Impact ${index}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EICalculator;
