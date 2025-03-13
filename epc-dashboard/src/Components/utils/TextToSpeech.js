import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import "./TextToSpeech.css";

// Mapping language codes to Web Speech API-supported codes
const languageMap = {
  en: "en-GB",
  fr: "fr-FR",
  es: "es-ES",
  pl: "pl-PL",
  zh: "zh-CN",
};

// Function to remove emojis from text
const removeEmojis = (text) => {
  return text.replace(/[\uD800-\uDFFF]/g, "");
};

const TextToSpeech = ({ language }) => {
  const [isToggledOn, setIsToggledOn] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Function to get and update available voices
  const updateVoices = () => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      setTimeout(updateVoices, 100);
      return;
    }

    setVoicesLoaded(true);

    const selectedLanguage = languageMap[language] || "en-GB";
    let preferredVoices = voices.filter((v) => v.lang === selectedLanguage);

    // Prioritize high-quality English voices
    if (language === "en") {
      preferredVoices = voices.filter(
        (v) =>
          v.name.includes("Google UK English Male") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Microsoft David") ||
          v.name.includes("Microsoft Zira") ||
          v.name.includes("Apple")
      );
    }

    // Pick the best available voice
    const bestVoice =
      preferredVoices[0] ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    setCurrentVoice(bestVoice);
  };

  // Load voices initially
  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    updateVoices();
  }, []);

  // Handle language change: update the voice, reset toggle, and refresh voices
  useEffect(() => {
    window.speechSynthesis.cancel(); // Stop current speech
    setIsToggledOn(false); // Auto-turn off toggle
    setVoicesLoaded(false); // Force voice reload

    setTimeout(updateVoices, 200); // Ensure voices update
  }, [language]);

  // Function to speak text with the best voice
  const speakText = (text) => {
    if (!voicesLoaded) return;

    const cleanText = removeEmojis(text);
    if (utterance) {
      window.speechSynthesis.cancel();
    }

    const newUtterance = new SpeechSynthesisUtterance(cleanText);
    newUtterance.lang = languageMap[language] || "en-GB";

    if (currentVoice) {
      newUtterance.voice = currentVoice;
    }

    window.speechSynthesis.speak(newUtterance);
    setUtterance(newUtterance);
  };

  // Handle dropdown hover (since `option` does not support hover events)
  const handleDropdownHover = (event) => {
    if (isToggledOn) {
      const selectedIndex = event.target.selectedIndex;
      const selectedOption = event.target.options[selectedIndex];
      speakText(selectedOption.textContent);
    }
  };

  // Handle text selection (highlight)
  const handleHighlightText = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      speakText(selectedText);
    }
  };

  // Handle hover for buttons, links, and other interactive elements
  const handleHover = (event) => {
    if (isToggledOn) {
      const target = event.target;
      if (target.matches("button, a")) {
        speakText(target.textContent);
      }
    }
  };

  // Attach event listeners
  useEffect(() => {
    if (isToggledOn) {
      document.addEventListener("mouseup", handleHighlightText);
      document.addEventListener("mouseover", handleHover);

      // Add hover event to all dropdowns
      const dropdowns = document.querySelectorAll("select");
      dropdowns.forEach((dropdown) => {
        dropdown.addEventListener("mouseover", handleDropdownHover);
      });

      return () => {
        document.removeEventListener("mouseup", handleHighlightText);
        document.removeEventListener("mouseover", handleHover);
        dropdowns.forEach((dropdown) => {
          dropdown.removeEventListener("mouseover", handleDropdownHover);
        });
      };
    }
  }, [isToggledOn]);

  // Toggle function
  const toggleSpeech = () => {
    setIsToggledOn(!isToggledOn);
  };

  return (
    <div className="tts-toggle-container">
      <label className="tts-label">TEXT TO SPEECH</label>
      <Switch
        onChange={toggleSpeech}
        checked={isToggledOn}
        offColor="#d3d3d3"
        onColor="#4CAF50"
        handleDiameter={20}
        height={34}
        width={60}
        uncheckedIcon={false}
        checkedIcon={false}
        className="react-switch"
      />
    </div>
  );
};

export default TextToSpeech;
