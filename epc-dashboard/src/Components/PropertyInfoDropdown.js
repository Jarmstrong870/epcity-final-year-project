import React, { useState, useEffect } from "react";
import EPCInfoDropdown from "./subDropdowns/EPCInfoDropdown";
import EnergyInfoDropdown from "./subDropdowns/EnergyInfoDropdown";
import StructureInfoDropdown from "./subDropdowns/StructureInfoDropdown";
import { findMaxValues, energyRatingToNumber, parseNumericValue, efficiencyRatingToNumber } from "./Compare_utils/Compare_utils";
import "./PropertyInfoDropdown.css";

const renderStarRating = (efficiency) => {
    if (!efficiency) return "N/A";
    const rating = efficiency.toLowerCase();
    switch (rating) {
        case "very good": return "⭐⭐⭐⭐⭐";
        case "good": return "⭐⭐⭐⭐";
        case "average": return "⭐⭐⭐";
        case "poor": return "⭐⭐";
        case "very poor": return "⭐";
        default: return "N/A";
    }
};

const PropertyInfoDropdown = ({ property, allProperties, language }) => {  // Pass language as prop
    const [openDropdowns, setOpenDropdowns] = useState({
        epc: false,
        energy: false,
        costGraph: false,
        structure: false
    });

    const [activeTabs, setActiveTabs] = useState({
        epc: "rating",
        energy: "heating",
        structure: "windows"
    });

    const [maxValues, setMaxValues] = useState({});

    useEffect(() => {
        if (allProperties?.length) {
            const calculatedMaxValues = findMaxValues(allProperties);
            setMaxValues(calculatedMaxValues);
        }
    }, [allProperties]);

    const toggleDropdown = (dropdown) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    const setActiveTab = (section, tab) => {
        setActiveTabs((prev) => ({
            ...prev,
            [section]: tab
        }));
    };

    const highlightIfBest = (value, maxValue) => {
        if (!value || maxValue === undefined) return "";
        return parseNumericValue(value) === maxValue ? "highlight-green" : "";
    };

    return (
        <div>
            <EPCInfoDropdown
                property={property}
                maxValues={maxValues}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                activeTabs={activeTabs}
                setActiveTab={setActiveTab}
                highlightIfBest={highlightIfBest}
                renderStarRating={renderStarRating}
                language={language}  // Passing language as prop to EPC
            />
            
            <EnergyInfoDropdown
                property={property}
                maxValues={maxValues}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                activeTabs={activeTabs}
                setActiveTab={setActiveTab}
                highlightIfBest={highlightIfBest}
                renderStarRating={renderStarRating}
                language={language}  // Passing language as prop to Energy
            />
            
            <StructureInfoDropdown
                property={property}
                maxValues={maxValues}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                activeTabs={activeTabs}
                setActiveTab={setActiveTab}
                highlightIfBest={highlightIfBest}
                renderStarRating={renderStarRating}
                language={language}  // Passing language as prop to Structure
            />
        </div>
    );
};

export default PropertyInfoDropdown;
