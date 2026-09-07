import React, { useRef, useEffect, useState } from 'react';
import './Prompter.css';
import { useScroll } from '../hooks/useScroll';
import { Controls } from './Controls';

export function Prompter({ text, onBack }) {
  const containerRef = useRef(null);
  
  // Prompter settings state
  const [fontSize, setFontSize] = useState(64); // px
  const [speed, setSpeed] = useState(100); // px per sec
  const [mirrorX, setMirrorX] = useState(false);
  const [mirrorY, setMirrorY] = useState(false);
  const [alignment, setAlignment] = useState('center');
  const [margins, setMargins] = useState(15); // %
  const [showGuide, setShowGuide] = useState(true);
  
  // UI states
  const [controlsVisible, setControlsVisible] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const { isPlaying, togglePlay, startScroll, pauseScroll, updateSpeed } = useScroll(containerRef, speed);

  // Sync speed changes
  useEffect(() => {
    updateSpeed(speed);
  }, [speed, updateSpeed]);

  // Hide controls when playing
  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setControlsVisible(false), 2000);
    } else {
      setControlsVisible(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  // Mouse movement shows controls
  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true);
      if (isPlaying) {
        // Hide again after 3s of inactivity
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'ArrowUp') {
        setSpeed(s => Math.max(10, s - 10));
      }
      if (e.code === 'ArrowDown') {
        setSpeed(s => Math.min(500, s + 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  const handleStartWithCountdown = () => {
    if (isPlaying) {
      pauseScroll();
      return;
    }
    
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          startScroll();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const transformStyle = `
    ${mirrorX ? 'scaleX(-1)' : ''}
    ${mirrorY ? 'scaleY(-1)' : ''}
  `;

  return (
    <div className="prompter-wrapper">
      {countdown > 0 && (
        <div className="countdown-overlay">
          <span>{countdown}</span>
        </div>
      )}

      {showGuide && <div className="read-guide" />}

      <div 
        ref={containerRef}
        className="prompter-container"
        style={{ padding: `50vh ${margins}vw` }}
      >
        <div 
          className="prompter-text"
          style={{ 
            fontSize: `${fontSize}px`, 
            textAlign: alignment,
            transform: transformStyle
          }}
        >
          {text.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00A0'}</p>
          ))}
        </div>
      </div>

      <div className={`controls-wrapper ${controlsVisible ? 'visible' : 'hidden'}`}>
        <Controls 
          onBack={onBack}
          isPlaying={isPlaying}
          onPlayPause={handleStartWithCountdown}
          fontSize={fontSize}
          setFontSize={setFontSize}
          speed={speed}
          setSpeed={setSpeed}
          mirrorX={mirrorX}
          setMirrorX={setMirrorX}
          mirrorY={mirrorY}
          setMirrorY={setMirrorY}
          alignment={alignment}
          setAlignment={setAlignment}
          margins={margins}
          setMargins={setMargins}
          showGuide={showGuide}
          setShowGuide={setShowGuide}
        />
      </div>
    </div>
  );
}
