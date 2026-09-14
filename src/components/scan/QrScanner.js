"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const SCANNER_ID = "qr-reader-region";

export default function QrScanner({ onDecode, active }) {
  const hasDecodedRef = useRef(false);
  // Tracks whether start() has actually resolved (camera is live), so we
  // never call stop() on a scanner that hasn't finished starting yet —
  // that race is what throws "Cannot stop, scanner is not running or paused".
  
  const isRunningRef = useRef(false);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    if (!active) return;

    const scanner = new Html5Qrcode(SCANNER_ID);
    hasDecodedRef.current = false;
    isRunningRef.current = false;
    let cancelled = false;

    const stopSafely = () => {
      if (!isRunningRef.current) return Promise.resolve();
      isRunningRef.current = false;
      return scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {});
    };

    const onSuccess = (decodedText) => {
      if (hasDecodedRef.current || cancelled) return;
      hasDecodedRef.current = true;
      stopSafely().finally(() => onDecode(decodedText));
    };

    const run = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (cancelled) return;

        if (!devices || devices.length === 0) {
          throw new Error("NoCameraFound");
        }

        const preferred =
          devices.find((d) => /back|rear|environment/i.test(d.label)) ||
          devices[0];

        await scanner.start(
          preferred.id,
          { fps: 10, qrbox: { width: 240, height: 240 } },
          onSuccess,
          () => {} // fired continuously while no QR in frame — not a real error
        );

        if (cancelled) {
          // Unmounted while start() was still resolving — camera is live now,
          // so it's safe (and necessary) to stop it immediately.
          isRunningRef.current = true;
          await stopSafely();
          return;
        }

        isRunningRef.current = true;
        setStarting(false);
      } catch (err) {
        if (cancelled) return;
        setStarting(false);

        if (err?.name === "NotAllowedError") {
          setError("Camera access was denied. Allow camera permission in your browser and try again.");
        } else if (err?.message === "NoCameraFound" || err?.name === "NotFoundError") {
          setError("No camera was found on this device.");
        } else if (err?.name === "NotReadableError") {
          setError("Your camera is already in use by another app. Close it and try again.");
        } else {
          setError("Could not start the camera. Check your browser's camera permissions.");
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      if (!hasDecodedRef.current) {
        stopSafely();
      }
    };
  }, [active, onDecode]);

  return (
    <div className="relative">
      <div
        id={SCANNER_ID}
        className="rounded-[var(--radius-xl-value)] overflow-hidden bg-black min-h-[300px] [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
      />

      {starting && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[var(--radius-xl-value)]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-[var(--radius-xl-value)] p-6 text-center">
          <p className="text-sm text-white">{error}</p>
        </div>
      )}

      {!starting && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-52 w-52 rounded-2xl border-2 border-[var(--primary)] shadow-[0_0_0_2000px_rgba(0,0,0,0.35)]" />
        </div>
      )}
    </div>
  );
}