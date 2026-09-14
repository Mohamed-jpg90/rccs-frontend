'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/Format'

const EVENT_STATUS_STYLES = {
  Upcoming: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  Ongoing: 'bg-[var(--success)]/10 text-[var(--success)]',
  Finished: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
  Cancelled: 'bg-[var(--danger)]/10 text-[var(--danger)]',
}

const CONTENT_TYPE_STYLES = {
  Video: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  Article: 'bg-[var(--success)]/10 text-[var(--success)]',
  Image: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
  Document: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
}

/**
 * ClubItemsTable — generic row table for a club's linked items.
 * type="events"  -> columns: Title | Date | Location | Status, rows go to /events/[id]
 * type="content" -> columns: Title | Type | Description,       rows go to /content/[id]
 */
export default function ClubItemsTable({ items = [], type = 'events', title }) {
  const router = useRouter()
  const isEvents = type === 'events'
  const heading = title ?? (isEvents ? 'Events' : 'Content')
  const noun = isEvents ? 'event' : 'item'

  const goTo = (item) => router.push(isEvents ? `/events/${item._id}` : `/content/${item._id}`)

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{heading}</h3>
        <span className="text-sm text-muted-foreground">
          {items.length} {noun}{items.length === 1 ? '' : 's'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No {heading.toLowerCase()} yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Title</th>
                {isEvents ? (
                  <>
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Location</th>
                    <th className="py-2 font-medium">Status</th>
                  </>
                ) : (
                  <>
                    <th className="py-2 pr-4 font-medium">Type</th>
                    <th className="py-2 font-medium">Description</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => goTo(item)}
                  className="cursor-pointer border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{item.title}</td>
                  {isEvents ? (
                    <>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatDate(item.date)}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{item.location ?? '—'}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            EVENT_STATUS_STYLES[item.status] ?? 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            CONTENT_TYPE_STYLES[item.type] ?? 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
<td className="py-3 text-[var(--text-secondary)]">
  <div className="max-w-xs truncate">
    {item.description ?? '—'}
  </div>
</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}