import React from 'react'
import { MdGroups } from 'react-icons/md'

/**
 * AuthLayout — split-screen shell for login/register. Left panel reuses
 * the primary gradient from SummaryCard/ClubHero; right panel holds the form.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-main)]">
      {/* Brand panel */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-10 text-white lg:flex"
        style={{
          background:
            'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary-hover) 85%, black) 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <MdGroups className="text-2xl" />
          </div>
          <span className="text-lg font-bold">RCCS Dashboard</span>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold leading-tight">
            Manage clubs, events, and badges — all in one place.
          </h2>
          <p className="text-sm text-white/70">
            Sign in to review members, run events, and keep your community organized.
          </p>
        </div>

        <p className="text-xs text-white/50">© {new Date().getFullYear()} RCCS. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}