import React, { useState, useEffect } from 'react';
import ukFlag from '../assets/uk_flag.png';
import frenchFlag from '../assets/french_flag.jpg';
import spanishFlag from '../assets/spanish_flag.png';
import polishFlag from '../assets/polish_flag.png';  
import mandarinFlag from '../assets/mandarin_flag.png';  
import { translations } from '../locales/translations_languageselector'; // Correct relative path
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
  const [currentTranslations, setCurrentTranslations] = useState(translations.en);  // Default to English

  useEffect(() => {
    // Update translations based on the selected language
    const selectedTranslations = translations[selectedLanguage.toLowerCase()];
    
    if (selectedTranslations) {
      setCurrentTranslations(selectedTranslations);
    } else {
      console.error(`Translations for language ${selectedLanguage} not found, falling back to English.`);
      setCurrentTranslations(translations.en);  // Fallback to English if translation is missing
    }

    const langMap = {
      UK: 'en',
      FR: 'fr',
      ES: 'es',
      PL: 'pl',
      CN: 'zh'
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
              />
              {' '}{currentTranslations.languageSelector ? currentTranslations.languageSelector[lang.label.toLowerCase()] : lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
