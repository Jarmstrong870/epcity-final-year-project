import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './GlossaryPage.css';
import translations from '../locales/translations_glossarypage';
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png';

const GlossaryPage = ({ language }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);  // Parse the query parameters
  const searchTermFromUrl = searchParams.get("searchTerm") || "";  // Default to empty if not found
  const glossaryRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState(searchTermFromUrl);  // Set initial search term from URL
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedSections, setSelectedSections] = useState({});
  const [fileFormat, setFileFormat] = useState('pdf');
  const [step, setStep] = useState(1);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Added saving state
  const [showBackToTop, setShowBackToTop] = useState(false); // State for Back to Top button visibility

  const { title, glossary } = translations[language] || translations.en;
  const uiText = translations[language] || translations.en; // Dynamic UI text

  // Automatically focus the search bar when the page loads
  useEffect(() => {
    const searchInput = document.querySelector('.search-bar');
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  // Handle scrolling to the specific glossary section based on the URL hash
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash && glossaryRefs.current[hash]) {
      glossaryRefs.current[hash].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [location.hash]);

  // Filter glossary terms based on the search term
  useEffect(() => {
    if (searchTerm) {
      const foundTerm = Object.entries(glossary).find(([section, terms]) =>
        Object.values(terms).some(({ label }) =>
          label.toLowerCase().includes(searchTerm)
        )
      );

      if (foundTerm) {
        const [section] = foundTerm;
        setExpandedSections((prev) => ({
          ...prev,
          [section]: true,
        }));
      }
    } else {
      setShowDropdown(false);
      setExpandedSections({});
    }
  }, [searchTerm, glossary]);

  // Handle scroll event for showing the "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footerHeight = document.querySelector('footer') ? document.querySelector('footer').offsetHeight : 0;

      if (scrollPosition >= documentHeight - footerHeight - 100) { // Show when near the bottom, but before footer
        setShowBackToTop(true); 
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => {
      const newShowDropdown = !prev;
      if (!newShowDropdown) {
        setStep(1); 
      }
      return newShowDropdown;
    });
  };

  const filteredGlossary = useMemo(() => {
    return Object.fromEntries(
      Object.entries(glossary).map(([section, terms]) => [
        section,
        Object.entries(terms).filter(([_, { label }]) =>
          label.toLowerCase().includes(searchTerm)
        ),
      ])
    );
  }, [glossary, searchTerm]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    // Scroll to the section after it expands
    setTimeout(() => {
      if (glossaryRefs.current[section]) {
        glossaryRefs.current[section].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 200);  // Small delay to ensure content has expanded
  };

  const toggleSectionSelection = (section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const highlightSearchTerm = (text) => {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const saveGlossary = () => {
    setIsSaving(true); // Show saving state
    const selectedContent = Object.entries(selectedSections)
      .filter(([_, isSelected]) => isSelected)
      .map(([section]) => ({
        section,
        terms: Object.entries(glossary[section] || {}),
      }));

    if (selectedContent.length === 0) {
      setAlertMessage('Please select at least one section to save.');
      setTimeout(() => {
        setAlertMessage(null);
      }, 4000);
      setIsSaving(false); // Hide saving state
      return;
    }

    if (fileFormat === 'pdf') {
      const doc = new jsPDF();
      
      // Add Green Bar at the top
      doc.setFillColor(31, 62, 30); 
      doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
      
      const logo = new Image();
      logo.src = epcLogo; 
      logo.onload = () => {
        doc.addImage(logo, 'PNG', 10, 5, 40, 10); 
        let y = 35;
        
        doc.setFontSize(16);
        // Replace 'EPC Glossary' with the translated title
        doc.text(uiText.title || 'EPC Glossary', 10, y); // Dynamically using the translated title
        y += 10;

        selectedContent.forEach(({ section, terms }) => {
          doc.setFontSize(14);
          doc.text(section, 10, y);
          y += 10;

          terms.forEach(([key, { label, description }]) => {
            doc.setFontSize(12);
            doc.text(`${label}: ${description}`, 10, y, { maxWidth: 180 }); 
            y += 10;

            if (y >= 270) {
              doc.addPage();
              y = 20; 
            }
          });

          y += 5; 
        });

        doc.save(`${uiText.title || 'EPC Glossary'}.pdf`); // Saving with translated title
        setIsSaving(false); // Hide saving state
      };
    } else if (fileFormat === 'txt') {
      const content = selectedContent
        .map(({ section, terms }) =>
          `${section}\n` + terms.map(([_, { label, description }]) => `${label}: ${description}`).join('\n')
        )
        .join('\n\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'EPC_Glossary.txt';
      link.click();
      setIsSaving(false); // Hide saving state
    }

    setShowDropdown(false);
    setStep(1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px' }}>
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder={uiText.searchPlaceholder || "Search glossary..."} // Translated placeholder
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="search-bar"
        />

        {/* Save Options Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={toggleDropdown}>
            {uiText.saveOptionsLabel || 'Save Options'} {showDropdown ? '▲' : '▼'} {/* Translated button text */}
          </button>
          {showDropdown && (
            <div className="dropdown-content show">
              {step === 1 && (
                <>
                  <p>{uiText.selectFileFormatLabel || 'Select File Format:'}</p> {/* Translated label */}
                  <select
                    className="file-format-dropdown"
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                  >
                    <option value="pdf">📄 {uiText.pdfOption || 'PDF'}</option>
                    <option value="txt">📄 {uiText.txtOption || 'TXT'}</option>
                  </select>
                  <button className="next-btn" onClick={() => setStep(2)}>{uiText.nextBtnLabel || 'Next'}</button> {/* Translated next button */}
                </>
              )}
              {step === 2 && (
                <>
                  <p>{uiText.selectSectionsLabel || 'Select Sections:'}</p> {/* Translated label */}
                  <button className="dropdown-btn" onClick={() => setShowSectionDropdown(!showSectionDropdown)}>
                    {showSectionDropdown ? uiText.hideSectionsBtn || 'Hide Sections ▲' : uiText.selectSectionsBtn || 'Select Sections ▼'}
                  </button>
                  {showSectionDropdown && (
                    <div className="checkbox-dropdown">
                      {Object.keys(glossary).map((section) => (
                        <label key={section} className={`section-checkbox ${selectedSections[section] ? 'selected' : ''}`}>
                          <input
                            type="checkbox"
                            checked={selectedSections[section] || false}
                            onChange={() => toggleSectionSelection(section)}
                          />
                          {section}
                        </label>
                      ))}
                    </div>
                  )}
                  <button className="next-btn" onClick={() => setStep(3)}>{uiText.nextBtnLabel || 'Next'}</button>
                </>
              )}
              {step === 3 && (
                <>
                  <button className="save-btn" onClick={saveGlossary} disabled={isSaving}>
                    {isSaving ? uiText.savingLabel || 'Saving...' : uiText.saveBtnLabel || '💾 Save EPC Glossary'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert Box */}
      {alertMessage && <div className="alert-box">{alertMessage}</div>}

      <h2 style={{ textAlign: 'center' }}>{uiText.title || 'EPC Glossary'}</h2> {/* Translated title */}

      {/* Glossary Sections */}
      {Object.entries(filteredGlossary).map(([section, terms]) => (
        <div key={section} className="glossary-section" ref={(el) => (glossaryRefs.current[section] = el)}>
          <h3
            onClick={() => toggleSection(section)}
            onKeyPress={(e) => e.key === 'Enter' && toggleSection(section)}
            className="glossary-section-title"
            tabIndex="0"
          >
            {section} {expandedSections[section] ? '▼' : '▶'}
          </h3>
          {expandedSections[section] && (
            <div className="glossary-content expanded">
              {terms.map(([key, { label, description }]) => (
                <div key={key} className="glossary-item">
                  <h4 dangerouslySetInnerHTML={{ __html: highlightSearchTerm(label) }} />
                  <p dangerouslySetInnerHTML={{ __html: highlightSearchTerm(description) }} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button onClick={scrollToTop} className="back-to-top-btn">
          {uiText.backToTop ? uiText.backToTop : 'Back to Top'} {/* Corrected comment */}
        </button>
      )}

    </div>
  );
};

export default GlossaryPage;
