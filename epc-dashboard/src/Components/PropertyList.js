import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import FavoriteStar from './FavoriteStar';
import './PropertyList.css';

const PropertyList = ({ properties, loading, language }) => {
  const [viewMode, setViewMode] = useState('table'); // State to toggle between 'table' and 'card' views
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup

  // Translations
  const translations = {
    en: {
      propertyList: 'Property List',
      tableView: 'Table View',
      cardView: 'Card View',
      loading: 'Loading...',
      noProperties: 'No properties found.',
      address: 'Address',
      postcode: 'Postcode',
      propertyType: 'Property Type',
      currentEnergyRating: 'Current Energy Rating',
      currentEnergyEfficiency: 'Current Energy Efficiency',
      favorite: 'Favorite',
    },
    fr: {
      propertyList: 'Liste des propriétés',
      tableView: 'Vue tableau',
      cardView: 'Vue carte',
      loading: 'Chargement...',
      noProperties: 'Aucune propriété trouvée.',
      address: 'Adresse',
      postcode: 'Code Postal',
      propertyType: 'Type de Propriété',
      currentEnergyRating: 'Classement Énergétique Actuel',
      currentEnergyEfficiency: 'Efficacité Énergétique Actuelle',
      favorite: 'Favori',
    },
    es: {
      propertyList: 'Lista de Propiedades',
      tableView: 'Vista de Tabla',
      cardView: 'Vista de Tarjeta',
      loading: 'Cargando...',
      noProperties: 'No se encontraron propiedades.',
      address: 'Dirección',
      postcode: 'Código Postal',
      propertyType: 'Tipo de Propiedad',
      currentEnergyRating: 'Clasificación Energética Actual',
      currentEnergyEfficiency: 'Eficiencia Energética Actual',
      favorite: 'Favorito',
    },
  };

  const t = translations[language] || translations.en; // Default to English

  // Handle toggle favorite to show popup
  const handleToggleFavorite = (propertyData, isFavorited) => {
    setPopupMessage(
      isFavorited
        ? `${propertyData?.address || 'This property'} has been favorited.`
        : `${propertyData?.address || 'This property'} has been unfavorited.`
    );
    setShowPopup(true);

    // Hide the popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  if (loading) {
    return <p>{t.loading}</p>;
  }

  if (properties.length === 0) {
    return <p>{t.noProperties}</p>;
  }

  // Limit to first 12 properties for the card view
  const limitedProperties = properties.slice(0, 12);

  return (
    <div className="property-list">
      <h2>{t.propertyList}</h2>

      {/* Popup for favoriting/unfavoriting */}
      {showPopup && <div className="popup">{popupMessage}</div>}

      {/* View Mode Toggle */}
      <div className="view-toggle">
        <button
          onClick={() => setViewMode('table')}
          className={viewMode === 'table' ? 'active' : ''}
        >
          {t.tableView}
        </button>
        <button
          onClick={() => setViewMode('card')}
          className={viewMode === 'card' ? 'active' : ''}
        >
          {t.cardView}
        </button>
      </div>

      {/* Conditional Rendering Based on View Mode */}
      {viewMode === 'table' ? (
        <table>
          <thead>
            <tr>
              <th>{t.address}</th>
              <th>{t.postcode}</th>
              <th>{t.propertyType}</th>
              <th>{t.currentEnergyRating}</th>
              <th>{t.currentEnergyEfficiency}</th>
              <th>{t.favorite}</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/property/${property.uprn}`}>{property.address}</Link>
                </td>
                <td>{property.postcode}</td>
                <td>{property.property_type}</td>
                <td>{property.current_energy_rating}</td>
                <td>{property.current_energy_efficiency}</td>
                <td>
                  <FavoriteStar
                    propertyData={property}
                    onToggle={handleToggleFavorite}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="property-cards-container">
          {limitedProperties.map((property, index) => (
            <TopRatedPropertyCard property={property} key={index} language={language} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
