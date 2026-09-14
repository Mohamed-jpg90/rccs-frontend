import React from 'react'
import { formatDateTime } from '@/lib/Format'

const STATUS_STYLES = {
  Registered: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  Pending: 'bg-yellow-500/10 text-yellow-600',
  Approved: 'bg-[var(--success)]/10 text-[var(--success)]',
  Rejected: 'bg-[var(--danger)]/10 text-[var(--danger)]',
}

/**
 * RegistrationsTable — list of everyone who registered for the event,
 * separate from AttendanceTable since registrations use a different
 * shape (status/reviewedBy/reviewedAt) than check-in records
 * (attendanceStatus/checkedAt/checkedBy).
 *
 * Rows are clickable — pass onSelect to open a details view/drawer.
 */
export default function RegistrationsTable({ registrations = [], onSelect }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Registrations</h3>
        <span className="text-sm text-muted-foreground">
          {registrations.length} registration{registrations.length === 1 ? '' : 's'}
        </span>
      </div>

      {registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No registrations yet</p>
          <p>Registrations will appear here as people sign up.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Contact</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Registered At</th>
                <th className="py-2 font-medium">Reviewed By</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr
                  key={reg._id}
                  onClick={() => onSelect?.(reg)}
                  className={`border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] ${
                    onSelect ? 'cursor-pointer' : ''
                  }`}
                >
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                    {reg.user?.fullName ?? 'Unknown'}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-col text-[var(--text-secondary)]">
                      <span>{reg.user?.email}</span>
                      {reg.user?.phoneNumber && (
                        <span className="text-xs text-muted-foreground">{reg.user.phoneNumber}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLES[reg.status] ?? 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">
                    {formatDateTime(reg.createdAt)}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {reg.reviewedBy?.fullName ?? '—'}
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