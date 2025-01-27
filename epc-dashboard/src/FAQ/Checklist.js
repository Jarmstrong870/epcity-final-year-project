import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './Checklist.css';
import translationsChecklist from '../locales/translations_checklist'; 
import PropertyIcon from '../assets/property icon.jpg';
import DocumentIcon from '../assets/documents file icon.jpg';
import MoneyIcon from '../assets/money icon.jpg';

const Checklist = ({ language }) => {
  const t = translationsChecklist[language] || translationsChecklist.en; // Get translations for the current language

  const [checklist, setChecklist] = useState([]);

  // Update checklist dynamically when language changes
  useEffect(() => {
    setChecklist(
      t.checklistItems.map((description, index) => ({
        checklistID: index + 1,
        description,
        checkBox: false,
        categories:
          index < 2
            ? t.categories.propertyConditions
            : index < 4
            ? t.categories.tenancyDocuments
            : t.categories.studentFinances,
      }))
    );
  }, [language, t]);

  const tickBox = (boxID) => {
    setChecklist((propertyChecklist) =>
      propertyChecklist.map((chosenItem) =>
        chosenItem.checklistID === boxID
          ? { ...chosenItem, checkBox: !chosenItem.checkBox }
          : chosenItem
      )
    );
  };

  const downloadingChecklist = () => {
    const checklistDocument = new jsPDF();
    checklistDocument.setFontSize(14);
    checklistDocument.text(t.pdfTitle, 12, 12);
    checklistDocument.setFontSize(12);
    checklist.forEach((listItem, index) => {
      checklistDocument.text(
        `[${listItem.checkBox ? 'X' : ' '}] ${listItem.description}`,
        10,
        20 + index * 10
      );
    });
    checklistDocument.save('Student_Property_Checklist.pdf');
  };

  return (
    <div className="checklist-main">
      <h1>{t.title}</h1>
      <p>{t.description}</p>

      <div className="checklist-groupings">
        {[
          t.categories.propertyConditions,
          t.categories.tenancyDocuments,
          t.categories.studentFinances,
        ].map((category) => (
          <div key={category} className="checklist-groups">
            <h2>
              <img
                src={
                  category === t.categories.propertyConditions
                    ? PropertyIcon
                    : category === t.categories.tenancyDocuments
                    ? DocumentIcon
                    : MoneyIcon
                }
                alt={`${category} icon`}
                className="categories-icon"
              />
              {category}
            </h2>
            <ul>
              {checklist
                .filter((item) => item.categories === category)
                .map((item) => (
                  <li
                    key={item.checklistID}
                    className={`checklist-individualItem ${
                      item.checkBox ? 'checklist-selectedItem' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checkBox}
                      onChange={() => tickBox(item.checklistID)}
                    />
                    <label>{item.description}</label>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={downloadingChecklist} className="downloadButton">
        {t.downloadButton}
      </button>
    </div>
  );
};

export default Checklist;
