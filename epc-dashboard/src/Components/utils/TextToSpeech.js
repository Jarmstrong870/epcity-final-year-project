import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from 'lucide-react';  // Import both icons for on/off

// Mapping language codes to Web Speech API-supported codes
const languageMap = {
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  pl: 'pl-PL',
  zh: 'zh-CN'
};

const TextToSpeech = ({ text, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);  // Track if narration is ongoing
  const utteranceRef = useRef(null);  // Keep reference to the current speech instance

  const toggleSpeech = () => {
    if (isSpeaking) {
      // Stop the speech if currently speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (text) {
        // Adjust sentence splitting based on language
        const sentenceSplitter = language === 'zh'
          ? /(?<=[。！？])\s*/  // Use Chinese punctuation for Mandarin
          : /(?<=[.?!])\s+/;   // Default punctuation for other languages

        const sentences = text.split(sentenceSplitter);  // Split sentences appropriately
        let index = 0;

        const speakSentence = () => {
          if (index < sentences.length) {
            const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
            utterance.lang = languageMap[language] || 'en-GB';

            utterance.onend = () => {
              index++;
              if (index < sentences.length) {
                setTimeout(speakSentence, 250);  // Pause between sentences
              } else {
                setIsSpeaking(false);  // Reset when finished
              }
            };

            utterance.onerror = () => {
              console.error('Speech synthesis error');  // Log any errors for debugging
              setIsSpeaking(false);  // Reset on error
            };

            utteranceRef.current = utterance;  // Store the utterance reference
            window.speechSynthesis.speak(utterance);
          }
        };

        setIsSpeaking(true);  // Set the speaking state to true
        speakSentence();  // Start narration
      }
    }
  };

  return (
    <button onClick={toggleSpeech} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      {isSpeaking ? <Volume2 size={24} /> : <VolumeX size={24} />}  {/* Toggle icons */}
    </button>
  );
};

export default TextToSpeech;
