import React, { useRef, useEffect, useState } from 'react';
import './Prompter.css';
import { useScroll } from '../hooks/useScroll';
import { Controls } from './Controls';
import { ArrowLeft } from 'lucide-react';

export function Prompter({ text, onBack, useCamera }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Prompter settings state
  const [fontSize, setFontSize] = useState(64); // px
  const [speed, setSpeed] = useState(100); // px per sec
  const [mirrorX, setMirrorX] = useState(false);
  const [mirrorY, setMirrorY] = useState(false);
  const [alignment, setAlignment] = useState('center');
  const [margins, setMargins] = useState(15); // %
  const [showGuide, setShowGuide] = useState(true);
  
  // UI states
  const [controlsVisible, setControlsVisible] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const { isPlaying, togglePlay, startScroll, pauseScroll, updateSpeed } = useScroll(containerRef, speed);

  // Camera and Recording Setup
  useEffect(() => {
    let stream = null;
    if (useCamera) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
          };
          
          recorder.onstop = () => {
            const mime = recorder.mimeType || 'video/webm';
            const blob = new Blob(chunksRef.current, { type: mime });
            const ext = mime.includes('mp4') ? 'mp4' : 'webm';
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Prompteur_Video_${Date.now()}.${ext}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            chunksRef.current = [];
            setIsRecording(false);
          };
          
          mediaRecorderRef.current = recorder;
        })
        .catch(err => {
          console.error("Camera error:", err);
          alert("Impossible d'accéder à la caméra ou au micro.");
        });
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useCamera]);

  // Start recording when play starts
  useEffect(() => {
    if (useCamera && isPlaying && !hasStartedRecording && mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start();
      setHasStartedRecording(true);
      setIsRecording(true);
    }
  }, [isPlaying, useCamera, hasStartedRecording]);

  const handleBack = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    onBack();
  };

  // Sync speed changes
  useEffect(() => {
    updateSpeed(speed);
  }, [speed, updateSpeed]);

  // Hide controls when playing
  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setControlsVisible(false), 2000);
    } else {
      setControlsVisible(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  // Mouse movement shows controls
  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true);
      if (isPlaying) {
        // Hide again after 3s of inactivity
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'ArrowUp') {
        setSpeed(s => Math.max(10, s - 10));
      }
      if (e.code === 'ArrowDown') {
        setSpeed(s => Math.min(500, s + 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  const handleStartWithCountdown = () => {
    if (isPlaying) {
      pauseScroll();
      return;
    }
    
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          startScroll();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const transformStyle = `
    ${mirrorX ? 'scaleX(-1)' : ''}
    ${mirrorY ? 'scaleY(-1)' : ''}
  `;

  return (
    <div className="prompter-wrapper">
      {countdown > 0 && (
        <div className="countdown-overlay">
          <span>{countdown}</span>
        </div>
      )}

      {showGuide && <div className="read-guide" />}

      <button className={`back-btn-floating ${controlsVisible ? 'visible' : 'hidden'}`} onClick={handleBack}>
        <ArrowLeft size={20} />
        Retour
      </button>

      {useCamera && (
        <video 
          ref={videoRef} 
          className="prompter-camera-bg" 
          autoPlay 
          muted 
          playsInline 
        />
      )}
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div> REC
        </div>
      )}

      <div 
        ref={containerRef}
        className={`prompter-container ${useCamera ? 'camera-active' : ''}`}
        style={{ padding: `50vh ${margins}vw` }}
      >
        <div 
          className="prompter-text"
          style={{ 
            fontSize: `${fontSize}px`, 
            textAlign: alignment,
            transform: transformStyle
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>

      <div className={`controls-wrapper ${controlsVisible ? 'visible' : 'hidden'}`}>
        <Controls 
          onBack={handleBack}
          isPlaying={isPlaying}
          onPlayPause={handleStartWithCountdown}
          fontSize={fontSize}
          setFontSize={setFontSize}
          speed={speed}
          setSpeed={setSpeed}
          mirrorX={mirrorX}
          setMirrorX={setMirrorX}
          mirrorY={mirrorY}
          setMirrorY={setMirrorY}
          alignment={alignment}
          setAlignment={setAlignment}
          margins={margins}
          setMargins={setMargins}
          showGuide={showGuide}
          setShowGuide={setShowGuide}
        />
      </div>
    </div>
  );
}
