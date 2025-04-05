import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../homePage/PropertyCard';
import FavouriteStar from './FavouriteStar';
import './PropertyList.css';
import translations from '../locales/translations_propertylist';
import { PropertyContext } from '../Components/utils/propertyContext';
import { FavouriteContext } from '../Components/utils/favouriteContext';

const PropertyList = ({ user, loading, language }) => {
  const [viewMode, setViewMode] = useState('card');
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const { addFavourite, removeFavourite, isFavourited } = useContext(FavouriteContext);
  const { properties, getNewPage, sortProperties, page } = useContext(PropertyContext);
  const [sortValue, setSortValue] = useState("sort_by");
  const [sortOrder, setSortOrder] = useState("order");
  const expectedPageSize = 30;
  
  useEffect(() => {

    if (window.innerWidth <= 910) {
      setViewMode('card');
    }

    const handleResize = () => {
      if (window.innerWidth <= 910) {
        setViewMode('card');
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading===true) return <p>{t.loading}</p>;
  if (properties.length === 0) return <p>{t.noProperties}</p>;

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
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
    setSelectedForComparison((prevSelection) =>
      prevSelection.includes(uprn)
        ? prevSelection.filter((id) => id !== uprn)
        : prevSelection.length < 4
          ? [...prevSelection, uprn]
          : prevSelection
    );
  };


  const handleCompareClick = () => {
    if (selectedForComparison.length < 2 || selectedForComparison.length > 4) {
      alert("You must select between 2 and 4 properties to compare.");
      return;
    }
    navigate("/compare-results", { state: { selectedProperties: selectedForComparison } });
  };

  return (
    <div className="property-list">
      {showPopup && <div className="popup-message">{popupMessage}</div>}

      <div className="property-list-header">
        {/* View Mode Toggle (Center) */}
        <div className="view-toggle-container">
          <div className="view-toggle">
            <button onClick={() => setViewMode('card')} className={viewMode === 'card' ? 'active' : ''}>
              {t.cardView}
            </button>
            <button onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'active' : ''}>
              {t.tableView}
            </button>
          </div>
        </div>

        {/* Compare Button (Right) */}
        <div className="compare-button-container">
          <button className={`compare-button ${selectedForComparison.length >= 2 ? "green" : "gray"}`} onClick={handleCompareClick} disabled={selectedForComparison.length < 2}>
            {t.compare} ({selectedForComparison.length}/4)
          </button>
        </div>

        {/* Sort Container (Right) */}
        <div className="sort-container">
          <label>{t.sortBy}</label>
          <select value={sortValue} onChange={handleSortChange}>
            <option value="sort_by">{t.sortByDefault}</option>
            <option value="number_bedrooms">Number of bedrooms</option>
            <option value="current_energy_rating">{t.currentEnergyRating}</option>
            <option value="current_energy_efficiency">{t.currentEnergyEfficiency}</option>
          </select>

          <label>{t.order}</label>
          <select value={sortOrder} onChange={handleOrderChange}>
            <option value="order">{t.order}</option>
            <option value="asc">{t.ascending}</option>
            <option value="desc">{t.descending}</option>
          </select>
        </div>
      </div>

      {viewMode === 'table' ? (
        <table className="table-view">
          <thead>
            <tr>
              <th>{t.address}</th>
              <th>{t.postcode}</th>
              <th>{t.propertyType}</th>
              <th>Number of bedrooms</th>
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
                  <Link to={`/property/${property.uprn}`}>{property.address.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</Link>
                </td>
                <td>{property.postcode}</td>
                <td>{property.property_type}</td>
                <td>{property.number_bedrooms}</td>
                <td>{property.current_energy_rating}</td>
                <td>{property.current_energy_efficiency}</td>
                <td>
                  <FavouriteStar
                    user={user}
                    property={property}
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
              <PropertyCard user={user} property={property} language={language} />
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
      <div className="pageNumber">
        Page Number: {page}
      </div>
      <div className="pagination-container">
        <button
          className="paginationPrevious"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          {t.previous}
        </button>

        <button
          className="paginationNext"
          onClick={() => handlePageChange(page + 1)}
          disabled={properties.length < expectedPageSize}
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default PropertyList;
