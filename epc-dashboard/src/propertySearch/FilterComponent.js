import React, { useState, useContext } from 'react';
import './FilterComponent.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_filtercomponent'; // Import translations


const PropertyFilter = ({ language }) => {
  // State variables for search and filter criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [epcRatings, setEpcRatings] = useState([]);

  const t = translations[language] || translations.en;



  const { fetchProperties, properties } = useContext(PropertyContext);



  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for property type selection
  const handlePropertyTypeChange = (e) => {
    const { value, checked } = e.target;
    setPropertyTypes(
      checked ? [...propertyTypes, value] : propertyTypes.filter((type) => type !== value)
    );
  };

  const handleEpcRatingChange = (e) => {
    const { value, checked } = e.target;
    setEpcRatings(
      checked ? [...epcRatings, value] : epcRatings.filter((rating) => rating !== value)
    );
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Call the parent component's method
    //onFilterChange(searchQuery, propertyTypes, epcRatings, pageNumber, sortValue);
    fetchProperties(searchQuery, propertyTypes, epcRatings);
  };

  return (
    <div className="baseStyling">
      <div>
        <h2>Find Your Property</h2>
      </div>

      {/* Search Input */}
      <div className="searchAddress">
        <label htmlFor="searchQuery"><strong>{t.search}</strong></label>
        <input
          className="searchInput"
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Property Type Filter (Checkboxes) */}
      <div className='filterContainer'>
        <div className="propertyTypeFilter">
          <label><strong>{t.propertyTypes}</strong></label>
          <div>
            {t.propertyTypeOptions.map((type, index) => (
              <label key={index}>
                <input type="checkbox" value={type} onChange={handlePropertyTypeChange} />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* EPC Rating Filter (Checkboxes) */}
        <div className="ratingLetterFilter">
          <label><strong>{t.epcRatings}</strong></label>
          <div>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((rating) => (
              <label key={rating}>
                <input type="checkbox" value={rating} onChange={handleEpcRatingChange} />
                {rating}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button type="button" onClick={handleFilterSubmit}>{t.findProperties}</button>
      </div>

    </div>
  );
};

export default PropertyFilter;
