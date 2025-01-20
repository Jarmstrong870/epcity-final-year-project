import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './GlossaryPage.css';

const GlossaryPage = ({ language }) => {
  const location = useLocation(); // Get the current URL with the hash
  const hash = location.hash.slice(1); // Remove the '#' from the hash

  const glossaryRefs = useRef({});

  // Glossary translations with translated labels
  const glossaryTranslations = {
    en: {
      'Basic Information': {
        address: { label: 'ADDRESS', description: 'Location of the property' },
        postcode: { label: 'POSTCODE', description: 'The postcode of the property' },
        'property-type': { label: 'PROPERTY TYPE', description: 'Describes the type of property such as House, Flat, Maisonette etc.' },
      },
      'Energy Performance': {
        'current-energy-rating': { label: 'CURRENT ENERGY RATING', description: 'Energy rating on a scale of A to G.' },
        'current-energy-efficiency': { label: 'CURRENT ENERGY EFFICIENCY', description: 'Energy efficiency based on cost of energy.' },
        'potential-energy-efficiency': { label: 'POTENTIAL ENERGY EFFICIENCY', description: 'The potential energy efficiency rating of the property.' },
        'main-heat-energy-efficiency': { label: 'MAIN HEAT ENERGY EFFICIENCY', description: 'Energy efficiency rating: very good to very poor.' },
      },
      'Cost Information': {
        'heating-cost': { label: 'HEATING COST', description: 'GBP. Current estimated annual energy costs for heating the property.' },
        'lighting-cost': { label: 'LIGHTING COST', description: 'GBP. Current estimated annual energy costs for lighting the property.' },
        'hot-water-cost': { label: 'HOT WATER COST', description: 'GBP. Current estimated annual energy costs for hot water.' },
      },
      'Property Details': {
        'construction-age-band': { label: 'CONSTRUCTION AGE BAND', description: 'Age band when building part constructed.' },
        'total-floor-area': { label: 'TOTAL FLOOR AREA', description: 'The total useful floor area of all enclosed spaces (m²).' },
        'number-heated-rooms': { label: 'NUMBER OF HEATED ROOMS', description: 'Number of heated rooms if more than half of habitable rooms are not heated.' },
        tenure: { label: 'TENURE', description: 'Describes the tenure type: Owner-occupied; Rented (social); Rented (private).' },
      },
    },
    fr: {
      'Informations de base': {
        address: { label: 'ADRESSE', description: 'Emplacement de la propriété' },
        postcode: { label: 'CODE POSTAL', description: 'Le code postal de la propriété' },
        'property-type': { label: 'TYPE DE PROPRIÉTÉ', description: 'Décrit le type de propriété tel que maison, appartement, maisonette, etc.' },
      },
      'Performance énergétique': {
        'current-energy-rating': { label: 'CLASSEMENT ÉNERGÉTIQUE ACTUEL', description: 'Classement énergétique potentiel sur une échelle de A à G.' },
        'current-energy-efficiency': { label: 'EFFICACITÉ ÉNERGÉTIQUE ACTUELLE', description: 'Basé sur le coût de l’énergie pour le chauffage, l’eau et l’éclairage.' },
        'potential-energy-efficiency': { label: 'EFFICACITÉ ÉNERGÉTIQUE POTENTIELLE', description: "L'efficacité énergétique potentielle de la propriété." },
        'main-heat-energy-efficiency': { label: 'EFFICACITÉ DE CHAUFFAGE PRINCIPAL', description: 'Classement : très bon à très médiocre.' },
      },
      'Informations sur les coûts': {
        'heating-cost': { label: 'COÛT DU CHAUFFAGE', description: 'GBP. Coût annuel estimé pour le chauffage.' },
        'lighting-cost': { label: 'COÛT DE L’ÉCLAIRAGE', description: 'GBP. Coût annuel estimé pour l’éclairage.' },
        'hot-water-cost': { label: "COÛT DE L'EAU CHAUDE", description: "GBP. Coût annuel estimé pour l'eau chaude." },
      },
      'Détails de la propriété': {
        'construction-age-band': { label: "PÉRIODE DE CONSTRUCTION", description: 'Période où la propriété a été construite.' },
        'total-floor-area': { label: 'SUPERFICIE TOTALE', description: 'Superficie totale utile de la propriété (m²).' },
        'number-heated-rooms': { label: 'NOMBRE DE PIÈCES CHAUFFÉES', description: 'Nombre de pièces chauffées dans la propriété.' },
        tenure: { label: 'TENURE', description: 'Type de tenure : Propriétaire; Loué (social); Loué (privé).' },
      },
    },
    es: {
      'Información básica': {
        address: { label: 'DIRECCIÓN', description: 'Ubicación de la propiedad' },
        postcode: { label: 'CÓDIGO POSTAL', description: 'El código postal de la propiedad' },
        'property-type': { label: 'TIPO DE PROPIEDAD', description: 'Describe el tipo de propiedad, como casa, apartamento, etc.' },
      },
      'Rendimiento energético': {
        'current-energy-rating': { label: 'CLASIFICACIÓN ENERGÉTICA ACTUAL', description: 'Clasificación energética estimada en una escala de A a G.' },
        'current-energy-efficiency': { label: 'EFICIENCIA ENERGÉTICA ACTUAL', description: 'Basado en el coste de la energía para calefacción, agua y luz.' },
        'potential-energy-efficiency': { label: 'EFICIENCIA ENERGÉTICA POTENCIAL', description: 'La eficiencia energética potencial de la propiedad.' },
        'main-heat-energy-efficiency': { label: 'EFICIENCIA DE CALEFACCIÓN PRINCIPAL', description: 'Clasificación: muy buena a muy pobre.' },
      },
      'Información de costos': {
        'heating-cost': { label: 'COSTO DE CALEFACCIÓN', description: 'GBP. Costo anual estimado para calefacción.' },
        'lighting-cost': { label: 'COSTO DE ILUMINACIÓN', description: 'GBP. Costo anual estimado para iluminación.' },
        'hot-water-cost': { label: 'COSTO DE AGUA CALIENTE', description: 'GBP. Costo anual estimado para agua caliente.' },
      },
      'Detalles de la propiedad': {
        'construction-age-band': { label: 'PERÍODO DE CONSTRUCCIÓN', description: 'Período en que se construyó la propiedad.' },
        'total-floor-area': { label: 'SUPERFICIE TOTAL', description: 'Superficie total útil de la propiedad (m²).' },
        'number-heated-rooms': { label: 'NÚMERO DE HABITACIONES CALEFACCIONADAS', description: 'Número de habitaciones calefaccionadas en la propiedad.' },
        tenure: { label: 'TENENCIA', description: 'Tipo de tenencia: Propietario; Alquilado (social); Alquilado (privado).' },
      },
    },
  };

  const glossary = glossaryTranslations[language] || glossaryTranslations.en; // Default to English

  // Scroll to the relevant definition when the hash changes
  useEffect(() => {
    if (hash && glossaryRefs.current[hash]) {
      glossaryRefs.current[hash].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [hash]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>
        {language === 'fr'
          ? 'Glossaire des Termes'
          : language === 'es'
          ? 'Glosario de Términos'
          : 'Glossary of Terms'}
      </h2>
      {Object.entries(glossary).map(([section, terms]) => (
        <div key={section} style={{ marginBottom: '40px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{section}</h3>
          {Object.entries(terms).map(([key, { label, description }]) => (
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
