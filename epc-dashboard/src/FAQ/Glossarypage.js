import React, { useEffect, useRef } from 'react';
// Import React hooks: `useEffect` for side effects and `useRef` for referencing DOM elements.
import { useLocation } from 'react-router-dom';
// Import `useLocation` to access the current URL, including the hash for scrolling.
import './GlossaryPage.css';
// Import CSS styles specific to the GlossaryPage component.
import translations from '../locales/translations_glossarypage';
// Import translation data for different languages.

const GlossaryPage = ({ language }) => {
  const location = useLocation(); // Get the current location (URL and hash).
  const hash = location.hash.slice(1); // Extract the hash from the URL (e.g., #term).
  const glossaryRefs = useRef({}); // Create a ref to store references to glossary terms.

  // Load translations based on the selected language; default to English if not available.
  const { title, glossary } = translations[language] || translations.en;

  // Automatically scroll to the term referenced by the hash when the hash changes.
  useEffect(() => {
    if (hash && glossaryRefs.current[hash]) {
      glossaryRefs.current[hash].scrollIntoView({
        behavior: 'smooth', // Smooth scrolling animation.
        block: 'center', // Scroll so the term appears in the center of the viewport.
      });
    }
  }, [hash]); // Dependency array ensures this runs whenever the hash changes.

  return (
    <div style={{ padding: '20px' }}>
      {/* Display the glossary page title */}
      <h2 style={{ textAlign: 'center' }}>{title}</h2>

      {/* Iterate over each section of the glossary */}
      {Object.entries(glossary).map(([section, terms]) => (
        <div key={section} style={{ marginBottom: '40px' }}>
          {/* Display the section title */}
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{section}</h3>

          {/* Iterate over each term in the section */}
          {Object.entries(terms).map(([key, { label, description }]) => (
            <div
              key={key} // Unique key for each term.
              ref={(el) => (glossaryRefs.current[key] = el)} // Store a reference to the DOM element for scrolling.
              id={key} // Set the ID to allow linking to this term.
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: key === hash ? '2px solid blue' : '1px solid #ccc', // Highlight the term if it matches the hash.
                borderRadius: '5px',
                backgroundColor: key === hash ? '#f0f8ff' : 'white', // Change background color if highlighted.
                textAlign: 'left',
              }}
            >
              {/* Display the term label */}
              <h4>{label}</h4>
              {/* Display the term description */}
              <p>{description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GlossaryPage;
// Export the GlossaryPage component for use in other parts of the application.
