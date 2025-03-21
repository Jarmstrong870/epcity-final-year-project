import React from 'react';
import './aboutus.css';
import aboutImage from '../assets/epc-image.jpg';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Your trusted platform for researching energy-efficient properties.</p>
      </div>

      <div className="about-content">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            At <span className="highlight">EPCity</span>, we are dedicated to helping individuals and families find 
            energy-efficient properties across the UK. Our platform provides accurate 
            property EPC ratings, comprehensive search filters, and valuable resources 
            to help you make informed decisions.
          </p>

          <h2>Our Mission</h2>
          <p>
            We aim to empower property seekers with data-driven insights, allowing them 
            to discover the most <span className="highlight">sustainable</span> and <span className="highlight">cost-effective</span> homes available.
          </p>

          <h2>Why Choose Us?</h2>
          <ul className="about-list">
            <li>{"\u{21D2}"} Comprehensive EPC ratings and property details</li>
            <li>{"\u{21D2}"} User-friendly search and filter options</li>
            <li>{"\u{21D2}"} Dedicated support and guidance</li>
            <li>{"\u{21D2}"} Commitment to sustainability</li>
          </ul>
        </div>

        <div className="about-image">
          <img src={aboutImage} alt="About EPCity" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
