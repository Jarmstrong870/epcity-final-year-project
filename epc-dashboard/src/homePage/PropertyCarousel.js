import React, { useState } from 'react';
import PropertyCard from '../homePage/PropertyCard';
import './PropertyCarousel.css';
import translations from '../locales/translations_epcsection';

const PropertyCarousel = ({ topRatedProperties, user, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3; // Number of cards to display at once
  const totalItems = topRatedProperties.length;

  // Load the correct translations
  const t = translations[language] || translations.en;

  const nextSlide = () => {
    if (currentIndex < totalItems - itemsToShow) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="property-carousel">
      <h2 className="carousel-title">{t.mostEfficientProperties}</h2> {/* Added translation for carousel title */}
      <div className="carousel-wrapper">
        <button 
          className="carousel-button prev" 
          onClick={prevSlide} 
          disabled={currentIndex === 0}
        >
          &#10094;
        </button>
        <div className="carousel-container">
          <div 
            className="carousel-content" 
            style={{ transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)` }}
          >
            {topRatedProperties.map((property, index) => (
              <div className="carousel-item" key={index}>
                <PropertyCard user={user} property={property} language={language} />
              </div>
            ))}
          </div>
        </div>
        <button 
          className="carousel-button next" 
          onClick={nextSlide} 
          disabled={currentIndex >= totalItems - itemsToShow}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default PropertyCarousel;
