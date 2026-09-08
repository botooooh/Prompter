import React from 'react';
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

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
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
            : "Faites la mise à jour pour bénéficier des nouvelles fonctionnalités."}
        </span>
      </div>
      
      <div className="reload-prompt-actions">
        {needRefresh && (
          <button className="reload-prompt-btn reload-prompt-update" onClick={() => updateServiceWorker(true)}>
            Faire
          </button>
        )}
        <button className="reload-prompt-btn reload-prompt-close" onClick={() => close()}>
          Fermer
        </button>
      </div>
    </div>
  );
}
