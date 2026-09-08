import React, { useState, useEffect } from 'react';
import './ReloadPrompt.css';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const [updateMessage, setUpdateMessage] = useState("Faites la mise à jour pour bénéficier des nouvelles fonctionnalités.");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFinished, setUpdateFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (needRefresh) {
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      
      if (!isPWA) {
        // Auto update for website visitors
        updateServiceWorker(true);
        return;
      }

      // Fetch changelog.json to display dynamic update message for PWA users
      fetch(`/changelog.json?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.message) {
            setUpdateMessage(data.message);
          }
        })
        .catch(err => console.error("Erreur de récupération du changelog", err));
    }
  }, [needRefresh, updateServiceWorker]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdateClick = () => {
    if (updateFinished) {
      updateServiceWorker(true);
      return;
    }
    
    setIsUpdating(true);
    let currentProgress = 0;
    
    // Simulate download progress
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5; // increment by 5-20%
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        setUpdateFinished(true);
      } else {
        setProgress(currentProgress);
      }
    }, 250);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="reload-prompt-container glass-panel">
      <div className="reload-prompt-message">
        <span className="reload-prompt-title">
          {offlineReady
            ? 'Prêt pour le mode hors-ligne'
            : 'Nouvelle mise à jour disponible'}
        </span>
        <span className="reload-prompt-desc">
          {offlineReady
            ? "L'application peut maintenant être utilisée sans internet."
            : updateMessage}
        </span>
      </div>
      
      <div className="reload-prompt-actions">
        {needRefresh && (
          <button 
            className={`reload-prompt-btn reload-prompt-update ${isUpdating && !updateFinished ? 'updating' : ''}`} 
            onClick={(!isUpdating || updateFinished) ? handleUpdateClick : undefined}
          >
            {!isUpdating ? (
              "Faire"
            ) : updateFinished ? (
              "Ok"
            ) : (
              <>
                <div className="progress-bg">
                  <span className="progress-text-black">{`${progress}%`}</span>
                </div>
                <div className="progress-fill" style={{ width: `${progress}%` }}>
                  <div className="progress-fill-inner">
                    <span className="progress-text-white">{`${progress}%`}</span>
                  </div>
                </div>
              </>
            )}
          </button>
        )}
        {!isUpdating && (
          <button className="reload-prompt-btn reload-prompt-close" onClick={() => close()}>
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}
