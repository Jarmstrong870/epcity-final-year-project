import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './GlossaryPage.css';


const GlossaryPage = () => {
  const location = useLocation(); // Get the current URL with the hash
  const hash = location.hash.slice(1); // Remove the '#' from the hash

  const glossaryRefs = useRef({});

  // Glossary terms grouped by sections
  const glossary = {
    'Basic Information': {
      address: 'Location of the property',
      postcode: 'The postcode of the property',
      'property-type': 'Describes the type of property such as House, Flat, Maisonette etc. This is the type differentiator for dwellings.',
    },
    'Energy Performance': {
      'current-energy-rating':
        "Estimated potential energy rating converted into a linear 'A to G' rating (where A is the most energy efficient and G is the least energy efficient).",
      'current-energy-efficiency':
        'Based on cost of energy, i.e. energy required for space heating, water heating and lighting [in kWh/year] multiplied by fuel costs. (£/m²/year where cost is derived from kWh).',
      'potential-energy-efficiency': 'The potential energy efficiency rating of the property.',
      'main-heat-energy-efficiency':
        'Energy efficiency rating. One of: very good; good; average; poor; very poor. On actual energy certificate shown as one to five star rating.',
    },
    'Cost Information': {
      'heating-cost': 'GBP. Current estimated annual energy costs for heating the property.',
      'lighting-cost': 'GBP. Current estimated annual energy costs for lighting the property.',
      'hot-water-cost': 'GBP. Current estimated annual energy costs for hot water.',
    },
    'Property Details': {
      'construction-age-band':
        'Age band when building part constructed. England & Wales only. One of: before 1900; 1900-1929; 1930-1949; 1950-1966; 1967-1975; 1976-1982; 1983-1990; 1991-1995; 1996-2002; 2003-2006; 2007-2011; 2012 onwards.',
      'total-floor-area':
        'The total useful floor area is the total of all enclosed spaces measured to the internal face of the external walls, i.e. the gross floor area as measured in accordance with the guidance issued from time to time by the Royal Institute of Chartered Surveyors or by a body replacing that institution. (m²).',
      'number-heated-rooms':
        'The number of heated rooms in the property if more than half of the habitable rooms are not heated.',
      tenure:
        'Describes the tenure type of the property. One of: Owner-occupied; Rented (social); Rented (private).',
    },
  };

  // Scroll to the relevant definition when the hash changes
  useEffect(() => {
    if (hash && glossaryRefs.current[hash]) {
      glossaryRefs.current[hash].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [hash]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Glossary of Terms</h2>
      {Object.entries(glossary).map(([section, terms]) => (
        <div key={section} style={{ marginBottom: '40px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{section}</h3>
          {Object.entries(terms).map(([key, value]) => (
            <div
              key={key}
              ref={(el) => (glossaryRefs.current[key] = el)} // Store the element reference
              id={key} // Add an ID for direct navigation
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: key === hash ? '2px solid blue' : '1px solid #ccc', // Highlight if it matches the hash
                borderRadius: '5px',
                backgroundColor: key === hash ? '#f0f8ff' : 'white', // Add a light background color if highlighted
                textAlign: 'left', // Align text to the left
              }}
            >
              <h4>{key.replace('-', ' ').toUpperCase()}</h4>
              <p>{value}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GlossaryPage;
