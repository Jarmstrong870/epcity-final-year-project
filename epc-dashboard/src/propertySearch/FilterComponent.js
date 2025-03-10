import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FilterComponent.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import TextToSpeech from '../Components/utils/TextToSpeech'; // Import TTS component
import translations from '../locales/translations_filtercomponent';
import { Range } from "react-range";

const PropertyFilter = ({ language }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search") || '';
    const [searchQuery, setSearchQuery] = useState(searchTerm);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [epcRatings, setEpcRatings] = useState([]);
    const [bedroomRange, setBedroomRange] = useState([1, 10]);

    const cities = [
        { name: "Liverpool", value: "E08000012" },
        { name: "Leeds", value: "E08000035" },
        { name: "Manchester", value: "E08000003" },
        { name: "Bristol", value: "E06000023" },
        { name: "Sheffield", value: "E08000019" },
        { name: "Birmingham", value: "E08000025" },
        { name: "Brighton", value: "E06000043" },
        { name: "Newcastle", value: "E08000021" },
        { name: "Southampton", value: "E06000045" },
    ];

    const t = translations[language] || translations.en;
    const { fetchProperties, city, setCity } = useContext(PropertyContext);

    useEffect(() => {
        fetchProperties(searchQuery, propertyTypes, epcRatings, bedroomRange, city);
    }, [propertyTypes, epcRatings, bedroomRange, city]);

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePropertyTypeChange = (e) => {
        const { value, checked } = e.target;
        setPropertyTypes((prev) =>
            checked ? [...prev, value] : prev.filter((type) => type !== value)
        );
    };

    const handleEpcRatingChange = (e) => {
        const { value, checked } = e.target;
        setEpcRatings((prev) =>
            checked ? [...prev, value] : prev.filter((rating) => rating !== value)
        );
    };

    const handleFetchProperties = (e) => {
        e.preventDefault();
        fetchProperties(searchQuery, propertyTypes, epcRatings, bedroomRange, city);
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    return (
        <div className="filterBase">
            <div className="searchContainer">
                <h2>Search Properties</h2>
                
                {/* Search Bar */}
                <input
                    className="searchAddress"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by address..."
                />

                {/* City Selection */}
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Select City</option>
                    {cities.map((city) => (
                        <option key={city.value} value={city.value}>
                            {city.name}
                        </option>
                    ))}
                </select>

                {/* Search Button */}
                <button className="searchButton" onClick={handleFetchProperties}>
                    🔍 Search
                </button>
            </div>

            {/* Filters Section */}
            <div className="filtersContainer">
                {/* Property Type Filter */}
                <div className="filterBox">
                    <label><strong>Property Type</strong></label>
                    <div className="checkboxContainer">
                        {["House", "Flat", "Maisonette", "Bungalow"].map((type, index) => (
                            <label key={index} className="checkboxLabel">
                                <input
                                    type="checkbox"
                                    value={type}
                                    onChange={handlePropertyTypeChange}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                {/* EPC Rating Filter */}
                <div className="filterBox">
                    <label><strong>EPC Ratings</strong></label>
                    <div className="checkboxContainer">
                        {["A", "B", "C", "D", "E", "F", "G"].map((rating) => (
                            <label key={rating} className="checkboxLabel">
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

                {/* Bedroom Range Filter */}
                <div className="filterBox">
                    <label><strong>Number of Bedrooms</strong></label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={bedroomRange[1]}
                        onChange={(e) => setBedroomRange([1, Number(e.target.value)])}
                        className="bedroomSlider"
                    />
                    <p className="bedroomValue">{bedroomRange[1]} Bedrooms</p>
                </div>
            </div>
        </div>
    );
};


export default PropertyFilter;
