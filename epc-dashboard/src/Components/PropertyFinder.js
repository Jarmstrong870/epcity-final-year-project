import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyFinder.css';

const PropertyFinder = ({ language }) => {
  const [userSearch, setUserSearch] = useState(''); // User input for postcode or address
  const [inputError, setInputError] = useState(''); // Error handling
  const [matchingProperties, setMatchingProperties] = useState([]); // List of matching properties
  const navigate = useNavigate();

  // Translation object
  const translations = {
    en: {
      title: "Find Your Property's EPC",
      description: "Enter your postcode or address to search for your property:",
      placeholder: "Enter postcode or address",
      searchButton: "Search",
      errorEmptyInput: "Please enter a valid postcode or address.",
      errorNoProperties: "No properties found matching this address or postcode.",
      errorFetch: "An error occurred while searching.",
      matchingProperties: "Matching Properties",
      tableHeaders: {
        address: "Address",
        postcode: "Postcode",
        propertyType: "Property Type",
        energyRating: "Current Energy Rating",
      },
    },
    fr: {
      title: "Trouvez le DPE de votre propriété",
      description: "Entrez votre code postal ou adresse pour rechercher votre propriété :",
      placeholder: "Entrez le code postal ou l'adresse",
      searchButton: "Rechercher",
      errorEmptyInput: "Veuillez entrer un code postal ou une adresse valide.",
      errorNoProperties: "Aucune propriété ne correspond à cette adresse ou ce code postal.",
      errorFetch: "Une erreur s'est produite lors de la recherche.",
      matchingProperties: "Propriétés correspondantes",
      tableHeaders: {
        address: "Adresse",
        postcode: "Code Postal",
        propertyType: "Type de Propriété",
        energyRating: "Classement Énergétique Actuel",
      },
    },
    es: {
      title: "Encuentra el EPC de tu propiedad",
      description: "Introduce tu código postal o dirección para buscar tu propiedad:",
      placeholder: "Introduce código postal o dirección",
      searchButton: "Buscar",
      errorEmptyInput: "Por favor, introduce un código postal o dirección válida.",
      errorNoProperties: "No se encontraron propiedades que coincidan con esta dirección o código postal.",
      errorFetch: "Ocurrió un error durante la búsqueda.",
      matchingProperties: "Propiedades coincidentes",
      tableHeaders: {
        address: "Dirección",
        postcode: "Código Postal",
        propertyType: "Tipo de Propiedad",
        energyRating: "Clasificación Energética Actual",
      },
    },
  };

  const t = translations[language] || translations.en;

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
