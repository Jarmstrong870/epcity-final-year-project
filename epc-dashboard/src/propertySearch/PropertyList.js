import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from '../homePage/TopRatedPropertyCard';
import FavoriteStar from './FavoriteStar';
import './PropertyList.css';
import translations from '../locales/translations_propertylist';
import { PropertyContext } from '../Components/utils/propertyContext';

const PropertyList = ({ loading, language }) => {
  const [viewMode, setViewMode] = useState('table'); // Toggle between 'table' and 'card' views
  const [selectedForComparison, setSelectedForComparison] = useState([]); // Stores selected properties

  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const { properties, getNewPage, sortProperties } = useContext(PropertyContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortValue, setSortValue] = useState("current_energy_rating");

  if (loading) return <p>{t.loading}</p>;
  if (properties.length === 0) return <p>{t.noProperties}</p>;

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setPageNumber(newPage);
      getNewPage(newPage);
    }
  };

  const handleSortChange = (event) => {
    const newSortValue = event.target.value;
    setSortValue(newSortValue);
    sortProperties(newSortValue);
  };

  // Select/Deselect properties for comparison
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

  // Redirect to Compare Page
  const handleCompareClick = () => {
    if (selectedForComparison.length !== 4) {
      alert("You must select exactly 4 properties to compare.");
      return;
    }

    console.log(" Navigating with selected properties:", selectedForComparison);
    navigate("/compare-results", { state: { selectedProperties: selectedForComparison } });
  };

  return (
    <div className="property-list">
      <div className="property-list-header">
        <h2>Property List</h2>

        {/* Sort Dropdown */}
        <div className="sort-container">
          <label>Sort By:</label>
          <select value={sortValue} onChange={handleSortChange}>
            <option value="address">Address</option>
            <option value="postcode">Postcode</option>
            <option value="property_type">Property Type</option>
            <option value="current_energy_rating">Current Energy Rating</option>
            <option value="current_energy_efficiency">Current Energy Efficiency</option>
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

        {/* Compare Button with Dynamic Count */}
        <button
          className={`compare-button ${selectedForComparison.length >= 2 ? "green" : "gray"}`}
          onClick={handleCompareClick}
          disabled={selectedForComparison.length < 4}
        >
          Compare ({selectedForComparison.length}/4)
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
              <th>COMPARE</th>  {/* ✅ Fixed the Compare Column Header */}
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
                  <FavoriteStar propertyData={property} />
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
          {properties.slice(0, 12).map((property, index) => (
            <TopRatedPropertyCard property={property} key={index} language={language} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => handlePageChange(pageNumber - 1)}>back page</button>
        <button onClick={() => handlePageChange(pageNumber + 1)}>forward page</button>
      </div>
    </div>
  );
};

export default PropertyList;
