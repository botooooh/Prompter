import React, { useRef } from 'react';
import './Editor.css';
import { Play, Moon, Sun, Download, Trash2, Upload, Clipboard } from 'lucide-react';

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

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="brand">
          <img src="/logo-arrondi.png" alt="Prompteur Logo" className="logo" />
          <h1>Prompter</h1>
        </div>
        <div className="editor-actions">
          <button className="theme-btn" onClick={toggleTheme} title="Basculer le thème">
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          
          <label className="import-btn">
            <Upload size={20} />
            Importer
            <input type="file" accept=".txt" onChange={handleImport} hidden />
          </label>
          
          <button className="start-btn" onClick={onStart} disabled={!text.trim()}>
            <Play size={20} />
            Démarrer
          </button>
        </div>
      </div>
      <div className="editor-body glass-panel">
        {text ? (
          <button 
            className="clear-btn" 
            onClick={() => setText('')}
            title="Effacer tout le texte"
          >
            <Trash2 size={20} />
          </button>
        ) : (
          <button 
            className="paste-btn" 
            onClick={handlePaste}
            title="Coller depuis le presse-papiers"
          >
            <Clipboard size={20} />
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
