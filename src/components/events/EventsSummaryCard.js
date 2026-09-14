import React from 'react'
import { MdEvent, MdAdd } from 'react-icons/md'

/**
 * EventsSummaryCard — shows the total event count with an "Add Event"
 * action. Matches the gradient style used on the other stat cards.
 */
export default function EventsSummaryCard({ title, total = 0, onAddClick , buttomtitle }) {
  return (
    <div
      className="flex flex-col items-start justify-between gap-4 rounded-3xl px-6 py-6 text-white shadow-[var(--shadow-primary-value)] sm:flex-row sm:items-center"
      style={{
        background:
          'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary-hover) 85%, black) 100%)',
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <MdEvent className="text-2xl" />
        </div>
        <div>
          <p className="text-sm text-white/70">{title}</p>
          <h2 className="text-3xl font-bold leading-tight">{total}</h2>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--primary)] transition-transform duration-200 hover:scale-105"
      >
        <MdAdd className="text-lg" />
        {buttomtitle}
      </button>
    </div>
  )
}