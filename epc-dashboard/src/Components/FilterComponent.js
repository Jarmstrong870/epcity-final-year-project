import React, { useState } from 'react';
import './Filter.css'

const PropertyFilter = ({ onFilterChange, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [epcRatings, setEpcRatings] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortValue, setSortValue] = useState('current_energy_rating');

  // Translations
  const translations = {
    en: {
      search: 'Search by Address or Postcode:',
      propertyTypes: 'Property Types:',
      epcRatings: 'EPC Ratings:',
      findProperties: 'Find Properties',
      pageNumber: 'Page Number:',
      sortBy: 'Sort By:',
      sortOptions: {
        address: 'Address',
        postcode: 'Postcode',
        property_type: 'Property Type',
        current_energy_rating: 'Current Energy Rating',
        current_energy_efficiency: 'Current Energy Efficiency',
      },
    },
    fr: {
      search: 'Rechercher par adresse ou code postal :',
      propertyTypes: 'Types de propriété :',
      epcRatings: 'Classements EPC :',
      findProperties: 'Trouver des propriétés',
      pageNumber: 'Numéro de page :',
      sortBy: 'Trier par :',
      sortOptions: {
        address: 'Adresse',
        postcode: 'Code Postal',
        property_type: 'Type de Propriété',
        current_energy_rating: 'Classement Énergétique Actuel',
        current_energy_efficiency: 'Efficacité Énergétique Actuelle',
      },
    },
    es: {
      search: 'Buscar por dirección o código postal:',
      propertyTypes: 'Tipos de propiedad:',
      epcRatings: 'Clasificaciones EPC:',
      findProperties: 'Encontrar propiedades',
      pageNumber: 'Número de página:',
      sortBy: 'Ordenar por:',
      sortOptions: {
        address: 'Dirección',
        postcode: 'Código Postal',
        property_type: 'Tipo de Propiedad',
        current_energy_rating: 'Clasificación Energética Actual',
        current_energy_efficiency: 'Eficiencia Energética Actual',
      },
    },
  };

  const t = translations[language] || translations.en;

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
    <div className = "baseStyling">
      <form onSubmit={handleFilterSubmit}>
<<<<<<< HEAD
        {/* Search Input */}
        <div className="searchAddress">
          <label htmlFor="searchQuery"><strong>Search by Address or Postcode:</strong></label>
          <input className = "searchInput"
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Property Type Filter (Checkboxes) */}
        <div className = "propertyTypeFilter">
          <label><strong>Property Types:</strong></label>
=======
        <div>
          <label htmlFor="searchQuery">{t.search}</label>
          <input type="text" id="searchQuery" value={searchQuery} onChange={handleSearchChange} />
        </div>

        <div>
          <label>{t.propertyTypes}</label>
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
          <div>
            {['bungalow', 'flat', 'house', 'maisonette'].map((type) => (
              <label key={type}>
                <input type="checkbox" value={type} onChange={handlePropertyTypeChange} />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* EPC Rating Filter (Checkboxes) */}
        <div className = "ratingLetterFilter">
          <label><strong>EPC Ratings:</strong></label>
=======
        <div>
          <label>{t.epcRatings}</label>
>>>>>>> 84b1b27d892a63ffe830f249d681a328ad43e64d
          <div>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((rating) => (
              <label key={rating}>
                <input type="checkbox" value={rating} onChange={handleEpcRatingChange} />
                {rating}
              </label>
            ))}
          </div>
        </div>

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

        <div>
          <button type="submit">{t.findProperties}</button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilter;
