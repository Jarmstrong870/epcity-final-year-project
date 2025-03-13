import oilIcon from "../../../../assets/heating_icons/oil tank.png";
import electricIcon from "../../../../assets/heating_icons/electric.png";
import gasCylinderIcon from "../../../../assets/heating_icons/gas cylinder.png";
import fuelIcon from "../../../../assets/heating_icons/fuel.png";
import questionMarkIcon from "../../../../assets/heating_icons/unspecified.png";

export const mainFuelIcon = (description) => {
    if (!description || description.toUpperCase() === 'NODATA!' || description === 'N/A')
      return;

    const fuelTypeGroups = [
        {"fuelTypes": [
            "oil - this is for backwards compatibility only and should not be used",
            "oil (not community)",
            "oil (community)",
        ], icon: oilIcon},

        {"fuelTypes": [
            "electricity - this is for backwards compatibility only and should not be used",
            "Electricity: electricity, unspecified tariff",
            "electricity (community)",
            "electricity (not community)",

        ], icon: electricIcon},

        {"fuelTypes": [
            "mains gas - this is for backwards compatibility only and should not be used", 
            "mains gas (not community)",
            "Gas: mains gas",
            "mains gas (community)",
            "LPG - this is for backwards compatibility only and should not be used",
            "LPG (not community)",
            "bottled LPG",
            "LPG special condition",
            "LPG (community)"
        ], icon: gasCylinderIcon},

        {"fuelTypes": [
            "bulk wood pellets",
            "smokeless coal",
            "wood logs",
            "dual fuel - mineral + wood",
            "anthracite",
            "house coal (not community)",
            "wood chips",
            "biomass (community)",
            "house coal - this is for backwards compatibility only and should not be used",
            "from heat network data (community)"
        ], icon: fuelIcon},
            
        {"fuelTypes": [
            "NO DATA!", 
            "B30K (not community)",
            "INVALID!",
            "To be used only when there is no heating/hot-water system",
            "To be used only when there is no heating/hot-water system or data is from a community network",
            " "
        ], icon: questionMarkIcon}
    ];


    const mainFuelTypeDescription = description.toLowerCase();

    const match = fuelTypeGroups.find(fuelType =>
        fuelType.fuelTypes.some(type => mainFuelTypeDescription.includes(type))
    );

        return match ? [{description, icon: match.icon}] : [{description}];
    };