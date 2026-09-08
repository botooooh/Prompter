import React from 'react';
import './Controls.css';
import { Play, Pause, ArrowLeft, Settings2, Swap, Document, Category } from './Icons';

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

  return (
    <div className="controls-container glass-panel">
      {/* Top Main Row */}
      <div className="controls-main">
        <button className="icon-btn" onClick={onBack} title="Retour à l'éditeur">
          <ArrowLeft size={24} />
        </button>

        <button className="play-btn" onClick={onPlayPause} title="Lecture/Pause (Espace)">
          {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
        </button>

        <button 
          className={`icon-btn ${showSettings ? 'active' : ''}`} 
          onClick={() => setShowSettings(!showSettings)}
          title="Paramètres"
        >
          <Settings2 size={24} />
        </button>
      </div>

      {/* Expandable Settings */}
      {showSettings && (
        <div className="controls-settings">
          
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
              <Swap size={20} />
              Miroir H
            </button>
            <button className={`toggle-btn ${mirrorY ? 'active' : ''}`} onClick={() => setMirrorY(!mirrorY)}>
              <Swap size={20} style={{ transform: 'rotate(90deg)' }} />
              Miroir V
            </button>
            <button className={`toggle-btn ${alignment === 'left' ? 'active' : ''}`} onClick={() => setAlignment('left')}>
              <Document size={20} />
            </button>
            <button className={`toggle-btn ${alignment === 'center' ? 'active' : ''}`} onClick={() => setAlignment('center')}>
              <Category size={20} />
            </button>
            <label className="checkbox-label">
              <input type="checkbox" checked={showGuide} onChange={(e) => setShowGuide(e.target.checked)} />
              Repère
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
