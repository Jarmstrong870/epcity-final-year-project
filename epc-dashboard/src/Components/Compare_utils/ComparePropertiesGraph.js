import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import "./ComparePropertiesGraph.css";

const ComparePropertiesGraph = ({ properties }) => {
    const [graphData, setGraphData] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState("Heating");

    // Prepare graph data
    useEffect(() => {
        if (properties && properties.length > 0) {
            const formattedData = properties.map((prop) => ({
                name: `${prop.address || "Unknown"}`,
                uprn: prop.uprn,
                Heating: prop.heating_cost_current ?? 0,
                "Hot Water": prop.hot_water_cost_current ?? 0,
                Lighting: prop.lighting_cost_current ?? 0,
                "Total Floor Area": prop.total_floor_area ?? 0,
            }));
            setGraphData(formattedData);
        }
    }, [properties]);

    // Y-axis labels for each metric
    const yAxisLabels = {
        Heating: "£ per year",
        "Hot Water": "£ per year",
        Lighting: "£ per year",
        "Total Floor Area": "Square Meters (m²)"
    };

    // Custom Tooltip Formatter
    const formatTooltip = (value, name) => (
        <span>{`${name}: ${name === "Total Floor Area" ? `${value} m²` : `£${value}`}`}</span>
    );

    // Bar Colors for Each Metric
    const getBarColor = (metric) => {
        switch (metric) {
            case "Heating":
                return "#007bff"; // Blue
            case "Hot Water":
                return "#00c853"; // Green
            case "Lighting":
                return "#ffa500"; // Orange
            case "Total Floor Area":
                return "#6a0dad"; // Purple
            default:
                return "#007bff";
        }
    };

    return (
        <div className="epc-container">
            <h3 className="graph-title"> Cost Comparison Graph</h3>

            {/* Toggle Metric Buttons */}
            <div className="toggle-buttons">
                {Object.keys(yAxisLabels).map((metric) => (
                    <button
                        key={metric}
                        className={selectedMetric === metric ? "active" : ""}
                        onClick={() => setSelectedMetric(metric)}
                    >
                        {metric === "Total Floor Area" ? "Total Floor Area" : `${metric} Costs`}
                    </button>
                ))}
            </div>

            {graphData.length > 0 ? (
                <div className="graph-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fill: "#007bff" }} />
                            <YAxis
                                label={{ value: yAxisLabels[selectedMetric], angle: -90, position: "insideLeft" }}
                                tick={{ fill: "#007bff" }}
                            />
                            <Tooltip formatter={formatTooltip} />
                            <Legend />
                            <Bar dataKey={selectedMetric} radius={[10, 10, 0, 0]}>
                                {graphData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getBarColor(selectedMetric)} // Set color based on metric
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p>No data available for this metric.</p>
            )}
        </div>
    );
};

export default ComparePropertiesGraph;
