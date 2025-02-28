import React, { useState, useEffect } from "react";
import CostComparisonGraph from "./propertyPage/EPCFullTable/CostComparisonGraph";
import { findMaxValues, energyRatingToNumber, parseNumericValue, efficiencyRatingToNumber } from "./Compare_utils/Compare_utils";
import EPCInfoDropdown from "./subDropdowns/EPCInfoDropdown";
import EnergyInfoDropdown from "./subDropdowns/EnergyInfoDropdown";
import StructureInfoDropdown from "./subDropdowns/StructureInfoDropdown";
import "./PropertyInfoDropdown.css";

// Function to render star ratings based on efficiency
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

const PropertyInfoDropdown = ({ property, allProperties }) => {
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
                renderStarRating={renderStarRating}  // Passing function to EPC dropdown
            />
            
            <EnergyInfoDropdown
                property={property}
                maxValues={maxValues}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                activeTabs={activeTabs}
                setActiveTab={setActiveTab}
                highlightIfBest={highlightIfBest}
                renderStarRating={renderStarRating}  // Passing function to Energy dropdown
            />
            
            <StructureInfoDropdown
                property={property}
                maxValues={maxValues}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                activeTabs={activeTabs}
                setActiveTab={setActiveTab}
                highlightIfBest={highlightIfBest}
                renderStarRating={renderStarRating}  // Passing function to Structure dropdown
            />
        </div>
    );
};

export default PropertyInfoDropdown;
