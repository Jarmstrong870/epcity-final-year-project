import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyFinder.css';

const PropertyFinder = () => {
    const [userSearch, setUserSearch] = useState(""); // User input for postcode or address
    const [inputError, setInputError] = useState(""); // Error handling
    const [matchingProperties, setMatchingProperties] = useState([]); // List of matching properties
    const navigate = useNavigate();

    const handleUserSearch = async () => {
        setInputError(""); // Clear previous errors
        setMatchingProperties([]); // Reset results

        if (!userSearch.trim()) {
            setInputError("Please enter a valid postcode or address.");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/property/alter?search=${encodeURIComponent(userSearch.trim())}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch properties.");
            }

            const properties = await response.json();

            if (!properties.length) {
                setInputError("No properties found matching this address or postcode.");
                return;
            }

            // If multiple properties match, display them
            setMatchingProperties(properties);

            // If only one property matches, navigate to its individual page
            if (properties.length === 1) {
                navigate(`/property/${encodeURIComponent(properties[0].uprn)}`);
            }
        } catch (error) {
            setInputError(error.message || "An error occurred while searching.");
        }
    };

    const handleViewAllProperties = () => {
        // Navigate to the view all properties page
        navigate("/propertylist");
    };

    return (
        <div className="propertyPopUp">
            <h1>Find Your Property's EPC</h1>
            <p>Enter your postcode or address to search for your property:</p>
            <input
                type="text"
                value={userSearch}
                onChange={(e) => {
                    setUserSearch(e.target.value);
                    setInputError(""); // Clear error on input change
                }}
                placeholder="Enter postcode or address"
                className="input-text"
            />
            {inputError && <p className="error-message">{inputError}</p>}
            <button onClick={handleUserSearch} className="search-button">
                Search
            </button>

            {/* Display list of matching properties */}
            {matchingProperties.length > 1 && (
                <div className="results-container">
                    <h2>Matching Properties</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Postcode</th>
                                <th>Property Type</th>
                                <th>Current Energy Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matchingProperties.map((property) => (
                                <tr key={property.uprn}>
                                    <td>
                                        <button
                                            className="property-link"
                                            onClick={() =>
                                                navigate(`/property/${encodeURIComponent(property.uprn)}`)
                                            }
                                        >
                                            {property.address}
                                        </button>
                                    </td>
                                    <td>{property.postcode}</td>
                                    <td>{property.property_type}</td>
                                    <td>{property.current_energy_rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PropertyFinder;