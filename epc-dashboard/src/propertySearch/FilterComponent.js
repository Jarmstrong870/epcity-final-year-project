import React, { useState, useContext } from 'react';
import './FilterComponent.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_filtercomponent'; // Import translations

const PropertyFilter = ({ language }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [epcRatings, setEpcRatings] = useState([]);

    const t = translations[language] || translations.en;

    const { fetchProperties } = useContext(PropertyContext); // Use `fetchProperties` from context

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle property type checkbox change
    const handlePropertyTypeChange = (e) => {
        const { value, checked } = e.target;
        setPropertyTypes((prev) =>
            checked ? [...prev, value] : prev.filter((type) => type !== value)
        );
    };

    // Handle EPC ratings checkbox change
    const handleEpcRatingChange = (e) => {
        const { value, checked } = e.target;
        setEpcRatings((prev) =>
            checked ? [...prev, value] : prev.filter((rating) => rating !== value)
        );
    };

    // Apply filters (single action)
    const handleFetchProperties = (e) => {
        e.preventDefault();
        fetchProperties(searchQuery, propertyTypes, epcRatings); // Apply search and filters
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
                    onChange={handleSearchChange} // Fix for search query
                />
            </div>

            {/* Property Type Filter (Checkboxes) */}
            <div className="filterContainer">
                <div className="propertyTypeFilter">
                    <label><strong>{t.propertyTypes}</strong></label>
                    <div>
                        {t.propertyTypeOptions.map((type, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    value={type}
                                    onChange={handlePropertyTypeChange} // Fix for property types
                                />
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
                                <input
                                    type="checkbox"
                                    value={rating}
                                    onChange={handleEpcRatingChange} // Fix for EPC ratings
                                />
                                {rating}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div>
                <button type="button" onClick={handleFetchProperties}>{t.findProperties}</button>
            </div>
        </div>
    );
};

export default PropertyFilter;

