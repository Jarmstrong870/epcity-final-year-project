export const roofAverageThermal = {
    "Very Good": { min: 0, max: 0.2, color: "#66cc00"},
    "Good": { min: 0.21, max: 0.5, color: "#ffcc00" },
    "Moderate": { min: 0.51, max: 1.0, color: "#ff6600" },
    "Poor": { min: 1.01, max: 2.0, color: "#ff0000" },
    "Very Poor": { min: 2.0, color: "#920000"},
    };

export const roofInsulationThickness = {
    "Unspecified Value": {efficiencyCategories: ["no insulation", "limited insulation", "Unknown loft insulation", "uninsulated"],  color: "#920000"},
    "Limited Insulation (<100mm)": {efficiencyCategories: ["0mm", "1 mm", "12 mm", "25 mm", "50 mm", "75 mm"], color: "#ff0000"},
    "Partial Insulation (100-199mm)": {efficiencyCategories: ["100 mm", "100mm", "150 mm", "150mm"], color: "#ff6600"}, 
    "Moderate Insulation (200-299mm)": {efficiencyCategories: ["200 mm", "200mm", "250 mm", "250mm", "270 mm"], color:  "#ffcc00"},
    "Well Insulated (300-399mm)": {efficiencyCategories: ["300 mm", "300+ mm", "350 mm", ">=300 mm"], color: "#66cc00"},
    "Very Well Insulated (400mm+)": {efficiencyCategories: ["400mm", "400+ mm", "400+mm"], color: "#7d7c7c"}
};

export function classifyRoof(description){
        const match = description.match(/(\d+\.\d+)/);
        
        if (match) {
            const efficiencyValue = parseFloat(match[0]);

            const efficiencyGroup = Object.keys(roofAverageThermal).find(group => {
                const {min, max} = roofAverageThermal[group];
                return efficiencyValue >= min && (max === undefined || efficiencyValue <= max);
                }) || "Unknown";

            const color = roofAverageThermal[efficiencyGroup]?.color || "#ccc";

            console.log("results:", {efficiencyGroup, efficiencyValue, color});

        return {efficiencyGroup, efficiencyValue, color, transmittanceValue: true};
    }

        const measurementValue = description.match(/(\d+)\s*(\+|>|>=)?\s*mm/i);
        if(measurementValue) {
            const value = parseInt(measurementValue[1]);
            const specialValue = !!measurementValue[2];

            const newFormat = specialValue ? `${value}mm` : `${value}mm`;

        const efficiencyStatus = Object.entries(roofInsulationThickness).find(([_, {efficiencyCategories}]) =>
            efficiencyCategories.includes(newFormat) || efficiencyCategories.includes(`${value} mm`));

            //return valueRange.some(efficiencyNumber => efficiencyNumber === value || (value > efficiencyNumber && number.includes("+")));
                //}) || "Unspecified";

        if(efficiencyStatus) {
            const [efficiencyGroup, {color}] = efficiencyStatus;
            return {efficiencyGroup, 
                    efficiencyValue: `"${newFormat}mm`, 
                    color: roofInsulationThickness[efficiencyGroup].color, 
                    transmittanceValue: false};
        }
    }

        return {efficiencyGroup: "Unspecified", 
                efficiencyValue: null, 
                color: "7d7c7c", 
                transmittanceValue: false};
    }


   