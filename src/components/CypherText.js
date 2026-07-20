import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

// A brutalist Cypher effect for text translation
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>|{}[]';

export default function CypherText({ text, speed = 30, delay = 0 }) {
  const { translate } = useTranslation();
  const targetText = translate(text);
  
  const [displayText, setDisplayText] = useState(targetText);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // If the text is already the target text, don't re-animate on first load
    // unless the language specifically changed. We'll use a small hack to detect change.
    
    let iterations = 0;
    const maxIterations = targetText.length;
    setIsAnimating(true);
    
    // Start after optional delay
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText((prev) => {
          return targetText.split('').map((char, index) => {
            if (index < iterations) {
              return targetText[index];
            }
            if (char === ' ') return ' ';
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          }).join('');
        });

        if (iterations >= maxIterations) {
          clearInterval(interval);
          setIsAnimating(false);
          setDisplayText(targetText);
        }
        
        // The speed at which it settles
        iterations += 1/3;
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
    
  }, [targetText, speed, delay]);

  return (
    <span className={`inline-block ${isAnimating ? 'opacity-80' : 'opacity-100'}`}>
      {displayText}
    </span>
  );
}
