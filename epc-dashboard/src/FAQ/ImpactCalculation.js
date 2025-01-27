import React from "react";
import "./EICalculator.css";

const impactCalculation = (propertyType, heatingType, duration) => {
    const elephantEquivalent = 500;
    const phoneChargeEquivalent = 0.015;
    const airplaneEnergyEquivalent = 0.2;

    const energyConversions = {
        House
    }

    const energyRate = energyConversions[propertyType]?.[heatingType]
}