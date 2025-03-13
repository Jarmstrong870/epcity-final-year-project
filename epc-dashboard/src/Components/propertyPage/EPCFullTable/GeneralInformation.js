import React from 'react';
import styles from './GeneralInformation.module.css';
import translations from './locales/translations_generalinformation';

const GeneralInformation = ({ properties, language }) => {
    const t = translations[language] || translations.en;

    return (
        <div className={styles.epcContainer}>
            <div className={styles.mainAddressBox}>
                <p className={styles.addressTitle}>{t.address}: {properties.address}</p>
                <p className={styles.postcodeSubtitle}>{t.postcode}: {properties.postcode}</p>
            

            <div className={styles.propertyDetailsTable}>
                <div className={styles.propertyDetails}>
                    <span className={styles.summaryTitle}>{"🏠"} {t.propertyType}</span> 
                    <span className={styles.summaryValue}>{properties.property_type}</span>
                </div>

                <div className={styles.propertyDetails}>               
                    <span className={styles.summaryTitle}>{"🛏️"} {t.numberOfBedrooms}</span> 
                    <span className={styles.summaryValue}>{properties.number_bedrooms}</span>
                </div>

                <div className={styles.propertyDetails}>               
                    <span className={styles.summaryTitle}>{"📊"} {t.numberOfBedrooms}</span> 
                    <span className={styles.summaryValue}>{properties.number_bedrooms}</span>
                </div>
            
        </div>
    </div>
</div>

    );
};

export default GeneralInformation;
