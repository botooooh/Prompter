import React, { useRef } from 'react';
import './Editor.css';
import { Play, Moon, Sun, Download, Trash2 } from 'lucide-react';

export function Editor({ text, setText, onStart, theme, toggleTheme, showInstallBtn, onInstall }) {
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="brand">
          <img src="/logo-arrondi.png" alt="Prompteur Logo" className="logo" />
          <h1>Prompteur</h1>
        </div>
        <div className="editor-actions">
          {showInstallBtn && (
            <button className="theme-btn glass-panel" onClick={onInstall} title="Installer l'application">
              <Download size={20} />
            </button>
          )}
          <label className="import-btn glass-panel">
            Importer TXT
            <input type="file" accept=".txt" onChange={handleImport} hidden />
          </label>
          <button className="theme-btn glass-panel" onClick={toggleTheme} title="Basculer le thème">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="start-btn glass-panel" onClick={onStart} disabled={!text.trim()}>
            <Play size={20} />
            Démarrer
          </button>
        </div>
      </div>
      <div className="editor-body glass-panel">
        {text && (
          <button 
            className="clear-btn" 
            onClick={() => setText('')}
            title="Effacer tout le texte"
          >
            <Trash2 size={20} />
          </button>
        )}
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder="Saisissez ou collez votre texte ici..."
          className="editor-textarea"
        />
      </div>
    </div>
  );
}
