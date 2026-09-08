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

  const isIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isStandalone = () => {
    return ('standalone' in window.navigator && window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;
  };

  const showInstallBtn = deferredPrompt || (isIOS() && !isStandalone());

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS()) {
      alert("Pour installer l'application sur votre appareil iOS : appuyez sur le bouton 'Partager' en bas de l'écran, puis sélectionnez 'Sur l'écran d'accueil'.");
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {showInstallBtn && (
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

