import React, { useState } from 'react';
import './SplashScreen.css';

export function SplashScreen({ onComplete }) {
  const [isFading, setIsFading] = useState(false);

  const handleVideoEnd = () => {
    if (isFading) return;
    setIsFading(true);
    onComplete();
  };

  const handleError = () => {
    console.error("Erreur de chargement de la vidéo splash screen");
    handleVideoEnd();
  };

  return (
    <div className={`splash-container ${isFading ? 'fade-out' : ''}`}>
      <video 
        src="/Prompter.mp4" 
        autoPlay 
        muted 
        playsInline 
        onEnded={handleVideoEnd}
        onError={handleError}
        className="splash-video"
      />
    </div>
  );
}
