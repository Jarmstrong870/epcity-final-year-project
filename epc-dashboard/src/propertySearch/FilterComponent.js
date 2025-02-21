import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FilterComponent.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_filtercomponent'; // Import translations
import { Range } from "react-range";

const PropertyFilter = ({ language }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search") || '';
    const [searchQuery, setSearchQuery] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [epcRatings, setEpcRatings] = useState([]);
    const [bedroomRange, setBedroomRange] = useState([1, 10]); // Min & Max Bedrooms

    const t = translations[language] || translations.en;

    const { fetchProperties } = useContext(PropertyContext); // Use `fetchProperties` from context

    useEffect(() => {
        setSearchQuery(searchTerm);
        fetchProperties(searchTerm)
    }, [searchTerm]);

    useEffect(() => {
        fetchProperties(searchQuery, propertyTypes, epcRatings, bedroomRange);
    }, [searchQuery, propertyTypes, epcRatings, bedroomRange]);

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
                <h2>{t.findYourProperty}</h2>
            </div>

            {/* Search Input */}
            <div>
                <label htmlFor="searchQuery"></label>
                <input
                    className="searchAddress"
                    type="text"
                    id="searchQuery"
                    value={searchQuery}

                    onChange={handleSearchChange} // Fix for search query
                    placeholder={t.search}
                />
                {/* Submit Button */}
                <button className='stylingFilterButton' onClick={handleFetchProperties}>{t.findProperties}</button>
            </div>

            {/* Property Type Filter (Checkboxes) */}
            <div className="propertyTypeFilterTitle">
                <label><strong>{t.propertyTypes}</strong></label>
                <div className="propertyTypeFilter">
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
            <div className="ratingLetterFilterTitle">
                <label><strong>{t.epcRatings}</strong></label>
                <div className="ratingLetterFilter">
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

            {/* Bedroom Range Slider */}
            <div className="bedroomFilterTitle">
                <label><strong>{t.bedrooms}</strong></label>
                <div className="rangeSliderContainer">
                    <Range
                        step={1}
                        min={1}
                        max={10}
                        values={bedroomRange}
                        onChange={(values) => setBedroomRange(values)}
                        renderTrack={({ props, children }) => (
                            <div {...props} className="rangeTrack">
                                {children}
                            </div>
                        )}
                        renderThumb={({ props, index }) => (
                            <div {...props} className="rangeThumb">
                                {bedroomRange[index]}
                            </div>
                        )}
                    />
                    <div className="rangeValues">
                        <span>{bedroomRange[0]} {t.minBedrooms}</span>
                        <span>{bedroomRange[1]} {t.maxBedrooms}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilter;

