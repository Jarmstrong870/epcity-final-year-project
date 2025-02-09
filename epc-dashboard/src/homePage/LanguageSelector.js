import React, { useState, useEffect } from 'react';
import ukFlag from '../assets/uk_flag.png';
import frenchFlag from '../assets/french_flag.jpg';
import spanishFlag from '../assets/spanish_flag.png';
import polishFlag from '../assets/polish_flag.png';  
import mandarinFlag from '../assets/mandarin_flag.png';  
import './LanguageSelector.css';

const languages = [
  { code: 'UK', label: 'English', flag: ukFlag },
  { code: 'FR', label: 'French', flag: frenchFlag },
  { code: 'ES', label: 'Spanish', flag: spanishFlag },
  { code: 'PL', label: 'Polish', flag: polishFlag },
  { code: 'CN', label: 'Mandarin', flag: mandarinFlag }
];

function LanguageSelector({ setLanguage }) {
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'UK'
  );

  useEffect(() => {
    const langMap = {
      UK: 'en',  // English
      FR: 'fr',  // French
      ES: 'es',  // Spanish
      PL: 'pl',  // Polish
      CN: 'zh'   // Mandarin (Chinese)
    };
    setLanguage(langMap[selectedLanguage]);
  }, [selectedLanguage, setLanguage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-selector')) {
        setLanguageDropdownVisible(false);
      }
    };

    if (languageDropdownVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [languageDropdownVisible]);

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
      PL: 'pl',
      CN: 'zh'
    };
    setLanguage(langMap[languageCode]);
    setLanguageDropdownVisible(false);
  };

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <div className="language-selector">
      <button
        className="flag-button"
        onClick={toggleLanguageDropdown}
        aria-expanded={languageDropdownVisible}
        aria-label={`Selected Language: ${selectedLang.label}`}
      >
        <img
          src={selectedLang.flag}
          alt={`${selectedLang.label} Flag`}
          className="flag-img"
        />
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
              <img
                src={lang.flag}
                alt={`${lang.label} Flag`}
                className="flag-img-dropdown"
              />{' '}
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
