import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import FavoriteStar from './FavouriteStar';
import './PropertyList.css';
import translations from '../locales/translations_propertylist'; 
import { PropertyContext } from '../Components/utils/propertyContext';

const PropertyList = ({ loading, language }) => {
  const { properties, sortProperties, getNewPage } = useContext(PropertyContext);
  const [viewMode, setViewMode] = useState('table'); 
  const [popupMessage, setPopupMessage] = useState(''); 
  const [showPopup, setShowPopup] = useState(false); 
  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState("current_energy_rating");
  const [selectedProperties, setSelectedProperties] = useState([]);

  useEffect(() => {
    getNewPage(page);
  }, [page]);

  const t = translations[language] || translations.en; 

  const handleToggleFavorite = (propertyData, isFavorited) => {
    setPopupMessage(
      isFavorited
        ? `${propertyData?.address || 'This property'} has been favorited.`
        : `${propertyData?.address || 'This property'} has been unfavorited.`
    );
    setShowPopup(true);
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

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortValue(newSort);
    sortProperties(newSort, 'asc');
  };

  const handlePageChange = (direction) => {
    setPage(page + direction);
  };

  const handleCheckboxChange = (property) => {
    setSelectedProperties((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(property.uprn);
      if (isAlreadySelected) {
        return prevSelected.filter((id) => id !== property.uprn);
      } else if (prevSelected.length < 4) {
        return [...prevSelected, property.uprn];
      }
      return prevSelected;
    });
  };

  // Limit to first 12 properties for the card view
  const limitedProperties = properties.slice(0, 12);

  return (
    <div className='property-list'>
      <div className='property-list-header'>
        <div className='sort-container'>
          <label>Sort By</label>
          <select value={sortValue} onChange={handleSortChange}>
            <option value="address">Address</option>
            <option value="postcode">Postcode</option>
            <option value="property_type">Property Type</option>
            <option value="current_energy_rating">Energy Rating</option>
            <option value="current_energy_efficiency">Energy Efficiency</option>
          </select>
        </div>

        <h2>{t.propertyList}</h2>

        {showPopup && <div className="popup">{popupMessage}</div>}

        {/* View Mode Toggle & Compare Button */}
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

          {/* Compare Button */}
          <button
            className={`compare-button ${selectedProperties.length === 4 ? 'green' : 'red'}`}
            disabled={selectedProperties.length === 0}
          >
            Compare ({selectedProperties.length}/4)
          </button>
        </div>
      </div>

      {/* Conditional Rendering Based on View Mode */}
      <div className="property-list-content">
        {viewMode === 'table' ? (
          <table className="table-view">
            <thead>
              <tr>
                <th>{t.address}</th>
                <th>{t.postcode}</th>
                <th>{t.propertyType}</th>
                <th>{t.currentEnergyRating}</th>
                <th>{t.currentEnergyEfficiency}</th>
                <th>{t.favorite}</th>
                <th className="compare-header">Compare ({selectedProperties.length}/4)</th>
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
                  <td className="compare-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.uprn)}
                      onChange={() => handleCheckboxChange(property)}
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
      
        {/* Pagination */}
        <div className='pagination'>
          <button onClick={() => handlePageChange(-1)} disabled={page === 1}>
            Previous
          </button>
          <button onClick={() => handlePageChange(1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
