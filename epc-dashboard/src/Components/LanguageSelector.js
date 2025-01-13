import React, { useState } from 'react';
import ukFlag from '../assets/uk-flag.png';
import frenchFlag from '../assets/french-flag.png';
import spanishFlag from '../assets/spanish-flag.png';
import './LanguageSelector.css'; // Styles for the component

function LanguageSelector({ setLanguage }) {
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('UK'); // Default to UK

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!languageDropdownVisible);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language); // Update the local state for flag selection
    setLanguage(language === 'UK' ? 'en' : language === 'FR' ? 'fr' : 'es'); // Update App's global state
    setLanguageDropdownVisible(false);
  };

  return (
    <div className="language-selector">
      <img
        src={
          selectedLanguage === 'UK'
            ? ukFlag
            : selectedLanguage === 'FR'
            ? frenchFlag
            : spanishFlag
        }
        alt="Selected Language"
        className="flag-img"
        onClick={toggleLanguageDropdown} // Toggle dropdown on flag click
      />
      {languageDropdownVisible && (
        <div className="language-dropdown-menu">
          <div onClick={() => handleLanguageChange('UK')}>
            <img src={ukFlag} alt="UK Flag" className="flag-img-dropdown" /> English
          </div>
          <div onClick={() => handleLanguageChange('FR')}>
            <img src={frenchFlag} alt="French Flag" className="flag-img-dropdown" /> French
          </div>
          <div onClick={() => handleLanguageChange('ES')}>
            <img src={spanishFlag} alt="Spanish Flag" className="flag-img-dropdown" /> Spanish
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
