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
      {mode === 'editor' ? (
        <Editor 
          text={text} 
          setText={setText} 
          onStart={() => setMode('prompter')}
          theme={theme}
          toggleTheme={toggleTheme}
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
