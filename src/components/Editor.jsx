import React, { useRef } from 'react';
import './Editor.css';
import { Play, Moon, Sun, Download, Trash2, Upload, Clipboard, Bold, Highlighter, Camera } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

export function Editor({ text, setText, onStart, theme, toggleTheme, showInstallBtn, onInstall, useCamera, setUseCamera }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: text || '',
    onUpdate: ({ editor }) => {
      setText(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'editor-textarea tiptap-editor',
        placeholder: "Saisissez ou collez votre texte ici...",
      },
    },
  });

  const handleClear = () => {
    setText('');
    editor?.commands.setContent('');
  };
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
        editor?.commands.setContent(clipboardText);
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
          
          <button 
            className={`camera-toggle-btn ${useCamera ? 'active' : ''}`} 
            onClick={() => setUseCamera(!useCamera)}
            title="Enregistrer avec la caméra"
          >
            <Camera size={20} />
          </button>

          <button className="start-btn" onClick={onStart} disabled={!text || text === '<p></p>'} title="Démarrer le prompteur">
            <Play size={20} />
            Démarrer
          </button>
        </div>
      </div>
      <div className="editor-body glass-panel">
        {text && text !== '<p></p>' ? (
          <button 
            className="clear-btn" 
            onClick={handleClear}
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
        
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubble-menu glass-panel">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
              title="Gras"
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()}
              className={editor.isActive('highlight', { color: '#ffcc00' }) ? 'is-active' : ''}
              style={{ color: '#ffcc00' }}
              title="Surligner en jaune"
            >
              <Highlighter size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#ff4444' }).run()}
              className={editor.isActive('highlight', { color: '#ff4444' }) ? 'is-active' : ''}
              style={{ color: '#ff4444' }}
              title="Surligner en rouge"
            >
              <Highlighter size={18} />
            </button>
          </BubbleMenu>
        )}
        
        <EditorContent editor={editor} className="editor-content-wrapper" />
      </div>
    </div>
  );
}
