import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
    const navigate = useNavigate();
    
    const faqList = [
        {
            title: 'Glossary of Terms',
            description: 'Click here to find a glossary of EPC terms!',
            path: '/faq/glossary-page'
        },
        {
            title: 'Step by Step Tutorials',
            description: 'Click here to find a step by step tutorials!',
            path: '/faq/tutorials'
        },
        {
            title: 'Environmental Calculator',
            description: 'Click here to find your enviornmental impact calculator!',
            path: '/faq/ecalculator'
        },
        {
            title: 'Property Rent Checklist',
            description: 'Click here to find a checklist to rent a property!',
            path: '/faq/checklist'
        },
    ];

    return (
        <div>
          <h2 className="stylingTitle">Frequently Asked Questions</h2>
          <div className="homePageGrid">
            {faqList.map((element, index) => (
              <div 
                key={index} 
                className="propertyCard"
                onClick={() => navigate(element.path)}
                style={{cursor: "pointer"}}>

                <h3>{element.title}</h3> 
                <p>{element.description}</p>
            {/*<button className="stylingSearchButton" 
            onClick={() => navigate(element.path)}>    Find out more   </button>*/}
          </div>
            ))}
            </div>
        </div>    
      );
    };
    
    export default FAQ;
