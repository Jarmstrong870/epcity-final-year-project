const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Set the base URL
    env: {
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Pass API key from .env
    },
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      return config;
    },
  },
});
