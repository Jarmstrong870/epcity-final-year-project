import React, { useState, useEffect } from 'react';
import ukFlag from '../assets/uk_flag.png';
import frenchFlag from '../assets/french_flag.jpg';
import spanishFlag from '../assets/spanish_flag.png';
import './LanguageSelector.css';

const languages = [
  { code: 'UK', label: 'English', flag: ukFlag },
  { code: 'FR', label: 'French', flag: frenchFlag },
  { code: 'ES', label: 'Spanish', flag: spanishFlag },
];

function LanguageSelector({ setLanguage }) {
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

  // Initialize selectedLanguage from localStorage or default to 'UK'
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'UK'
  );

  useEffect(() => {
    const langMap = {
      UK: 'en',
      FR: 'fr',
      ES: 'es',
    };
    setLanguage(langMap[selectedLanguage]);
  }, [selectedLanguage, setLanguage]);

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible((prev) => !prev);
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);

    const langMap = {
      UK: 'en',
      FR: 'fr',
      ES: 'es',
    };
    setLanguage(langMap[languageCode]);
    setLanguageDropdownVisible(false);
  };

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <div className="language-selector">
      {/* Display selected flag */}
      <button
        className="flag-button"
        onClick={toggleLanguageDropdown}
        aria-expanded={languageDropdownVisible}
        aria-label={`Selected Language: ${selectedLang.label}`}
      >
        <img src={selectedLang.flag} alt={`${selectedLang.label} Flag`} className="flag-img" />
      </button>

      {languageDropdownVisible && (
        <div className="language-dropdown-menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="dropdown-item"
              aria-label={lang.label}
            >
              <img src={lang.flag} alt={`${lang.label} Flag`} className="flag-img-dropdown" />{' '}
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
