import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRatedPropertyCard from './TopRatedPropertyCard';
import './HomePage.css';
import './PropertyCard.css';
import PropertyFilter from './FilterComponent';

const HomePage = ({ fetchProperties, language }) => {
  const [topRatedProperties, setTopRatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Translations
  const translations = {
    en: {
      searchPlaceholder: 'Search by property address or postcode...',
      searchButton: 'Search',
      topRatedProperties: 'Top Rated Properties',
      loading: 'Loading...',
      noProperties: 'No top-rated properties found.',
    },
    fr: {
      searchPlaceholder: 'Rechercher par adresse ou code postal...',
      searchButton: 'Rechercher',
      topRatedProperties: 'Propriétés les Mieux Notées',
      loading: 'Chargement...',
      noProperties: 'Aucune propriété parmi les mieux notées trouvée.',
    },
    es: {
      searchPlaceholder: 'Buscar por dirección o código postal...',
      searchButton: 'Buscar',
      topRatedProperties: 'Propiedades Mejor Valoradas',
      loading: 'Cargando...',
      noProperties: 'No se encontraron propiedades mejor valoradas.',
    },
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchTopRatedProperties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/property/loadTopRated');
        const data = await response.json();
        setTopRatedProperties(data.slice(0, 3)); // Limit to top 3 properties
        console.log('Top Rated Properties:', data); // Debugging output
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedProperties();
  }, []);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchProperties(searchTerm);
      navigate(`/propertylist?search=${searchTerm}`);
    }
  };

  if (loading) {
    return <p>{t.loading}</p>;
  }

  if (topRatedProperties.length === 0) {
    return <p>{t.noProperties}</p>;
  }

  return (
    <>
      {/* Search Bar Section */}
      <div className="backgroundImageStyling">
        <div className="stylingSearchBar">
          <input
            className="stylingSearchInput"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={t.searchPlaceholder}
          />
          <button className="stylingSearchButton" onClick={handleSearch}>
            {t.searchButton}
          </button>
        </div>
      </div>

      {/* Top Rated Properties Section */}
      <div className="top-rated-properties-section">
        <div className="title-card">
          <h2 className="title-text">{t.topRatedProperties}</h2>
          <p className="subtitle-text">Discover the best-rated properties, based on their EPC rating!</p>
        </div>
        <div className="property-grid">
          {topRatedProperties.map((property, index) => (
            <TopRatedPropertyCard key={index} property={property} language={language} />
          ))}
        </div>
      </div>
          <div className="additional-sections-container">
      {/* FAQ Section */}
      <div className="section faq-section" onClick={() => alert('Redirecting to FAQs')}>
        <div className="section-content">
          <h2>FAQs</h2>
          <p>Find answers to the most common questions.</p>
        </div>
      </div>

      {/* View All Properties Section */}
      <div className="section properties-section" onClick={() => alert('Redirecting to Properties')}>
        <div className="section-content">
          <h2>View All Properties</h2>
          <p>Explore all available properties in your area.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
