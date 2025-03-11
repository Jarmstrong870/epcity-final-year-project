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
    const [activeFilter, setActiveFilter] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);
    const [visualRange, setVisualRange] =useState([1, 10]);

    const toggleFilter = (filter) => {
        setActiveFilter(activeFilter === filter ? null : filter);
    };

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
        <div className="filterSection">
            <div className="searchContainer">
                <h2 className="searchTitle">Search Properties</h2>
                <div className="searchInputs">
                    {/* Search Bar */}
                    <input
                        className="searchAddress"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by address or postcode..."
                    />

                    {/* City Selection */}
                    <div className="cityDropDown">
                        <select value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.value} value={city.value}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Button */}
                    <button className="searchButton" onClick={handleFetchProperties}>
                        🔍 Search
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="filtersContainer">
                {/* Property Type Filter */}
                <div className='buttonContainerFilter'>
                    <button className="filterTitleButton" onClick={() => toggleFilter("propertyType")}>
                        <strong>Property Type  ⮟</strong>
                    </button>

                    {/* EPC Rating Filter */}
                    <button className="filterTitleButton" onClick={() => toggleFilter("epcRatings")}>
                        <strong>EPC Ratings ⮟</strong>
                    </button>

                    {/* Bedroom Range Slider */}
                    <button className="filterTitleButton" onClick={() => toggleFilter("bedrooms")}>
                        <strong>Number of bedrooms ⮟</strong>
                    </button>
                </div>
                <div className={`filterBox ${activeFilter === "bedrooms" ? "active" : ""}`}>
                    <div className="rangeSliderContainer">
                        <Range
                            step={1}
                            min={1}
                            max={10}
                            values={visualRange}
                            onChange={(values) => {
                                setVisualRange(values)
                                if (timeoutId) clearTimeout(timeoutId);

                                const newTimeout = setTimeout(() => {
                                    setBedroomRange(values);
                                }, 250);

                                setTimeoutId(newTimeout);
                            }}
                            renderTrack={({ props, children }) => (
                                <div {...props} className="rangeTrack">
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props, index }) => (
                                <div {...props} className="rangeThumb">
                                    {visualRange[index]}
                                </div>
                            )}
                        />
                        <div className="rangeValues">
                            <span>1 Min</span>
                            <span>10 Max</span>
                        </div>
                    </div>
                </div>
                <div className={`filterBox ${activeFilter === "propertyType" ? "active" : ""}`}>
                    <div className="checkboxContainer">
                        {["House", "Flat", "Maisonette", "Bungalow"].map((type, index) => (
                            <label key={index} className="checkboxLabel">
                                <input type="checkbox" value={type} onChange={handlePropertyTypeChange} />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>
                <div className={`filterBox ${activeFilter === "epcRatings" ? "active" : ""}`}>
                    <div className="checkboxContainer">
                        {["A", "B", "C", "D", "E", "F", "G"].map((rating) => (
                            <label key={rating} className="checkboxLabel">
                                <input type="checkbox" value={rating} onChange={handleEpcRatingChange} />
                                {rating}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilter;
