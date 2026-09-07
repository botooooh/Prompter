import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Prompter } from './components/Prompter';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Download } from 'lucide-react';

function App() {
  const [text, setText] = useLocalStorage('prompteur-text', '');
  const [mode, setMode] = useState('editor'); // 'editor' | 'prompter'
  const [theme, setTheme] = useLocalStorage('prompteur-theme', 'dark');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {deferredPrompt && (
        <button 
          className="install-btn glass-panel" 
          onClick={handleInstallClick}
          title="Installer l'application"
        >
          <Download size={20} />
        </button>
      )}
      
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

