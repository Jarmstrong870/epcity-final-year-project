import React, {useState} from 'react';

const categories = {
    "Very Good": ["Cavity wall, filled cavity and internal insulation", "Cavity wall, filled cavity and external insulation", "Solid brick, with external insulation", "System built, with external insulation", "Cavity wall, with external insulation", "Granite or whinstone, with external insulation", "Sandstone or limestone, with external insulation", "Timber frame, with additional insulation", "Granite or whinstone, with internal insulation", "Sandstone, with internal insulation"],
    "Good": ["Cavity wall, filled cavity", "Solid brick, with internal insulation", "System built, with internal insulation", "Timber frame, with internal insulation", "Cavity wall, with internal insulation", "Sandstone or limestone, as built, insulated (assumed)", "System built, as built, insulated (assumed)", "Granite or whinstone, as built, insulated (assumed)", "Sandstone, as built, insulated (assumed)", "Cob, with external insulation"],
    "Medium": ["Cavity wall, as built, insulated (assumed)", "Timber frame, as built, insulated (assumed)", "Cavity wall, as built, partial insulation (assumed)", "Timber frame, as built, partial insulation (assumed)", "Solid brick, as built, insulated (assumed)", "Solid brick, filled cavity", "Granite or whinstone, as built, partial insulation (assumed)", "Granite or whin, as built, partial insulation (assumed)", "Sandstone or limestone, as built, partial insulation (assumed)"],
    "Poor": ["Cavity wall, as built, no insulation (assumed)", "Timber frame, as built, no insulation (assumed)", "System built, as built, partial insulation (assumed)", "Granite or whinstone, as built, no insulation (assumed)", "Granite or whin, as built, no insulation (assumed)", "Sandstone or limestone, as built, no insulation (assumed)", "Sandstone, as built, no insulation (assumed)", "Cob, as built"],
    "Very Poor": ["Solid brick, as built, no insulation (assumed)", "Cavity wall, no insulation (assumed)", "System built, as built, no insulation (assumed)"]
};

export function classifyWall(description) {
    const match = description.match(/\d+\.\d+/);
    
    if (match) {
        const value = parseFloat(match[0]);
        return value < 0.5 ? "Very Good" :
               value < 1 ? "Good" :
               value < 1.5 ? "Medium" :
               value < 2 ? "Poor" : "Very Poor";
    }
    
    return Object.entries(categories).find(([category, walls]) =>
        walls.some(wall => description.toLowerCase().includes(wall.toLowerCase()))
    )?.[0] || "Unidentified";
}
