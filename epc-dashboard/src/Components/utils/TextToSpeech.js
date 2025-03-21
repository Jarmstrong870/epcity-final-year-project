import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import "./TextToSpeech.css";

const languageMap = {
  en: "en-GB",
  fr: "fr-FR",
  es: "es-ES",
  pl: "pl-PL",
  zh: "zh-CN",
};

const removeEmojis = (text) => {
  return text.replace(/[\uD800-\uDFFF]/g, "");
};

const TextToSpeech = ({ language }) => {
  const [isToggledOn, setIsToggledOn] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  const updateVoices = () => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      setTimeout(updateVoices, 100);
      return;
    }

    setVoicesLoaded(true);

    const selectedLanguage = languageMap[language] || "en-GB";
    let preferredVoices = voices.filter((v) => v.lang === selectedLanguage);

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

    const bestVoice =
      preferredVoices[0] ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    setCurrentVoice(bestVoice);
  };

  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    updateVoices();
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsToggledOn(false);
    setVoicesLoaded(false);
    setTimeout(updateVoices, 200);
  }, [language]);

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

  const toggleSpeech = () => {
    setIsToggledOn(!isToggledOn);
    setShowSpeechBubble(!isToggledOn); // Only show speech bubble if toggle is on
  };

  // Close speech bubble
  const closeSpeechBubble = () => {
    setShowSpeechBubble(false);
  };

  return (
    <div className="tts-toggle-container">
      <label className="tts-label">Text To Speech</label>

      {/* Toggle switch */}
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

      {/* Speech Bubble with instructions */}
      {showSpeechBubble && (
        <div className="speech-bubble">
          {/* Close bubble div */}
          <div className="close-bubble" onClick={closeSpeechBubble}>
            X
          </div>
          <ol>
            <li>You can trigger text to speech in 3 ways:</li>
            <li>1. Hover over buttons or links.</li>
            <li>2. Highlight text with your cursor and it will be read aloud.</li>
            <li>3. Select a dropdown option to hear it spoken.</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
