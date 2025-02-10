import styles from "./EpcSpecificInfo.module.css";

const EPCSpecificInformation = ({ properties }) => {
    

    return(
        <div className= {styles.energyInfoContainer}>
            <div className={styles.energyHeader}>EPC Information</div>
                <div className = {styles.energyBox}>
                    <h2>EPC Rating</h2>
                    <p>Current EPC Grade: {properties.current_energy_rating}</p>
                    <p>Current EPC Rating: {properties.current_energy_efficiency}</p>
                    <p>Current Energy Consumption: {properties.energy_consumption_current} KwH/m^2</p>
                    <p>Total Energy Usage: {properties.energy_consumption_current* properties.total_floor_area}</p>
                    <p> Total Energy Cost: £{(properties.energy_consumption_current* properties.total_floor_area * properties.cost_per_kwh)} </p>
                    
                </div>
                <div className = {styles.energyBox}>
                <h2>Yearly Costs</h2>
                <p>Yearly Cost: {properties.energy_consumption_cost_formatted}</p>
                </div>
                <div className = {styles.energyBox}>
                <h2>Property Information</h2>
                <p>Built From: {properties.built_form}</p>
                <p>Extension Count: {properties.extension_count}</p>
                <p>Lodgement Date: {properties.logdement_date}</p>
                <p>Tenure: {properties.tenure}</p>
                <p>Gas Flag: {properties.tenure}</p>
                <p>Energy Tariff: {properties.energy_tariff}</p>
                </div>
        
        </div>
    )

}

export default EPCSpecificInformation;
