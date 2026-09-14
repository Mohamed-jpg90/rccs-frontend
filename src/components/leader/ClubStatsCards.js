import React from 'react'
import { MdOutlinePeople, MdPieChart } from 'react-icons/md'

export default function ClubStatsCards({ stats }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          <MdOutlinePeople className="text-xl" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Members</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            {stats.membersCount ?? 0}
            {stats.maxMembers ? <span className="text-sm text-muted-foreground"> / {stats.maxMembers}</span> : null}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          <MdPieChart className="text-xl" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fill Rate</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{stats.fillRate ?? 0}%</p>
        </div>
      </div>
    </div>
  )
}