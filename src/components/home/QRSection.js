import Link from "next/link";
import { FaQrcode } from "react-icons/fa";

export default function QRSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
      <div className="relative rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden p-10 md:p-16 text-center">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--Background-Circle-color-3)", opacity: "var(--Background-Circle-opacity-3)" }}
        />

        <div className="relative flex flex-col items-center">
          <div className="relative mb-6">
            <span className="absolute inset-0 rounded-full bg-[var(--primary)]/20 animate-ping" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] shadow-[var(--shadow-primary-value)]">
              <FaQrcode className="text-[var(--text-white)] text-3xl" />
            </span>
          </div>

          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
            At Every Event
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
            Check in with a tap
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
            Every RCS event has a unique QR code at the door. Scan it and
            you're checked in — no lines, no paperwork, straight to your
            profile.
          </p>

          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] px-7 py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
          >
            Open Scanner
          </Link>
          <span className="text-xs text-[var(--text-muted)] mt-4">
            Look for the QR code posted at the entrance of your event.
          </span>
        </div>
      </div>
    </section>
  );
}