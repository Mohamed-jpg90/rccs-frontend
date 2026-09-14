import React from 'react'
import { FiSearch } from 'react-icons/fi'

const STATUS_OPTIONS = ['All', 'Upcoming', 'Ongoing', 'Finished', 'Cancelled']
/**
 * EventsFilterBar — search input + status filter chips.
 * Controlled component: parent owns `search` and `status` state.
 */
export default function EventsFilterBar({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events..."
          className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-card)] py-2.5 pl-9 pr-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatusChange(s)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              status === s
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}