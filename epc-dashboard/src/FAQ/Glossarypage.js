import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './GlossaryPage.css';
import translations from '../locales/translations_glossarypage'; // Import translations

const GlossaryPage = ({ language }) => {
  const location = useLocation();
  const hash = location.hash.slice(1);
  const glossaryRefs = useRef({});
  const { title, glossary } = translations[language] || translations.en; // Load translations

  // Scroll to the relevant definition when the hash changes
  useEffect(() => {
    if (hash && glossaryRefs.current[hash]) {
      glossaryRefs.current[hash].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [hash]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
      {Object.entries(glossary).map(([section, terms]) => (
        <div key={section} style={{ marginBottom: '40px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{section}</h3>
          {Object.entries(terms).map(([key, { label, description }]) => (
            <div
              key={key}
              ref={(el) => (glossaryRefs.current[key] = el)}
              id={key}
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: key === hash ? '2px solid blue' : '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: key === hash ? '#f0f8ff' : 'white',
                textAlign: 'left',
              }}
            >
              <h4>{label}</h4>
              <p>{description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GlossaryPage;
