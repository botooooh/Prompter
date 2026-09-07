import React, { useRef } from 'react';
import './Editor.css';
import { Play } from 'lucide-react';

export function Editor({ text, setText, onStart }) {
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
        <h1>Prompteur</h1>
        <div className="editor-actions">
          <label className="import-btn glass-panel">
            Importer TXT
            <input type="file" accept=".txt" onChange={handleImport} hidden />
          </label>
          <button className="start-btn glass-panel" onClick={onStart} disabled={!text.trim()}>
            <Play size={20} />
            Démarrer
          </button>
        </div>
      </div>
      <div className="editor-body glass-panel">
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
