import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "./ComparePage.css";

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get selected properties from navigation state
  const { selectedProperties } = location.state || { selectedProperties: [] };
  const [propertyDetails, setPropertyDetails] = useState([]);

  useEffect(() => {
    console.log(" Received properties for comparison:", selectedProperties);

    if (selectedProperties.length >= 2 & selectedProperties.length <= 4) {
      fetchPropertyDetails(selectedProperties);
    }
  }, [selectedProperties]);

  // Function to fetch property details from backend
  const fetchPropertyDetails = async (uprns) => {
    try {
      
      const response = await axios.post("http://localhost:5000/api/property/compare?", {
        uprns, // Send selected UPRNs in the request body
      });

      console.log("Fetched Property Data:", response.data);
      setPropertyDetails(response.data); // Store received property details
    } catch (error) {
      console.error(" Error fetching property details:", error);
    }
  };

  // Redirect back if no valid data
  if (!selectedProperties || selectedProperties.length >= 2 ) {
    return (
      <div className="compare-container">
        <h2>Comparison Data Not Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="compare-container">
      <h2>Compare Properties</h2>

      <div className="compare-table-container">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              {selectedProperties.map((uprn, index) => (
                <th key={index}>Property UPRN: {uprn}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Postcode</td>
              {propertyDetails.map((property, index) => (
                <td key={index}>{property.postcode || "N/A"}</td>
              ))}
            </tr>
            <tr>
              <td>Property Type</td>
              {propertyDetails.map((property, index) => (
                <td key={index}>{property.propertyType || "N/A"}</td>
              ))}
            </tr>
            <tr>
              <td>Energy Rating</td>
              {propertyDetails.map((property, index) => (
                <td key={index}>{property.energyRating || "N/A"}</td>
              ))}
            </tr>
            <tr>
              <td>Energy Efficiency</td>
              {propertyDetails.map((property, index) => (
                <td key={index}>{property.energyEfficiency || "N/A"}</td>
              ))}
            </tr>
            <tr>
              <td>Price</td>
              {propertyDetails.map((property, index) => (
                <td key={index}>{property.price ? `£${property.price.toLocaleString()}` : "N/A"}</td>
              ))}
            </tr>
            <tr>
              <td>Size (sq ft)</td>
              {propertyDetails.map((property, index) => (
                <td key={index}>{property.size ? `${property.size} sq ft` : "N/A"}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Properties
      </button>
    </div>
  );
};

export default ComparePage;
