import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import FavoriteStar from './FavoriteStar';
import './PropertyList.css';
import translations from '../locales/translations_propertylist';
import { PropertyContext } from '../Components/utils/propertyContext';
import TextToSpeech from '../Components/utils/TextToSpeech';  // Import TTS component

const PropertyList = ({ loading, language }) => {
  const [viewMode, setViewMode] = useState('table');
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const { properties, getNewPage, sortProperties, page } = useContext(PropertyContext);
  const [sortValue, setSortValue] = useState("sort_by");
  const [sortOrder, setSortOrder] = useState("order");
  const expectedPageSize = 30; // Number of properties per page


  useEffect(() => {
    getNewPage(page);  // Load the first page when component mounts
  }, [page]);

  if (loading) return <p>{t.loading}</p>;
  if (properties.length === 0) return <p>{t.noProperties}</p>;

  const handlePageChange = (newPage) => {
    if (newPage < 1) return; // Prevent invalid fetch
    getNewPage(newPage);
  };

  const handleSortChange = (event) => {
    const newSortValue = event.target.value;
    setSortValue(newSortValue);
    sortProperties(newSortValue, sortOrder);
  };

  const handleOrderChange = (event) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);
    sortProperties(sortValue, newSortOrder);
  };

  const toggleCompareSelection = (uprn) => {
    setSelectedForComparison((prevSelection) => {
      if (prevSelection.includes(uprn)) {
        return prevSelection.filter((id) => id !== uprn);
      } else if (prevSelection.length < 4) {
        return [...prevSelection, uprn];
      } else {
        alert("You can only compare up to 4 properties.");
        return prevSelection;
      }
    });
  };

  const handleCompareClick = () => {
    if (selectedForComparison.length < 2 || selectedForComparison.length > 4) {
      alert("You must select between 2 and 4 properties to compare.");
      return;
    }
    navigate("/compare-results", { state: { selectedProperties: selectedForComparison } });
  };

  // Popup message for favoriting/unfavoriting
  const handleToggleFavorite = (propertyData, isFavorited) => {
    setPopupMessage(
      isFavorited
        ? `${propertyData?.address || 'This property'} has been favorited.`
        : `${propertyData?.address || 'This property'} has been unfavorited.`
    );
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);  // Hide popup after 5 seconds
  };

  return (
    <div className="property-list">

      {/* Show Popup for Favorites */}
      {showPopup && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}

      <div className="property-list-header">
        {/* Sort Dropdown with TTS */}
        <div className="sort-container">
          <div className="dropdown-with-tts">
            <label>{t.sortBy}</label>
            <TextToSpeech
              text={`${t.sortBy}. ${t.address}, ${t.postcode}, ${t.propertyType}, ${t.currentEnergyRating}, ${t.currentEnergyEfficiency}`}
              language={language}
            />
          </div>
          <select value={sortValue} onChange={handleSortChange}>
            <option value="sort_by">{t.sortByDefault}</option>
            <option value="address">{t.address}</option>
            <option value="postcode">{t.postcode}</option>
            <option value="property_type">{t.propertyType}</option>
            <option value="current_energy_rating">{t.currentEnergyRating}</option>
            <option value="current_energy_efficiency">{t.currentEnergyEfficiency}</option>
          </select>

          {/* Order Dropdown with TTS */}
          <div className="dropdown-with-tts">
            <label>{t.order}</label>
            <TextToSpeech
              text={`${t.order}. ${t.ascending}, ${t.descending}`}
              language={language}
            />
          </div>
          <select value={sortOrder} onChange={handleOrderChange}>
            <option value="order">{t.order}</option>
            <option value="asc">{t.ascending}</option>
            <option value="desc">{t.descending}</option>
          </select>
        </div>
      </div>

      {/* View Mode Toggle & Compare Button */}
      <div className="view-toggle-container">
        <div className="view-toggle">
          <button onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'active' : ''}>
            {t.tableView}
          </button>
          <button onClick={() => setViewMode('card')} className={viewMode === 'card' ? 'active' : ''}>
            {t.cardView}
          </button>
        </div>

        <button
          className={`compare-button ${selectedForComparison.length >= 2 ? "green" : "gray"}`}
          onClick={handleCompareClick}
          disabled={selectedForComparison.length < 2}
        >
          {t.compare} ({selectedForComparison.length}/4)
        </button>
      </div>

      {/* Conditional Table View */}
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
              <th>{t.compare}</th>
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
                    checked={selectedForComparison.includes(property.uprn)}
                    onChange={() => toggleCompareSelection(property.uprn)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="property-cards-container">
          {properties.map((property, index) => (
            <div key={index} className="property-card">
              <TopRatedPropertyCard property={property} language={language} />
              <div className="compare-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedForComparison.includes(property.uprn)}
                    onChange={() => toggleCompareSelection(property.uprn)}
                  />
                  {t.compare}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div>
        <button
          className="paginationPrevious"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="paginationNext"
          onClick={() => handlePageChange(page + 1)}
          disabled={properties.length < expectedPageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertyList;
