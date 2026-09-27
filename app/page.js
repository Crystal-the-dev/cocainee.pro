'use client';

import { useEffect, useRef, useState } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';

const gifBase64 = 'data:image/gif;base64,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

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

    let stopped = false;

    const playGifInConsole = async () => {
      try {
        const response = await fetch(gifBase64);
        const buffer = await response.arrayBuffer();

        const gif = parseGIF(buffer);
        const frames = decompressFrames(gif, true);

        if (!frames.length) return;

        const width = gif.lsd.width;
        const height = gif.lsd.height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, width, height);

        while (!stopped) {
          for (const frame of frames) {
            if (stopped) break;

            const imageData = new ImageData(
              new Uint8ClampedArray(frame.patch),
              frame.dims.width,
              frame.dims.height
            );

            ctx.putImageData(
              imageData,
              frame.dims.left,
              frame.dims.top
            );

            const frameImage = canvas.toDataURL('image/png');

            console.log(
              '%c ',
              `
                display: inline-block;
                width: ${CONSOLE_DISPLAY_WIDTH}px;
                height: ${CONSOLE_DISPLAY_HEIGHT}px;
                padding: 0;
                margin: 0;
                background-image: url("${frameImage}");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                font-size: 1px;
                line-height: 1px;
              `
            );

            const delay = Math.max(
              Number(frame.delay || 10) * 10,
              20
            );

            await new Promise((resolve) => {
              setTimeout(resolve, delay);
            });
          }
        }
      } catch (error) {
        console.error('GIF error:', error);
      }
    };

    playGifInConsole();

    return () => {
      stopped = true;
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
