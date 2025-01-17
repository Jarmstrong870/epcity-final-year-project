import React, {useState} from 'react';
import {jsPDF} from 'jspdf';
import './Checklist.css';
import PropertyIcon from '../assets/property icon.jpg';
import DocumentIcon from '../assets/documents file icon.jpg';
import MoneyIcon from '../assets/money icon.jpg';

const Checklist = () => {
    const[checklist, setChecklist] = useState([
        {checklistID: 1, description: 'Go through the property and inspect for mould, damp etc', checkBox: false, categories: 'Properties Conditions'},
        {checklistID: 2, description: 'Make sure to read and understand the tenancy agreement thoroughly', checkBox: false, categories: 'Tenancy Documents'},
        {checklistID: 3, description: 'Check billing and payment responsibilities between tenants', checkBox: false, categories: 'Student Finances'},
        {checklistID: 4, description: 'Make sure to check if there is a deposit to be paid and any requirements asscoiated', checkBox: false, categories: 'Tenancy Documents'},
        {checklistID: 5, description: 'Check with previous tenants what they thought about property', checkBox: false, categories: 'Properties Conditions'},
        {checklistID: 6, description: 'Using our Utility Cost Calculator to see the costs for your favourite property', checkBox: false, categories: 'Student Finances'}
    ]);

    const tickBox = (boxID) => {
        setChecklist((propertyChecklist) =>
            propertyChecklist.map((chosenItem) =>
                chosenItem.checklistID === boxID
                    ? {...chosenItem, checkBox: !chosenItem.checkBox}
                    : chosenItem
            )
        );
    };

    const downloadingChecklist = () => {
        const checklistDocument = new jsPDF();
        checklistDocument.setFontSize(14);
        checklistDocument.text('Student Rent Checklist', 12, 12);
        checklistDocument.setFontSize(12);
        checklist.forEach((listItem, index) => {
            checklistDocument.text(`[${listItem.checkBox ? 'X' : ' '}] ${listItem.description}`, 10, 20 + index * 10);
        });
        checklistDocument.save('Student_Property_Checklist.pdf');
    };

    return (
        <div className="checklist-main">
            <h1>Student Rental Checklist</h1>
            <p>Do you feel like you forget the questions to ask when viewing a property? <br />
               <br />
               Download and view our checklist below with the key points to consider 
               before signing onto a property!!</p>

        <div className="checklist-groupings">
            {['Properties Conditions', 'Tenancy Documents', 'Student Finances'].map((categories) => (
                <div key={categories} className="checklist-groups">
                <h2>
                    <img src = {
                        categories === 'Properties Conditions' ? PropertyIcon
                        : categories === 'Tenancy Documents' ? DocumentIcon
                        : MoneyIcon}
                    alt = {`${categories} icon`}
                    className="categories-icon" 
                    />
                    {categories}
                </h2>
                    <ul>
                        {checklist.filter((selectedItem) => selectedItem.categories === categories).map((selectedItem) => (
                            <li 
                                key={selectedItem.checklistID} 
                                className={`checklist-individualItem ${selectedItem.checkBox ? 'checklist-selectedItem' : ''
                                }`}>
                                <input
                                    type = "checkbox"
                                    checked = {selectedItem.checkBox}
                                    onChange={() => tickBox(selectedItem.checklistID)} 
                                />
                               
                                <label>{selectedItem.description}</label>
                            </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
                <button onClick= {downloadingChecklist} className="downloadButton">Download Checklist</button>
            </div>
        );
    };

export default Checklist;

