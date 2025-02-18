import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StreetView from "./propertyPage/StreetView";
import { fetchLocationCoords } from "./propertyPage/propertyUtils";
import EPCFullTable from "./propertyPage/EPCFullTable/EPCFullTable";
import translations from "../locales/translations_comparepage";
import { findMaxValues } from "./Compare_utils/Compare_utils";
import "./ComparePage.css";

const ComparePage = ({ language }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProperties } = location.state || { selectedProperties: [] };

  const [propertyDetails, setPropertyDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);
  const [streetViewURLs, setStreetViewURLs] = useState({});

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const t = translations[language] || translations.en;

  useEffect(() => {
    if (selectedProperties.length < 2 || selectedProperties.length > 4) {
      setError(t.errorInvalidSelection);
    } else {
      fetchPropertyDetails(selectedProperties);
    }
  }, [selectedProperties, language]);

  const fetchPropertyDetails = async (uprns) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/property/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uprns }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPropertyDetails(data);

      data.forEach((property) => {
        fetchLocationCoords(
          property.address,
          property.postcode,
          GOOGLE_MAPS_API_KEY,
          () => {},
          (streetViewURL) => {
            setStreetViewURLs((prev) => ({
              ...prev,
              [property.uprn]: streetViewURL,
            }));
          },
          () => {}
        );
      });
    } catch (error) {
      console.error("Error fetching property details:", error);
      setError(t.errorFetching);
    } finally {
      setLoading(false);
    }
  };

  const maxValues = propertyDetails.length > 0 ? findMaxValues(propertyDetails) : {};

  const gridClass =
    propertyDetails.length === 2
      ? "two-properties"
      : propertyDetails.length === 3
      ? "three-properties"
      : "four-properties";

  // Auto-focus scroll container on load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.focus();
    }
  }, []);

  //  Handle arrow key scrolling
  const handleKeyDown = (event) => {
    if (!scrollRef.current) return;
    const scrollAmount = 200; // Adjust scroll speed

    if (event.key === "ArrowRight") {
      scrollRef.current.scrollLeft += scrollAmount;
    } else if (event.key === "ArrowLeft") {
      scrollRef.current.scrollLeft -= scrollAmount;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  //  Track Horizontal Scroll Progress
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const progress = (scrollLeft / scrollWidth) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <div className="compare-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        {t.backToProperties}
      </button>
      <h2>{t.compareProperties}</h2>

      {/*  Stylish Scroll Indicator */}
      <div className="scroll-indicator-container">
        <span className="scroll-indicator-text">
          <i className="fas fa-arrow-left"></i> Use the <strong>right and left arrow keys</strong> or the <strong>scroll bar at the bottom</strong> to move across.{" "}
          <i className="fas fa-arrow-right"></i>
        </span>
      </div>

      {/*  Scroll Bar */}
      <div className="scroll-indicator-bar">
        <div
          className="scroll-indicator-progress"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {loading ? (
        <p>{t.loading}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div
          className="compare-table-container"
          ref={scrollRef}
          onScroll={handleScroll}
          tabIndex="0" // Makes the scroll container focusable
        >
          <div className={`compare-grid ${gridClass}`}>
            {propertyDetails.map((property, index) => (
              <div key={index} className="compare-column">
                <div className="property-image-container">
                  {streetViewURLs[property.uprn] ? (
                    <StreetView streetViewURL={streetViewURLs[property.uprn]} errorMessage="" />
                  ) : (
                    <img
                      src={property.image_url || "/default-image.jpg"}
                      alt={`Property at ${property.address}`}
                    />
                  )}
                </div>

                <EPCFullTable properties={[property]} maxValues={maxValues} loading={false} language={language} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
