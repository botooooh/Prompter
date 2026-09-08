import React from 'react';
import './Controls.css';
import { Play, Pause, ArrowLeft, Settings2, FlipHorizontal, FlipVertical, AlignLeft, AlignCenter } from 'lucide-react';

export function Controls({
  onBack,
  isPlaying,
  onPlayPause,
  fontSize,
  setFontSize,
  speed,
  setSpeed,
  mirrorX,
  setMirrorX,
  mirrorY,
  setMirrorY,
  alignment,
  setAlignment,
  margins,
  setMargins,
  showGuide,
  setShowGuide
}) {
  const [showSettings, setShowSettings] = React.useState(false);

  // Speed cycling logic
  const speedOptions = [50, 100, 150, 200, 300];
  const getSpeedLabel = (s) => {
    if (s <= 50) return "0.5x";
    if (s <= 100) return "1x";
    if (s <= 150) return "1.5x";
    if (s <= 200) return "2x";
    return "3x";
  };
  
  const cycleSpeed = () => {
    const currentIndex = speedOptions.findIndex(s => s >= speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setSpeed(speedOptions[nextIndex]);
  };

  return (
    <div className="controls-container">
      {/* Expandable Settings (Floating bubble) */}
      {showSettings && (
        <div className="controls-settings glass-panel">
          <div className="setting-group">
            <label>Vitesse ({speed} px/s)</label>
            <input 
              type="range" 
              min="10" 
              max="500" 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
          
          <div className="setting-group">
            <label>Taille du texte ({fontSize}px)</label>
            <input 
              type="range" 
              min="24" 
              max="150" 
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label>Marges ({margins}vw)</label>
            <input 
              type="range" 
              min="5" 
              max="40" 
              value={margins} 
              onChange={(e) => setMargins(Number(e.target.value))}
            />
          </div>

          <div className="setting-toggles">
            <button className={`toggle-btn ${mirrorX ? 'active' : ''}`} onClick={() => setMirrorX(!mirrorX)}>
              <FlipHorizontal size={20} />
            </button>
            <button className={`toggle-btn ${mirrorY ? 'active' : ''}`} onClick={() => setMirrorY(!mirrorY)}>
              <FlipVertical size={20} />
            </button>
            <button className={`toggle-btn ${alignment === 'left' ? 'active' : ''}`} onClick={() => setAlignment('left')}>
              <AlignLeft size={20} />
            </button>
            <button className={`toggle-btn ${alignment === 'center' ? 'active' : ''}`} onClick={() => setAlignment('center')}>
              <AlignCenter size={20} />
            </button>
            <label className="checkbox-label">
              <input type="checkbox" checked={showGuide} onChange={(e) => setShowGuide(e.target.checked)} />
              Repère
            </label>
          </div>
        </div>
      )}

      {/* Main Pill Bar */}
      <div className="controls-main glass-panel">
        <button className="play-btn" onClick={onPlayPause} title="Lecture/Pause (Espace)">
          {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
          <span>{isPlaying ? "Pause" : "Démarrer"}</span>
        </button>

        <button 
          className={`icon-btn ${showSettings ? 'active' : ''}`} 
          onClick={() => setShowSettings(!showSettings)}
          title="Paramètres"
        >
          <Settings2 size={20} />
        </button>

        <button className="icon-btn speed-btn" onClick={cycleSpeed} title="Vitesse">
          <span className="speed-text">{getSpeedLabel(speed)}</span>
        </button>
      </div>
    </div>
  );


