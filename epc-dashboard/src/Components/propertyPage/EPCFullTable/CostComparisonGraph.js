import React, { useEffect, useState } from "react";
import { fetchGraphData } from "../propertyUtils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import "./CostComparisonGraph.css";

const CostComparisonGraph = ({ properties }) => {
    const [graphData, setGraphData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedMetric, setSelectedMetric] = useState("Heating"); // Default: Heating

    useEffect(() => {
        if (properties) {
            fetchGraphData(properties.number_bedrooms, properties.postcode, setGraphData, setErrorMessage);
        }
    }, [properties.number_bedrooms, properties.postcode]);

    // Format data for Recharts (NUMBERS ONLY)
    const chartData = graphData.map((prop) => ({
        name: prop.address,
        uprn: prop.uprn, // Unique identifier
        Heating: prop.heating_cost_current,
        "Hot Water": prop.hot_water_cost_current,
        Lighting: prop.lighting_cost_current,
        "Total Floor Area": prop.total_floor_area
    }));

    // Y-axis labels for each metric
    const yAxisLabels = {
        Heating: "£ per year",
        "Hot Water": "£ per year",
        Lighting: "£ per year",
        "Total Floor Area": "Square Meters(m²)"
    };

    // Custom Tooltip Formatter (Now returns JSX instead of a string)
    const formatTooltip = (value, name, props) => {
        const isCurrentProperty = props.payload && props.payload.uprn === properties.uprn; // Check if this is the current property
        return (
            <span style={{ fontWeight: isCurrentProperty ? "bold" : "normal", color: isCurrentProperty ? "red" : "black" }}>
                {name}: {name === "Total Floor Area" ? `${value} m²` : `£${value}`}
            </span>
        );
    };


    return (
        <div className="epc-container">
            <h2 className="sectionHeader">Cost Comparison Graph</h2>

            {/* Dropdown to select one metric at a time */}
            <div className="metric-selector">
                <label>Select a Metric: </label>
                <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                    <option value="Heating">Heating Costs</option>
                    <option value="Hot Water">Hot Water Costs</option>
                    <option value="Lighting">Lighting Costs</option>
                    <option value="Total Floor Area">Total Floor Area</option>
                </select>
            </div>

            {/* Render Graph */}
            {graphData.length === 0 ? (
                <p>Loading or no data available...</p>
            ) : (
                <ResponsiveContainer width="95%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis 
                            label={{ value: yAxisLabels[selectedMetric], angle: -90, position: "insideLeft" }} 
                        />
                        <Tooltip formatter={formatTooltip} />
                        <Legend />
                        <Bar dataKey={selectedMetric}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.uprn === properties.uprn ? "#279f49" : "#2d2d2d" } // Highlight current property in gold
                                    stroke={entry.uprn === properties.uprn ? "#000" : "none"} // Add a black border for extra emphasis
                                    strokeWidth={entry.uprn === properties.uprn ? 2 : 0}
                                    cursor="pointer" // Makes it visually clickable
                                    onClick={() => window.location.href = `/property/${entry.uprn}`} // Redirect when clicked
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default CostComparisonGraph;
