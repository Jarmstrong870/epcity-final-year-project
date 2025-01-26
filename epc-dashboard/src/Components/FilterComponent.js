import React, { useState } from 'react';
import './Filter.css';
import translations from '../locales/translations_filtercomponent'; // Import translations

const PropertyFilter = ({ onFilterChange, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [epcRatings, setEpcRatings] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortValue, setSortValue] = useState('current_energy_rating');

  const t = translations[language] || translations.en; // Load translations

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

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
    onFilterChange(searchQuery, propertyTypes, epcRatings, pageNumber, sortValue);
  };

  const handlePageChange = (e) => setPageNumber(e.target.value);

  const handleSortChange = (e) => setSortValue(e.target.value);

  return (
    <div className="baseStyling">
      <form onSubmit={handleFilterSubmit}>
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

        {/* Page Number Input */}
        <div>
          <label>{t.pageNumber}</label>
          <input
            type="number"
            id="page"
            name="page"
            min="1"
            max="100"
            defaultValue={1}
            value={pageNumber}
            onChange={handlePageChange}
          />
        </div>

        {/* Sort Options Dropdown */}
        <div>
          <label>{t.sortBy}</label>
          <select defaultValue="current_energy_rating" onChange={handleSortChange}>
            {Object.keys(t.sortOptions).map((key) => (
              <option key={key} value={key}>
                {t.sortOptions[key]}
              </option>
            ))}
          </select>
          {/* Display the translated sort value */}
          <h3>{t.sortOptions[sortValue]}</h3>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit">{t.findProperties}</button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilter;
