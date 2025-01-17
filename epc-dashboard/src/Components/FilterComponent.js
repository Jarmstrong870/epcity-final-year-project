import React, { useState, useContext } from 'react';
import { PropertyContext } from './propertyContext';

const PropertyFilter = () => {
  // State variables for search and filter criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [epcRatings, setEpcRatings] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortValue, setSortValue] = useState('current_energy_rating');
  const { fetchProperties, changePage, sortProperties, properties } = useContext(PropertyContext);

  

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for property type selection
  const handlePropertyTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setPropertyTypes([...propertyTypes, value]);
    } else {
      setPropertyTypes(propertyTypes.filter((type) => type !== value));
    }
  };

  // Handler for EPC rating selection
  const handleEpcRatingChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEpcRatings([...epcRatings, value]);
    } else {
      setEpcRatings(epcRatings.filter((rating) => rating !== value));
    }
  };

  // Handler to submit the filters
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Call the parent component's method
    //onFilterChange(searchQuery, propertyTypes, epcRatings, pageNumber, sortValue);
    fetchProperties(searchQuery, propertyTypes, epcRatings);
  };
  const handlePageChange = (e) => {
    setPageNumber(e.target.value);
    changePage(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortValue(e.target.value);
    sortProperties(e.target.value);
  }


  return (
    <div className="property-filter">
      <form onSubmit={handleFilterSubmit}>
        {/* Search Input */}
        <div>
          <label htmlFor="searchQuery">Search by Address or Postcode:</label>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Property Type Filter (Checkboxes) */}
        <div>
          <label>Property Types:</label>
          <div>
            {['bungalow', 'flat', 'house', 'maisonette'].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  value={type}
                  onChange={handlePropertyTypeChange}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* EPC Rating Filter (Checkboxes) */}
        <div>
          <label>EPC Ratings:</label>
          <div>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((rating) => (
              <label key={rating}>
                <input
                  type="checkbox"
                  value={rating}
                  onChange={handleEpcRatingChange}
                />
                {rating}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label>Page Number:</label>
          <input type="number" id="page" name="page" min="1" max="100" defaultValue={1} value={pageNumber} onChange={handlePageChange} />
          

        </div>
        <div>
          <label>Sort By:</label>
          <select defaultValue={"current_energy_rating"} onChange={handleSortChange}>
            <option value="address">Address</option>
            <option value="postcode">Postcode</option>
            <option value="property_type">Property Type</option>
            <option value="current_energy_rating">Current Energy Rating</option>
            <option value="current_energy_efficiency">Current Energy Efficiency</option>
          </select>
          <h3>{sortValue}</h3>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit">Find Properties</button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilter;
