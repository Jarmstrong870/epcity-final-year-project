import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import FavoriteStar from './FavouriteStar';
import './PropertyList.css';
import translations from '../locales/translations_propertylist'; // Import translations
import { PropertyContext } from '../Components/utils/propertyContext';

/* 
    Property List (View All Properties) page is used to display all of the data records we have saved in our 
    database. Property addresses can be viewed in table view or card view and the relevant details will be displayed
    for users to click into the property page and is navigated to the Property Page with more information 

    The Favourite Star component has been included so users can favourite a property once they have read more 
    infromation about the property's efficiency
  
*/


const PropertyList = ({ loading, language }) => {
  const { properties, sortProperties, getNewPage } = useContext(PropertyContext);
  const [viewMode, setViewMode] = useState('table'); // State to toggle between 'table' and 'card' views
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup
  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState("current_energy_rating");

  useEffect(() => {
    getNewPage(page);
  }, [page]);

  const t = translations[language] || translations.en; // Load translations

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

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortValue(newSort)
    const newOrder = 'asc'; // Toggle order
    sortProperties(newSort, newOrder); // Sorting keeps current filters and resets page to 1
  };

  const handlePageChange = (direction) => {
    setPage(page + direction)
  };

  // Limit to first 12 properties for the card view
  const limitedProperties = properties.slice(0, 12);

  return (
    <div className='property-list'>
      <div className='property-list-header'>
        {/* Sort Dropdown */}
        <div className='sort-containor'>
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
      </div>

        {/* Conditional Rendering Based on View Mode */}
      <div className="property-list-content">
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
