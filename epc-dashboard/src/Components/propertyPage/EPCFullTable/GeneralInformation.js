import styles from './EpcContainer.module.css';

const GeneralInformation = ({properties}) => {
    return (
        <div className={styles.epcContainer}>
            <div className={styles.box}>
                <p><span className={styles.boldText}>Address:</span> {properties.address}</p>
                <p><span className={styles.boldText}>Postcode:</span> {properties.postcode}</p>
            </div>
            <div className= {styles.box}>
                <p><span className={styles.boldText}>Property Type: </span>{properties.property_type}</p>
                <p><span className={styles.boldText}>Number of Bedrooms: </span>{properties.Number_of_bedrooms}</p>
            </div>
           
        </div>

    );
};

export default GeneralInformation;
