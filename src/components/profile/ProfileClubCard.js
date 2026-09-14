'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MdGroups, MdChevronRight } from 'react-icons/md'
import { isTeamLeader } from '@/lib/auth'

export default function ProfileClubCard({ club }) {
  const router = useRouter()


    const handleEventClick = (ClubId) => {
      if (!ClubId) return
  
      if (isTeamLeader()) {
        router.push(`/team-leader/dashboard/clubs/${ClubId}`)
      } else {
        router.push(`/dashboard/clubs/${ClubId}`)
      }
    }

  if (!club) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 text-sm text-muted-foreground shadow-sm">
        <MdGroups className="text-xl text-[var(--text-muted)]" />
        Not a member of any club yet.
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => handleEventClick(club._id)}
      className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 text-left shadow-sm transition-colors hover:bg-[var(--bg-hover)]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
        <MdGroups className="text-xl" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">Club</span>
        <span className="truncate font-medium text-[var(--text-primary)]">{club.clubName}</span>
      </div>
      <MdChevronRight className="shrink-0 text-xl text-[var(--text-muted)]" />
    </button>
  )
}