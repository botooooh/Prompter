import { useState, useEffect, useRef, useCallback } from 'react';

export function useScroll(containerRef, initialSpeed = 50) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed); // pixels per second
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  const scrollPosRef = useRef(0);

  const startScroll = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pauseScroll = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = null;
      return;
    }

    const loop = (time) => {
      if (lastTimeRef.current != null) {
        const delta = time - lastTimeRef.current;
        if (containerRef.current) {
          // Calculate how much to scroll based on speed (px/sec) and delta (ms)
          const scrollAmount = (speed * delta) / 1000;
          
          // Ensure we don't jump too much if there's a lag spike
          if (delta < 100) {
              containerRef.current.scrollTop += scrollAmount;
          }

          // Check if we reached the bottom
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          if (scrollTop + clientHeight >= scrollHeight - 1) {
            pauseScroll();
          }
        }
      }
      lastTimeRef.current = time;
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, containerRef, pauseScroll]);

  return { isPlaying, togglePlay, startScroll, pauseScroll, speed, updateSpeed };
}
