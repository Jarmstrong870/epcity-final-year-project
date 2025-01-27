import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyFinder.css';
import translations from '../locales/translations_propertyfinder'; // Import translations

const PropertyFinder = ({ language }) => {
  const [userSearch, setUserSearch] = useState(''); // User input for postcode or address
  const [inputError, setInputError] = useState(''); // Error handling
  const [matchingProperties, setMatchingProperties] = useState([]); // List of matching properties
  const navigate = useNavigate();

  const t = translations[language] || translations.en; // Load translations

  const handleUserSearch = async () => {
    setInputError(''); // Clear previous errors
    setMatchingProperties([]); // Reset results

    if (!userSearch.trim()) {
      setInputError(t.errorEmptyInput);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/property/alter?search=${encodeURIComponent(userSearch.trim())}`
      );

      if (!response.ok) {
        throw new Error(t.errorFetch);
      }

      const properties = await response.json();

      if (!properties.length) {
        setInputError(t.errorNoProperties);
        return;
      }

      // If multiple properties match, display them
      setMatchingProperties(properties);

      // If only one property matches, navigate to its individual page
      if (properties.length === 1) {
        navigate(`/property/${encodeURIComponent(properties[0].uprn)}`);
      }
    } catch (error) {
      setInputError(error.message || t.errorFetch);
    }
  };

  return (
    <div className="propertyPopUp">
      <h1>{t.title}</h1>
      <p>{t.description}</p>
      <input
        type="text"
        value={userSearch}
        onChange={(e) => {
          setUserSearch(e.target.value);
          setInputError(''); // Clear error on input change
        }}
        placeholder={t.placeholder}
        className="input-text"
      />
      {inputError && <p className="error-message">{inputError}</p>}
      <button onClick={handleUserSearch} className="search-button">
        {t.searchButton}
      </button>

      {/* Display list of matching properties */}
      {matchingProperties.length > 1 && (
        <div className="results-container">
          <h2>{t.matchingProperties}</h2>
          <table>
            <thead>
              <tr>
                <th>{t.tableHeaders.address}</th>
                <th>{t.tableHeaders.postcode}</th>
                <th>{t.tableHeaders.propertyType}</th>
                <th>{t.tableHeaders.energyRating}</th>
              </tr>
            </thead>
            <tbody>
              {matchingProperties.map((property) => (
                <tr key={property.uprn}>
                  <td>
                    <button
                      className="property-link"
                      onClick={() =>
                        navigate(`/property/${encodeURIComponent(property.uprn)}`)
                      }
                    >
                      {property.address}
                    </button>
                  </td>
                  <td>{property.postcode}</td>
                  <td>{property.property_type}</td>
                  <td>{property.current_energy_rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyFinder;
