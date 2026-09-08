import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import './InstallPopup.css';

export function InstallPopup({ show, isIOS, onInstall, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Delay showing the popup slightly to let the splash screen finish smoothly
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 500); // wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  return (
    <div className={`install-popup-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="install-popup-card glass-panel">
        <button className="install-popup-close" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>
        
        <div className="install-popup-icon-container">
          <Download size={28} className="install-popup-icon" />
        </div>
        
        <h3>Installer l'application</h3>
        
        {isIOS ? (
          <p>
            Pour installer l'application, appuyez sur <Share size={16} style={{display: 'inline-flex', verticalAlign: 'middle', margin: '0 4px'}}/> en bas de l'écran, puis sélectionnez <strong>Sur l'écran d'accueil</strong>.
          </p>
        ) : (
          <p>Installez Prompter pour y accéder d'un simple clic et l'utiliser hors ligne.</p>
        )}

        {!isIOS && (
          <button className="install-popup-btn" onClick={onInstall}>
            Installer maintenant
          </button>
        )}
      </div>
    </div>
  );
}
