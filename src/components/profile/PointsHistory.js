import React from 'react'
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md'
import { formatDateTime } from '@/lib/Format'

export default function PointsHistory({ points = [] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Points History</h3>
        <span className="text-sm text-muted-foreground">
          {points.length} record{points.length === 1 ? '' : 's'}
        </span>
      </div>

      {points.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No points activity yet</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--border)]">
          {points.map((entry) => {
            const isEarn = entry.type === 'Earn'
            return (
              <li key={entry._id} className="flex items-center gap-3 py-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isEarn ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'
                  }`}
                >
                  {isEarn ? <MdArrowUpward className="text-base" /> : <MdArrowDownward className="text-base" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm text-[var(--text-primary)]">
                    {entry.reason ?? (isEarn ? 'Points earned' : 'Points redeemed')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {entry.createdAt ? formatDateTime(entry.createdAt) : ''}
                  </span>
                </div>
                <span className={`shrink-0 text-sm font-semibold ${isEarn ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {isEarn ? '+' : '-'}
                  {Math.abs(entry.amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}