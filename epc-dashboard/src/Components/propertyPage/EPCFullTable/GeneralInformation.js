import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GeneralInformation.module.css';
import translations from './locales/translations_generalinformation';

const GeneralInformation = ({ properties, language }) => {
    const t = translations[language] || translations.en;

    return (
        <div className={styles.epcContainer}>
            <div className={styles.mainAddressBox}>
                <p className={styles.addressTitle}>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.address)}`} className={styles.greenQuestionMark}></Link>
                    <strong>{t.address}:</strong> {properties.address}
                </p>
                <p className={styles.postcodeSubtitle}>
                    <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.postcode)}`} className={styles.greenQuestionMark}></Link>
                    <strong>{t.postcode}:</strong> {properties.postcode}
                </p>

                <div className={styles.propertyDetailsTable}>
                    <div className={styles.propertyDetails}>
                        <span className={styles.summaryTitle}>
                            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.propertyType)}`} className={styles.greenQuestionMark}></Link>
                            🏠 {t.propertyType}
                        </span>
                        <span className={styles.summaryValue}>{properties.property_type}</span>
                    </div>

                    <div className={styles.propertyDetails}>
                        <span className={styles.summaryTitle}>
                            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.numberOfBedrooms)}`} className={styles.greenQuestionMark}></Link>
                            🛏️ {t.numberOfBedrooms}
                        </span>
                        <span className={styles.summaryValue}>{properties.number_bedrooms}</span>
                    </div>

                    <div className={styles.propertyDetails}>
                        <span className={styles.summaryTitle}>
                            <Link to={`/faq/glossary-page?searchTerm=${encodeURIComponent(t.numberOfBedrooms)}`} className={styles.greenQuestionMark}></Link>
                            📊 {t.numberOfBedrooms}
                        </span>
                        <span className={styles.summaryValue}>{properties.number_bedrooms}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralInformation;
