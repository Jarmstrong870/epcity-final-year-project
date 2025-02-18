import React from "react";
import translations from "../../locales/translations_dropdown"; // Import translations
import "./DropdownSelector.css";

const DropdownSelector = ({
  categories,
  locations,
  activeCategories,
  selectedLocation,
  setSelectedLocation,
  fetchRoute,
  travelMode,
  setTravelMode,
  language, // Receive language prop
}) => {
  const t = translations[language] || translations.en; // Get translations based on language

  //  Ensure at least one category is active before enabling the dropdown
  const isDropdownEnabled = Object.values(activeCategories).some((isActive) => isActive);

  return (
    <div className="dropdown-selector">
      {/* Destination Selector */}
      <div>
        <label htmlFor="destination">{t.selectDestination}</label>
        <select
          id="destination"
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            fetchRoute(e.target.value);
          }}
          value={selectedLocation || ""}
          disabled={!isDropdownEnabled} //  Dropdown is enabled when categories are active
        >
          <option value="" disabled>{t.selectLocation}</option>
          {Object.keys(categories).map((category) =>
            activeCategories[category] ? (
              <optgroup key={category} label={categories[category]}>
                {Object.keys(locations)
                  .filter((loc) => locations[loc].category === category)
                  .map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </optgroup>
            ) : null
          )}
        </select>
      </div>

      {/* Travel Mode Selector */}
      <div>
        <label htmlFor="travel-mode">{t.travelMode}</label>
        <select id="travel-mode" onChange={(e) => setTravelMode(e.target.value)} value={travelMode}>
          <option value="DRIVING">{t.driving}</option>
          <option value="WALKING">{t.walking}</option>
          <option value="BICYCLING">{t.bicycling}</option>
          <option value="TRANSIT">{t.transit}</option>
        </select>
      </div>
    </div>
  );
};

export default DropdownSelector;
