'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/Format'

const STATUS_STYLES = {
  Upcoming: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  Ongoing: 'bg-[var(--success)]/10 text-[var(--success)]',
  Finished: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
  Cancelled: 'bg-[var(--danger)]/10 text-[var(--danger)]',
}

/**
 * ClubEventsTable — lists events run by this club. Clicking a row
 * navigates to /events/[id] (the event analytics page).
 */
export default function ClubEventsTable({ events = [] }) {
  const router = useRouter()

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Events</h3>
        <span className="text-sm text-muted-foreground">
          {events.length} event{events.length === 1 ? '' : 's'}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No events yet</p>
          <p>Events created by this club will show up here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Location</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event._id}
                  onClick={() => router.push(`/events/${event._id}`)}
                  className="cursor-pointer border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{event.title}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatDate(event.date)}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{event.location ?? '—'}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLES[event.status] ?? 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}