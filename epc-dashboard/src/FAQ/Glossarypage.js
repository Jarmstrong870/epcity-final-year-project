import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './GlossaryPage.css';
import translations from '../locales/translations_glossarypage';
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png'; 
import PizZip from 'pizzip';

const GlossaryPage = ({ language }) => {
  const location = useLocation();
  const hash = location.hash.slice(1);
  const glossaryRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedSections, setSelectedSections] = useState({});
  const [fileFormat, setFileFormat] = useState('pdf');
  const [step, setStep] = useState(1);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const { title, glossary } = translations[language] || translations.en;

  useEffect(() => {
    if (hash && glossaryRefs.current[hash]) {
      glossaryRefs.current[hash].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [hash]);

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
  };

  const toggleSectionSelection = (section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const saveGlossary = () => {
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
        doc.text('EPC Glossary', 10, y);
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
  
        doc.save('EPC_Glossary.pdf');
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
    }
  
    setShowDropdown(false);
    setStep(1);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px' }}>
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search glossary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="search-bar"
        />

        {/* Save Options Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={toggleDropdown}>
            Save Options {showDropdown ? '▲' : '▼'}
          </button>
          {showDropdown && (
            <div className="dropdown-content show">
              {step === 1 && (
                <>
                  <p>Select File Format:</p>
                  <select
                    className="file-format-dropdown"
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                  >
                    <option value="pdf">📄 PDF</option>
                    <option value="txt">📄 TXT</option>
                  </select>
                  <button className="next-btn" onClick={() => setStep(2)}>Next</button>
                </>
              )}
              {step === 2 && (
                <>
                  <p>Select Sections:</p>
                  <button className="dropdown-btn" onClick={() => setShowSectionDropdown(!showSectionDropdown)}>
                    {showSectionDropdown ? 'Hide Sections ▲' : 'Select Sections ▼'}
                  </button>
                  {showSectionDropdown && (
                    <div className="checkbox-dropdown">
                      {Object.keys(glossary).map((section) => (
                        <label key={section} className="section-checkbox">
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
                  <button className="next-btn" onClick={() => setStep(3)}>Next</button>
                </>
              )}
              {step === 3 && (
                <>
                  <button className="save-btn" onClick={saveGlossary}>💾 Save EPC Glossary</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert Box */}
      {alertMessage && <div className="alert-box">{alertMessage}</div>}

      <h2 style={{ textAlign: 'center' }}>EPC Glossary</h2>

      {/* Glossary Sections */}
      {Object.entries(filteredGlossary).map(([section, terms]) => (
        <div key={section} className="glossary-section" ref={(el) => (glossaryRefs.current[section] = el)}>
          <h3
            onClick={() => toggleSection(section)}
            className="glossary-section-title"
            tabIndex="0"
            onKeyPress={(e) => e.key === 'Enter' && toggleSection(section)}
          >
            {section} {expandedSections[section] ? '▼' : '▶'}
          </h3>
          {expandedSections[section] && (
            <div className="glossary-content expanded">
              {terms.map(([key, { label, description }]) => (
                <div key={key} className="glossary-item">
                  <h4>{label}</h4>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GlossaryPage;
