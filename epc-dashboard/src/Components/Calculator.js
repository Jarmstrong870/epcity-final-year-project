import React, {useState, useEffect} from 'react';
import './Calculator.css';
import globePlaneIcon from '../assets/gandpicon.jpg';
import chargePhoneIcon from '../assets/chargephoneicon.jpg';

const Calculator = ({propertyAddress}) => {
    const [duration, setEnergyDuration] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [outputResults, setOutputResults] = useState('');
    const [energyCosts, setEnergyCosts] = useState({lighting_cost_current: null, heating_cost_current: null});

    const calculateEnergyCosts = async () => {

    try{
        const response = await fetch(`http://127.0.0.1:5000/api/property/getInfo?address=${propertyAddress}`);
       
        if (!response.ok){
            throw new Error('Failed to fetch property data');
        }

        const data = await response.json();
 
        setEnergyCosts({
            lighting_cost_current : data.lighting_cost_current,
            heating_cost_current : data.heating_cost_current,
        });
    } catch {
        setErrorMessage("Unable to fetch data");
        }
    };

    useEffect(() => {
    if (propertyAddress){
        calculateEnergyCosts(); }
    }, [propertyAddress]);

    const energyCostsCalculation = () => {
        setErrorMessage('');
    

    if (!duration){
        setErrorMessage("Provide the relevant duration to calculate your properties impact!!");
        return;
    }

    if (!lighting_cost_current || !heating_cost_current) {
        setErrorMessage("No costs are available for this property");
        return;
    }

    const overallLightingCosts = energyCosts.lightingCosts * duration;
    const overallHeatingCosts = energyCosts.heatingCosts * duration;
    const totalEnergyCosts = overallLightingCosts + overallHeatingCosts;

    setOutputResults({
        lightingCosts : overallLightingCosts.toFixed(2),
        heatingCosts : overallHeatingCosts.toFixed(2),
        totalEnergyCosts : totalEnergyCosts.toFixed(2),
        imageLinks: [
            globePlaneIcon, chargePhoneIcon]
        });
    };

    return (
        <div className = "calculatorFrame">
            <h1>Property Environmental calculator</h1>
        
        <div className = "individualInputRow">
            <label> Property Duration: </label>
                <input
                    type = "number"
                    value = {duration}
                    onChange={(err) => setEnergyDuration(err.target.value)} 
                />
        </div>

        <div className = "individualInputRow">
            <p>Heating Costs per kWh: ${heating_cost_current || "N/A"}</p>
            <p>Lighting Costs per kWh: ${lighting_cost_current || "N/A"}</p>
        </div>

        <button onClick={energyCostsCalculation}>Calculate your total!!</button>

        {outputResults && (
            <div className = "answer">
                <h2> Your Results </h2>
                <p>Heating Costs: ${outputResults.heatingCosts}</p>
                <p>Lighting Costs: ${outputResults.lightingCosts}</p>
                <p>Total Energy Costs: ${outputResults.totalEnergyCosts}</p>


            <div className = "comparisonImages">
                {outputResults.imageLinks.map((imageLink, index) => (
                    <img key = {index} src={imageLink} />
                ))}
            </div>
            </div>
            )}
        </div>
    );
};

export default Calculator;