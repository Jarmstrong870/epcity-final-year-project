import React from 'react';
import styles from './EpcContainer.module.css';
import translations from './locales/translations_generalinformation';

const GeneralInformation = ({ properties, language }) => {
    const t = translations[language] || translations.en;

    return (
        <div className={styles.epcContainer}>
            <div className={styles.box}>
                <p><span className={styles.boldText}>{t.address}:</span> {properties.address}</p>
                <p><span className={styles.boldText}>{t.postcode}:</span> {properties.postcode}</p>
            </div>
            <div className={styles.box}>
                <p><span className={styles.boldText}>{t.propertyType}:</span> {properties.property_type}</p>
                <p><span className={styles.boldText}>{t.numberOfBedrooms}:</span> {properties.number_bedrooms}</p>
            </div>
        </div>
    );
};

export default GeneralInformation;
