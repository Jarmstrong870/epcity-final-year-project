// RankingCard.js
import React from "react";
import styles from "./RankingCard.module.css";

// Helper function to determine background color based on rank percentile
function getRankColor(rank, total) {
  const percentile = (rank / total) * 100;
  if (percentile <= 20) return "#d4edda";  // top 20% = greenish
  if (percentile <= 40) return "#f0fbdc";  // next 20% = pale green
  if (percentile <= 60) return "#fff8e1";  // middle 20% = light yellow
  if (percentile <= 80) return "#ffe5e5";  // next 20% = light pink
  return "#f8d7da";                       // bottom 20% = more pronounced pink
}

// Helper function to convert a number to its ordinal string
function ordinalSuffix(i) {
  const j = i % 10,
        k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
}

const RankingCard = ({ title, metricName, rankData }) => {
  if (!rankData) {
    return (
      <div className={styles.RankingCard} style={{ backgroundColor: "#f0f0f0" }}>
        <h4>{title}</h4>
        <p>Loading ranking...</p>
      </div>
    );
  }

  const { rank, total } = rankData;
  const bgColor = getRankColor(rank, total);

  return (
    <div className={styles.RankingCard} style={{ backgroundColor: bgColor }}>
      <h4>{title}</h4>
      <p>
        This property is ranked <strong>{ordinalSuffix(rank)}</strong> out of {total} for {metricName}
        <br />
        (in this postcode &amp; bedroom category)
      </p>

    </div>
  );
};

export default RankingCard;
