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
    const pageMargin = 20;
    let currentY = 30;

    // Title
    checklistDocument.setFont("helvetica", "bold");
    checklistDocument.setFontSize(20);
    checklistDocument.setTextColor(26, 46, 45); // #1a2e2d
    checklistDocument.text(t.pdfTitle, 105, currentY, { align: "center" });

    // Subtitle line
    checklistDocument.setDrawColor(26, 46, 45);
    checklistDocument.setLineWidth(0.8);
    checklistDocument.line(pageMargin, currentY + 5, 190, currentY + 5);
    currentY += 15;

    checklistDocument.setFontSize(12);
    checklistDocument.setFont("helvetica", "normal");

    const categories = [
      t.categories.propertyConditions,
      t.categories.tenancyDocuments,
      t.categories.studentFinances
    ];

    categories.forEach((category) => {
      // Category Heading
      checklistDocument.setFont("helvetica", "bold");
      checklistDocument.setFontSize(14);
      checklistDocument.setTextColor(26, 46, 45); // header color
      checklistDocument.text(category, pageMargin, currentY);
      currentY += 10;

      // Checklist Items
      checklist
        .filter(item => item.categories === category)
        .forEach(item => {
          const checkbox = item.checkBox ? "[X]" : "[ ]";
          const color = item.checkBox ? [34, 139, 34] : [50, 50, 50]; // green or black

          checklistDocument.setFont("helvetica", "normal");
          checklistDocument.setFontSize(12);
          checklistDocument.setTextColor(...color);

          const line = `${checkbox} ${item.description}`;
          const wrappedLines = checklistDocument.splitTextToSize(line, 170);

          wrappedLines.forEach(line => {
            checklistDocument.text(line, pageMargin + 5, currentY);
            currentY += 8;

            // New page if overflow
            if (currentY > 270) {
              checklistDocument.addPage();
              currentY = 30;
            }
          });

          currentY += 2; // spacing after item
        });

      currentY += 8; // spacing after section
    });

  // Footer
    checklistDocument.setFontSize(10);
    checklistDocument.setTextColor(150, 150, 150);
    checklistDocument.text("Generated via EPCity Checklist Tool", pageMargin, 290);
    checklistDocument.save('Student_Property_Checklist.pdf');
  };

  return (
    <div className="checklist-main">
      <h1 className="checklist-header">{t.title}</h1>
      <p className="checklist-p">{t.description}</p>

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
