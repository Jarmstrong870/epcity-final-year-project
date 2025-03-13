import React from 'react';
import './EPCSection.css';
// Replace with your own EPC image
import epcGraphImg from '../assets/EPC-graph.jpg';

const EPCSection = () => {
  return (
    <div className="epc-section">
      <div className="epc-section__left">
        <img 
          src={epcGraphImg} 
          alt="EPC Graph" 
          className="epc-section__image" 
        />
      </div>
      <div className="epc-section__right">
        <div className="epc-question-block">
          <h2>What is an EPC?</h2>
          <p>
            An EPC (Energy Performance Certificate) is a document that provides
            an energy efficiency rating for a property, offering insights into
            how to improve its overall efficiency.
          </p>
        </div>
        <div className="epc-question-block">
          <h2>What do we do at EPcity?</h2>
          <p>
            At EPcity, we help you find properties that align with your energy
            efficiency goals. Our system rates homes based on their EPC score
            and other factors, making it easier for you to choose the perfect fit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EPCSection;
