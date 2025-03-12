import oilIcon from "../../../../assets/heating_icons/oil tank.png";
import electricIcon from "../../../../assets/heating_icons/electric.png";
import gasCylinderIcon from "../../../../assets/heating_icons/gas cylinder.png";
import pipeIcon from "../../../../assets/heating_icons/pipe.png";
import boilerBuilding from "../../../../assets/heating_icons/boiler building.png";
import waterBoiler from "../../../../assets/heating_icons/water boiler.png";
import solarPanel from "../../../../assets/heating_icons/solar panel.png";
import electricityIcon from "../../../../assets/heating_icons/electricity.png";
import questionMarkIcon from "../../../../assets/heating_icons/unspecified.png";
import heatPumpIcon from "../../../../assets/heating_icons/heat pump.png";

export const waterDescriptionIcon = (description) => {
    if (!description || description.toUpperCase() === 'NODATA!' || description === 'N/A')
      return;

    const waterSupplyGroups = [
        {"waterSupply": [
            "From main system",
            "From main system, no cylinder thermostat",
            "From main system, no cylinderstat",
            "From main system, plus solar",
            "From main system, no cylinder thermostat, plus solar",
            "From main system, plus solar, no cylinder thermostat",
            "From main system, no cylinderstat, no cylinderstat",
            "From main system, waste water heat recovery",
            "From main system, standard tariff",
            "From main system, plus solar, flue gas heat recovery",
            "From main system, plus solar, no cylinder thermostat, flue gas heat recovery",
            "Solid fuel boiler/circulator",
            "OGÃ‡Ã–r brif system, dim thermostat ar y silindr",
            "OGÃ‡Ã–r brif system"
        ], icon: {pipeIcon, waterBoiler, solarPanel}
    },

        {"waterSupply": [
            "Electric immersion, off-peak, no cylinder thermostat",
            "Electric heat pump for water heating only",
            "Electric immersion, standard tariff, plus solar",
            "Electric heat pump for water heating only, no cylinder thermostat",
            "Electric immersion, off-peak, plus solar",
            "Electric immersion, standard tariff, no cylinder thermostat",
            "No system present?electric immersion assumed",
            "No system present : electric immersion assumed",
            "Electric immersion, dual tariff",
            "Electric immersion, standard tariff, no cylinderstat",
            "Electric heat pump for water heating only, plus solar",
            "Electric heat pump",
            "Electric immersion, standard tariff |Twymwr tanddwr, tarriff safonol",
            "Electric instantaneous at point of use, plus solar",
            "Electric immersion, standard tariff, waste water heat recovery",
            "Electric instantaneous at point of use, waste water heat recovery"
        ], icon: {waterBoiler, electricityIcon, heatPumpIcon}
    },

        {"waterSupply": [
            "From secondary system, no cylinderstat",
            "Community scheme",
            "Community scheme, no cylinder thermostat",
            "From secondary system, no cylinder thermostat",
            "Community scheme, plus solar",
            "community scheme",
            "community scheme, no cylinder thermostat",
            "Community scheme with CHP"
        ], icon: {pipeIcon, boilerBuilding}
    },

        {"waterSupply": [
            "Gas range cooker",
        ], icon: gasCylinderIcon},
            
        {"waterSupply": [
            "No system present: electric immersion assumed, no cylinder thermostat",
        ], icon: questionMarkIcon}
    ];


    const mainWaterSupplyDescription = description.toLowerCase();

    const match = waterSupplyGroups.find(type =>
        type.waterSupply.some(type => mainWaterSupplyDescription.includes(type))
    );

    return match ? match.icon : [];

};