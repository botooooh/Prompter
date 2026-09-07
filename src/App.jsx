import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Prompter } from './components/Prompter';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [text, setText] = useLocalStorage('prompteur-text', '');
  const [mode, setMode] = useState('editor'); // 'editor' | 'prompter'
  const [theme, setTheme] = useLocalStorage('prompteur-theme', 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Global Theme Toggle */}
      {mode === 'editor' && (
        <button 
          onClick={toggleTheme} 
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 1000,
            padding: '12px',
            borderRadius: '50%',
            background: 'var(--surface-color)',
            border: 'var(--glass-border)',
            backdropFilter: 'var(--glass-blur)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-soft)',
            color: 'var(--text-primary)'
          }}
          title="Basculer le thème"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}

      {mode === 'editor' ? (
        <Editor 
          text={text} 
          setText={setText} 
          onStart={() => setMode('prompter')} 
        />
      ) : (
        <Prompter 
          text={text} 
          onBack={() => setMode('editor')} 
        />
      )}
    </>
  );
}

export default App;
