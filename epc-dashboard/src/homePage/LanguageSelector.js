import React, { useState, useEffect } from 'react';
// Import React hooks: `useState` for managing component state and `useEffect` for side effects.
import ukFlag from '../assets/uk_flag.png';
import frenchFlag from '../assets/french_flag.jpg';
import spanishFlag from '../assets/spanish_flag.png';
// Import flag images for different languages.
import './LanguageSelector.css';
// Import CSS styles specific to the LanguageSelector component.

// Define the list of supported languages with their codes, labels, and flag images.
const languages = [
  { code: 'UK', label: 'English', flag: ukFlag },
  { code: 'FR', label: 'French', flag: frenchFlag },
  { code: 'ES', label: 'Spanish', flag: spanishFlag },
];

function LanguageSelector({ setLanguage }) {
  // State to manage the visibility of the language dropdown menu.
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

  // State to store the currently selected language, initialized from localStorage or defaulting to 'UK'.
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'UK'
  );

  // Update the application's language whenever the selected language changes.
  useEffect(() => {
    const langMap = {
      UK: 'en', // Map 'UK' to English.
      FR: 'fr', // Map 'FR' to French.
      ES: 'es', // Map 'ES' to Spanish.
    };
    setLanguage(langMap[selectedLanguage]); // Update the application's language.
  }, [selectedLanguage, setLanguage]);

  // Toggle the visibility of the language dropdown menu.
  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible((prev) => !prev);
  };

  // Handle a language change when a dropdown item is clicked.
  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode); // Update the selected language state.
    localStorage.setItem('selectedLanguage', languageCode); // Save the selected language to localStorage.

    const langMap = {
      UK: 'en', // Map 'UK' to English.
      FR: 'fr', // Map 'FR' to French.
      ES: 'es', // Map 'ES' to Spanish.
    };
    setLanguage(langMap[languageCode]); // Update the application's language.
    setLanguageDropdownVisible(false); // Close the dropdown menu.
  };

  // Find the currently selected language object from the list of languages.
  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <div className="language-selector">
      {/* Button to display the selected language's flag */}
      <button
        className="flag-button"
        onClick={toggleLanguageDropdown} // Toggle the dropdown menu on click.
        aria-expanded={languageDropdownVisible} // Accessibility: Indicate whether the dropdown is open.
        aria-label={`Selected Language: ${selectedLang.label}`} // Accessibility: Label the button with the selected language.
      >
        <img
          src={selectedLang.flag} // Display the selected language's flag image.
          alt={`${selectedLang.label} Flag`} // Alternative text for the flag image.
          className="flag-img" // CSS class for styling the flag image.
        />
      </button>

      {/* Dropdown menu for selecting a language */}
      {languageDropdownVisible && (
        <div className="language-dropdown-menu">
          {languages.map((lang) => (
            <button
              key={lang.code} // Unique key for each language button.
              onClick={() => handleLanguageChange(lang.code)} // Change the language when clicked.
              className="dropdown-item" // CSS class for styling dropdown items.
              aria-label={lang.label} // Accessibility: Label the button with the language name.
            >
              <img
                src={lang.flag} // Display the language's flag image.
                alt={`${lang.label} Flag`} // Alternative text for the flag image.
                className="flag-img-dropdown" // CSS class for styling dropdown flag images.
              />{' '}
              {lang.label} {/* Display the language name. */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
// Export the LanguageSelector component for use in other parts of the application.
