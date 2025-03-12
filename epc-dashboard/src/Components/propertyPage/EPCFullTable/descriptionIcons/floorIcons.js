const floorEfficiency = (description) => {

    if (!description || description.toUpperCase() === 'NODATA!' || description === 'N/A')
        return t.headers.notAvailable;
  
      const windowIcons = {
        "singleGlazed": "\u{1F5A1}",
        "doubleGlazed": "\u{1F5A1}\u{1F5A1}",
        "tripleGlzed": "\u{1F5A1}\u{1F5A1}",
        "secondaryGlazing": "\u{1F5A1}\u{1F5A1}\u{1F534}"
      }
}

export const floorDescription = {
        "no insulation": [
            "Suspended, no insulation (assumed)",
            "Solid, no insulation (assumed)",
            "To unheated space, no insulation (assumed)",
            "To unheated space, uninsulated (assumed)",
            "To external air, no insulation (assumed)",
            "To external air, uninsulated (assumed)"
        ],

        "limited insulation": [
            "Solid, limited insulation (assumed)",
            "Suspended, limited isolation (assumed)",
            "To unheated space, limited insulation (assumed)",
            "To external air, limited insultation (assumed)"
        ],

        "insulated": [
            "Suspended, insulted",
            "Suspended, insulated (assumed)",
            "Solid, insulated",
            "Solid, insulated (assumed)",
            "To unheated space, insulated",
            "To unheated space, insulated (assumed)",
            "To external air, insulated", 
            "To external air, insulated (assumed)",
            "(Same dwelling below) insulated (assumed)"
        ],

        "other": [
            "(other premises below)",
            "(another dwelling below)",
            "(Same dwelling below) insulated (assumed)",
            "Conservatory"
        ]
    
    }

export function getFloorIcon(description) {
    for(const [group, value] of Object.entries(floorDescription)) {
        if(value.includes(description)) {
            return windowEfficiency[group] || "\u2753";
        }
    }

    return "\u2753";

}
