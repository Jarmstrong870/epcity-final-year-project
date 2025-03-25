import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Select, { components } from 'react-select';
import './FilterComponent.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import translations from '../locales/translations_filtercomponent';
import { Range } from "react-range";

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};

const PropertyFilter = ({ language, setLoading  }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search") || '';
    const [searchQuery, setSearchQuery] = useState(searchTerm);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [epcRatings, setEpcRatings] = useState([]);
    const [bedroomRange, setBedroomRange] = useState([1, 10]);
    const [timeoutId, setTimeoutId] = useState(null);
    const [visualRange, setVisualRange] = useState([1, 10]);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    // Toggle Dropdowns
    const toggleDropdown = (dropdown) => {
        setDropdownOpen(dropdownOpen === dropdown ? null : dropdown);
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
        setLoading(true)
        fetchProperties(searchQuery, propertyTypes, epcRatings, bedroomRange, city)
            .finally(() => setLoading(false));

    }, [propertyTypes, epcRatings, bedroomRange, city]);

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePropertyTypeChange = (selectedOptions) => {
        setPropertyTypes(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleEpcRatingChange = (selectedOptions) => {
        setEpcRatings(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleFetchProperties = (e) => {
        e.preventDefault();
        fetchProperties(searchQuery, propertyTypes, epcRatings, bedroomRange, city);
    };

    const propertyTypeOptions = t.propertyTypeOptions.map(type => ({ value: type, label: type }));
    const epcRatingOptions = ["A", "B", "C", "D", "E", "F", "G"].map(rating => ({ value: rating, label: rating }));

    return (
        <div className="filterSection">
            <div className="searchContainer">
                <h2 className="searchTitle">{t.findYourProperty}</h2>
                <div className="searchInputs">
                    {/* Search Bar */}
                    <input
                        className="searchAddress"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={t.search}
                    />

                    {/* City Selection */}
                    <div className="cityDropDown">
                        <select value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="">{t.selectCity}</option>
                            {cities.map((city) => (
                                <option key={city.value} value={city.value}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Button */}
                    <button className="searchButton" onClick={handleFetchProperties}>
                        🔍 {t.findProperties}
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="filtersContainer">
                <Select className="dropdown"
                    isMulti
                    options={propertyTypeOptions}
                    value={propertyTypeOptions.filter(option => propertyTypes.includes(option.value))}
                    onChange={handlePropertyTypeChange}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{ Option }}
                    placeholder={t.propertyTypes}
                />

                <Select className="dropdown"
                    isMulti
                    options={epcRatingOptions}
                    value={epcRatingOptions.filter(option => epcRatings.includes(option.value))}
                    onChange={handleEpcRatingChange}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{ Option }}
                    placeholder={t.epcRatings}
                />

                <div className="bedroomSliderContainer">
                    <p className="bedroomRangeLabel">{t.bedroomRange}: {bedroomRange[0]} - {bedroomRange[1]}</p>
                    <Range
                        step={1}
                        min={1}
                        max={10}
                        values={visualRange}
                        onChange={(values) => {
                            setVisualRange(values);
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
                </div>
            </div>
        </div>
    );
};

export default PropertyFilter;
