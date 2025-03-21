import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LandlordDashboard.css";

const LandlordDashboard = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState(0);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="landlord-dashboard">
        <h2>Landlord Dashboard</h2>
        <p>Get some further insights into how an EPC rating can affect your properties, and what you can do to make improvements.</p>
      <div className="epc-info-section">
        <h3>Find Out About EPC & Why It Matters</h3>
        <p>
          Learn how EPC ratings impact your rental properties and how to improve energy efficiency.
        </p>
        <button 
          className="epc-info-button"
          onClick={() => window.open("https://energysavingtrust.org.uk/advice/guide-to-energy-performance-certificates-epcs/", "_blank")}
        >
          Learn More
        </button>
      </div>
      <div className="epc-recommendations-section">
        <h3>Improve Your EPC Rating</h3>
        <p>
          Discover practical recommendations provided by the Energy saving trust, to make your property more energy efficient and improve your EPC score.
        </p>
        <button 
          className="epc-recommendations-button"
          onClick={() => window.open("https://energysavingtrust.org.uk/landlords-how-to-make-your-property-more-energy-efficient/", "_blank")}
        >
          See Recommendations
        </button>
      </div>
    </div>
  );
};

export default LandlordDashboard;
