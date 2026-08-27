'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [showJumpscare, setShowJumpscare] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  async function triggerJumpscare() {
    setShowJumpscare(true);

    try {
      await document.documentElement.requestFullscreen();
    } catch {
      
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    window.setTimeout(() => window.location.reload(), 500);
  }

  return (
    <main>
      <h1>Hello, Cocainee.pro uses cookies please accept them to continue</h1>
      <nav>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
      </nav>
      <div>
        <button type="button" onClick={triggerJumpscare}>Accept</button>
        <button type="button" onClick={triggerJumpscare}>Decline</button>
      </div>

      <div className={showJumpscare ? 'jumpscare visible' : 'jumpscare'} role="dialog" aria-label="Jumpscare" aria-hidden={!showJumpscare}>
        <img src="/jumpscare.jpg" alt="" />
        <audio ref={audioRef} src="/jumpscare.mp3" preload="auto" />
      </div>
    </main>
  );
}
