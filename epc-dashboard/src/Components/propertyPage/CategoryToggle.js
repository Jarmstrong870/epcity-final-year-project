import React from "react";
import "./CategoryToggle.css"; // Optional styling

const CategoryToggle = ({ categories, activeCategories, toggleCategory }) => {
  return (
    <div className="category-toggle">
      {Object.keys(categories).map((category) => (
        <label key={category} className="toggle-switch">
          <input
            type="checkbox"
            checked={activeCategories[category]}
            onChange={() => toggleCategory(category)}
          />
          <span className="slider"></span> {categories[category]}
        </label>
      ))}
    </div>
  );
};

export default CategoryToggle;
