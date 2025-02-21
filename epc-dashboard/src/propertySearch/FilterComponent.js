import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FilterComponent.css';
import { PropertyContext } from '../Components/utils/propertyContext';
import TextToSpeech from '../Components/utils/TextToSpeech'; // Import TTS component
import translations from '../locales/translations_filtercomponent';

const PropertyFilter = ({ language }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search") || '';
    const [searchQuery, setSearchQuery] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [epcRatings, setEpcRatings] = useState([]);

    const t = translations[language] || translations.en;
    const { fetchProperties } = useContext(PropertyContext);

    useEffect(() => {
        setSearchQuery(searchTerm);
        fetchProperties(searchTerm);
    }, [searchTerm]);

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
        fetchProperties(searchQuery, propertyTypes, epcRatings);
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
                    onChange={handleSearchChange}
                    placeholder={t.search}
                />
                <button className='stylingFilterButton' onClick={handleFetchProperties}>
                    {t.findProperties}
                </button>
            </div>

            {/* Property Type Filter with TTS */}
            <div className="propertyTypeFilterTitle">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TextToSpeech
                        text={`${t.propertyTypes}: ${t.propertyTypeOptions.join(', ')}`}
                        language={language}
                    />
                    <label><strong>{t.propertyTypes}</strong></label>
                </div>
                <div className="propertyTypeFilter">
                    {t.propertyTypeOptions.map((type, index) => (
                        <label key={index}>
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

            {/* EPC Rating Filter with TTS */}
            <div className="ratingLetterFilterTitle">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TextToSpeech
                        text={`${t.epcRatings}: A, B, C, D, E, F, G`}
                        language={language}
                    />
                    <label><strong>{t.epcRatings}</strong></label>
                </div>
                <div className="ratingLetterFilter">
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
        </div>
    );
};

export default PropertyFilter;
