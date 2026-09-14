"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaQrcode, FaCheckCircle, FaTimesCircle, FaRedo } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { extractEventIdFromToken } from "@/lib/qr";

// html5-qrcode touches `navigator` at import time — must be client-only, no SSR
const QrScanner = dynamic(() => import("@/components/Scan/QrScanner"), { ssr: false });

// STATES: idle -> scanning -> checking -> success | failed
export default function ScanPage() {
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null); // { title } on success
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleDecode = useCallback(
    async (token) => {
      setState("checking");

      const eventId = extractEventIdFromToken(token);
      if (!eventId) {
        setErrorMsg("This QR code isn't a valid RCS event code.");
        setState("failed");
        return;
      }

      try {
        const res = await apiClient.post(`/events/${eventId}/checkin`, { token });
        setResult({ title: res.data?.event?.title || "the event" });
        setState("success");
        toast.success("You're checked in!");
      } catch (error) {
        setErrorMsg(
          error.response?.data?.message ||
            "This code is invalid or has expired — ask the front desk for a fresh one."
        );
        setState("failed");
      }
    },
    []
  );

  const startScanning = () => {
    if (!isAuthenticated()) {
      router.push("/login?redirect=/scan");
      return;
    }
    setErrorMsg("");
    setResult(null);
    setState("scanning");
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-md">
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--Background-Circle-color-3)", opacity: "var(--Background-Circle-opacity-3)" }}
        />

        <div className="relative rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-8 text-center shadow-[var(--shadow-lg-value)]">
          {/* IDLE */}
          {state === "idle" && (
            <>
              <div className="relative mx-auto mb-6 w-fit">
                <span className="absolute inset-0 rounded-full bg-[var(--primary)]/20 animate-ping" />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] shadow-[var(--shadow-primary-value)]">
                  <FaQrcode className="text-[var(--text-white)] text-3xl" />
                </span>
              </div>
              <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-3">
                Scan to check in
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
                Point your camera at the QR code posted at the event entrance.
              </p>
              <button
                onClick={startScanning}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
              >
                Open Camera
              </button>
            </>
          )}

          {/* SCANNING */}
          {state === "scanning" && (
            <>
              <h1 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">
                Point at the code
              </h1>
              <p className="text-xs text-[var(--text-muted)] mb-5">
                Hold steady — it scans automatically.
              </p>
              <QrScanner active={state === "scanning"} onDecode={handleDecode} />
              <button
                onClick={() => setState("idle")}
                className="mt-5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {/* CHECKING */}
          {state === "checking" && (
            <div className="py-10">
              <div className="h-10 w-10 mx-auto mb-5 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
              <p className="text-sm text-[var(--text-secondary)]">Confirming your check-in...</p>
            </div>
          )}

          {/* SUCCESS */}
          {state === "success" && (
            <>
              <FaCheckCircle className="text-5xl text-[var(--success)] mx-auto mb-5" />
              <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                You're checked in!
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8">
                Attendance recorded for <strong>{result?.title}</strong>.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/profile"
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all"
                >
                  View My Attendance
                </Link>
                <button
                  onClick={startScanning}
                  className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  Scan another code
                </button>
              </div>
            </>
          )}

          {/* FAILED */}
          {state === "failed" && (
            <>
              <FaTimesCircle className="text-5xl text-[var(--danger)] mx-auto mb-5" />
              <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Check-in failed
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8">{errorMsg}</p>
              <button
                onClick={startScanning}
                className="w-full inline-flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all"
              >
                <FaRedo className="text-sm" />
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}