'use client'

import React from 'react'
import { MdOutlinePeople, MdChevronRight } from 'react-icons/md'

export default function LedClubCard({ club, baseUrl = '', onClick }) {
  const { clubName, description, coverImage, maxMembers, currentMembersCount } = club
  const imageSrc = coverImage ? `${baseUrl}${coverImage}` : null

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left shadow-sm transition-colors hover:bg-[var(--bg-hover)]"
    >
      {imageSrc ? (
        <img src={imageSrc} alt={clubName} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
          <MdOutlinePeople className="text-xl" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold text-[var(--text-primary)]">{clubName}</span>
        {description && <span className="truncate text-sm text-muted-foreground">{description}</span>}
        <span className="mt-1 text-xs text-[var(--text-muted)]">
          {currentMembersCount}/{maxMembers} members
        </span>
      </div>
      <MdChevronRight className="shrink-0 text-xl text-[var(--text-muted)]" />
    </button>
  )
}