import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-9R6JX4FXC2"; // Your Measurement ID

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
  console.log("Google Analytics initialized");
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (action, category, label) => {
  ReactGA.event({
    action: action,
    category: category,
    label: label,
  });
};
