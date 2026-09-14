"use client";

import { useState, useEffect } from "react";
import { MdGroups } from "react-icons/md";
import { FaStar } from "react-icons/fa";

const HIGHLIGHTS = [
  "Manage clubs, events, and badges — all in one place.",
  "Check in with a QR scan, no lines at the door.",
  "Track your points, badges, and certificates in one profile.",
];

export default function AuthLayout({ title, subtitle, children }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % HIGHLIGHTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-main)]">
      {/* Brand panel */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-10 text-white lg:flex"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary-hover) 85%, black) 100%)",
        }}
      >
        {/* Ambient circles — same signature used across the site */}
        <div
          className="absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--Background-Circle-color-2)", opacity: 0.25 }}
        />
        <div
          className="absolute bottom-0 -left-16 h-64 w-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--Background-Circle-color-3)", opacity: 0.2 }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <MdGroups className="text-2xl" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            RCCS Dashboard
          </span>
        </div>

        <div className="relative flex flex-col gap-4">
          <div className="flex gap-1.5">
            {HIGHLIGHTS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-white" : "w-4 bg-white/30"
                }`}
              />
            ))}
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight min-h-[88px]">
            {HIGHLIGHTS[active]}
          </h2>
          <p className="text-sm text-white/70 max-w-xs">
            Sign in to review members, run events, and keep your community
            organized.
          </p>
        </div>

        <div className="relative flex items-center gap-1.5 text-xs text-white/50">
          <FaStar className="text-[10px]" />
          © {new Date().getFullYear()} RCCS. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div
          className="absolute top-10 right-10 h-56 w-56 rounded-full blur-3xl pointer-events-none lg:hidden"
          style={{ background: "var(--Background-Circle-color-1)", opacity: "var(--Background-Circle-opacity-1)" }}
        />
        <div className="relative flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}