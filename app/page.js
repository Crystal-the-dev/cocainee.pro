'use client';

import { useEffect, useRef, useState } from 'react';
import { gifSrc } from '@/lib/gif';

const CONSOLE_DISPLAY_WIDTH = 800;
const CONSOLE_DISPLAY_HEIGHT = 800;

export default function HomePage() {
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const hasUnsavedChanges = useRef(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedChanges.current) return;

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // The browser animates the GIF itself, so no frame decoding is needed here
    console.log(
      '%c ',
      `
        display: inline-block;
        width: ${CONSOLE_DISPLAY_WIDTH}px;
        height: ${CONSOLE_DISPLAY_HEIGHT}px;
        padding: 0;
        margin: 0;
        background-color: #000;
        background-image: url("${gifSrc}");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        font-size: 1px;
        line-height: 1px;
      `
    );

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  async function triggerJumpscare() {
    hasUnsavedChanges.current = true;
    setShowJumpscare(true);

    try {
      await document.documentElement.requestFullscreen();
    } catch {}

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }

  return (
    <main>
      <form
        onInput={() => {
          hasUnsavedChanges.current = true;
        }}
      >
        <h1>
          Hello, Cocainee.pro uses cookies please accept them to continue
        </h1>

        <nav>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </nav>

        <label className="form-option">
          <input
            type="checkbox"
            name="remember-choice"
          />
          Remember my choice
        </label>

        <div>
          <button
            type="button"
            onClick={triggerJumpscare}
          >
            Accept
          </button>

          <button
            type="button"
            onClick={triggerJumpscare}
          >
            Decline
          </button>
        </div>
      </form>

      <div
        className={showJumpscare ? 'jumpscare visible' : 'jumpscare'}
        role="dialog"
        aria-label="Jumpscare"
        aria-hidden={!showJumpscare}
      >
        <video
          ref={videoRef}
          src="/cdn/video.mp4"
          autoPlay
          playsInline
          preload="auto"
        />

        {showUnsavedWarning && (
          <div
            className="unsaved-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="unsaved-title"
          >
            <h2 id="unsaved-title">
              Unsaved changes
            </h2>

            <p>
              This document has changes that have not been saved.
            </p>

            <div className="dialog-actions">
              <button
                type="button"
                onClick={() => setShowUnsavedWarning(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setShowJumpscare(false);
                }}
              >
                Close without saving
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
