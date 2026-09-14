'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/Format'
import { isTeamLeader } from '@/lib/auth'

const STATUS_STYLES = {
  Approved: 'bg-[var(--success)]/10 text-[var(--success)]',
  Pending: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  Rejected: 'bg-[var(--danger)]/10 text-[var(--danger)]',
}

export default function EventRegistrationsList({ registrations = [] }) {
  const router = useRouter()

  const handleEventClick = (eventId) => {
    if (!eventId) return

    if (isTeamLeader()) {
      router.push(`/team-leader/dashboard/events/${eventId}`)
    } else {
      router.push(`/dashboard/events/${eventId}`)
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Event Registrations
        </h3>

        <span className="text-sm text-muted-foreground">
          {registrations.length} record
          {registrations.length === 1 ? '' : 's'}
        </span>
      </div>

      {registrations.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No event registrations yet.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--border)]">
          {registrations.map((reg) => {
            const isPopulated =
              reg.event && typeof reg.event === 'object'

            const eventId = isPopulated ? reg.event._id : reg.event
            const title = isPopulated
              ? reg.event.title
              : `Event ${eventId ?? ''}`

            const date = isPopulated ? reg.event.date : null

            return (
              <li key={reg._id}>
                <button
                  type="button"
                  onClick={() => handleEventClick(eventId)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-[var(--bg-hover)]"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {title}
                    </span>

                    {date && (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(date)}
                      </span>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[reg.status] ??
                      'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {reg.status}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

