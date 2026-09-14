'use client'

import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { MdCheckCircle, MdCancel } from 'react-icons/md'
import Drawer from '@/components/shared/Drawer'
import { apiClient } from '@/lib/api'
import { formatDateTime } from '@/lib/Format'

const STATUS_STYLES = {
  Registered: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  Pending: 'bg-yellow-500/10 text-yellow-600',
  Approved: 'bg-[var(--success)]/10 text-[var(--success)]',
  Rejected: 'bg-[var(--danger)]/10 text-[var(--danger)]',
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  )
}

/**
 * RegistrationDetailsDrawer — shows a single registration's details
 * with Approve / Reject actions.
 *
 * Props:
 * - eventId, registration: identify which registration to act on
 * - isOpen, onClose: drawer visibility
 * - onUpdated: called after a successful approve/reject so the parent
 *   can refetch the registrations list (the action response only
 *   returns a raw reviewedBy ID, not a populated name, so we don't
 *   try to merge it locally — a refetch keeps the list accurate)
 */
export default function RegistrationDetailsDrawer({ eventId, registration, isOpen, onClose, onUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState(null)

  if (!registration) return null

  // "Pending" = awaiting Admin/Team Leader review (needs action here).
  // "Registered" = auto-confirmed, no approval required — nothing to do.
  const isPending = registration.status === 'Pending'

  const handleAction = async (action) => {
    setIsSubmitting(true)
    setActionError(null)
    try {
      // ⚠️ was apiClient.post — every other review action in this app
      // (removal-requests/:id/approve|reject) is PUT, which matches this
      // route too. POST returned 404 because no POST route exists here.
      await apiClient.put(`/events/${eventId}/registrations/${registration._id}/${action}`)
      onUpdated?.()
      onClose()
    } catch (err) {
      console.error(err)
      setActionError(`Could not ${action} this registration. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Registration Details">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-4xl text-[var(--text-muted)]" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[var(--text-primary)]">
              {registration.user?.fullName ?? 'Unknown user'}
            </p>
            <p className="truncate text-sm text-muted-foreground">{registration.user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] p-4 text-sm">
          <Row label="Phone" value={registration.user?.phoneNumber ?? '—'} />
          <Row
            label="Status"
            value={
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  STATUS_STYLES[registration.status] ?? 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                }`}
              >
                {registration.status}
              </span>
            }
          />
          <Row label="Registered At" value={formatDateTime(registration.createdAt)} />
          <Row label="Reviewed By" value={registration.reviewedBy?.fullName ?? '—'} />
          <Row
            label="Reviewed At"
            value={registration.reviewedAt ? formatDateTime(registration.reviewedAt) : '—'}
          />
        </div>

        {actionError && <p className="text-sm text-[var(--danger)]">{actionError}</p>}

        {isPending ? (
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('approve')}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--success)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <MdCheckCircle className="text-base" /> Approve
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('reject')}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--danger)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <MdCancel className="text-base" /> Reject
            </button>
          </div>
        ) : (
          <p className="rounded-xl bg-[var(--bg-hover)] px-4 py-3 text-center text-sm text-muted-foreground">
            This registration has already been {registration.status.toLowerCase()}.
          </p>
        )}
      </div>
    </Drawer>
  )
}