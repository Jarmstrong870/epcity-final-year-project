import styles from "./EpcSpecificInfo.module.css";

const EPCSpecificInformation = ({ properties }) => {

    return(
        <div className= {styles.energyInfoContainer}>
            <div className={styles.energyHeader}>EPC Information</div>
                <div className = {styles.energyBox}>
                    <h2>EPC Rating</h2>
                    <p>Current EPC Grade: {properties.current_energy_rating}</p>
                    <p>Current EPC Rating: {properties.current_energy_efficiency}</p>
                    <p>Potential EPC Grade: {properties.potential_energy_rating}</p>
                    <p>Potential EPC Rating: {properties.potential_energy_efficiency}</p>
                    <p>Current Energy Consumption: {properties.energy_consumption_current} KwH/m^2</p>
                    <p>Total Energy Usage: {properties.energy_consumption_current* properties.total_floor_area} KwH</p>
                    
                </div>
                <div className = {styles.energyBox}>
                <h2>In This Property...</h2>
                <p>If you left the heating on accidentally over the weekend it would roughly cost: {properties.heating_example_formatted}</p>
                <p>Taking a half hour long hot shower would roughly cost: {properties.hot_water_example_formatted}</p>
                <p>Leaving the lighting on overnight would roughly cost: {properties.lighting_example_formatted}</p>

                </div>
                <div className = {styles.energyBox}>
                <h2>Property Information</h2>
                <p>Built From: {properties.built_form}</p>
                <p>Extension Count: {properties.extension_count}</p>
                <p>Lodgement Date: {properties.lodgement_date}</p>
                <p>Tenure: {properties.tenure}</p>
                <p>Gas Flag: {properties.mains_gas_flag}</p>
                <p>Energy Tariff: {properties.energy_tariff}</p>
                </div>
        
        </div>
    )

}

export default EPCSpecificInformation;
