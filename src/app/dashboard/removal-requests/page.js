'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { MdCheck, MdClose, MdRefresh } from 'react-icons/md'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api'
import { formatDateTime } from '@/lib/Format'
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog'

// ⚠️ unconfirmed base path — router.js only shows relative routes
// ("/", "/:id/approve", "/:id/reject") mounted somewhere as
// app.use("/removal-requests", router). Adjust BASE if it's mounted
// differently (e.g. "/admin/removal-requests").
const BASE = '/removal-requests'

const STATUS_TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: '', label: 'All' },
]

/**
 * RemovalRequestsTable — admin view of team-leader-submitted removal
 * requests (POST /users/:id/removal-request creates them, this reads
 * and reviews them via /removal-requests).
 *
 * ⚠️ unconfirmed shape — getRequests() only returns `{ total, requests }`
 * with no documented item shape. This assumes each request looks like:
 *   { _id, reason, status, createdAt, requestedBy: {fullName,email}|id, targetUser: {fullName,email}|id }
 * requestedBy = the team leader who filed it, targetUser = the member
 * up for removal. Field names (esp. requestedBy/targetUser) need
 * verifying against the actual Mongoose schema — swap them below if
 * they're named differently (e.g. `user`, `requester`, `member`).
 */
export default function RemovalRequestsTable() {
  const [status, setStatus] = useState('pending')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState(null) // request currently being approved/rejected
  const [rejectTarget, setRejectTarget] = useState(null) // request pending reject confirmation
  const [approveTarget, setApproveTarget] = useState(null) // request pending "system" scope confirmation
  const [resolvedUsers, setResolvedUsers] = useState({}) // id -> user, for raw-ID fields

  const fetchRequests = useCallback(() => {
    setLoading(true)
    apiClient
      .get(BASE, { params: status ? { status } : undefined })
      .then((res) => setRequests(res.data?.requests ?? []))
      .catch((err) => {
        console.error('Error fetching removal requests:', err)
        toast.error('Could not load removal requests')
      })
      .finally(() => setLoading(false))
  }, [status])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Some fields (esp. reviewedBy, sometimes targetUser/requestedBy) come
  // back as raw ID strings instead of populated objects. Fetch those so
  // we can still show a name instead of "Unknown user" or a raw ID.
  useEffect(() => {
    const ids = new Set()
    requests.forEach((r) => {
      ;[r.targetUser, r.requestedBy, r.reviewedBy].forEach((field) => {
        if (typeof field === 'string' && field && !resolvedUsers[field]) {
          ids.add(field)
        }
      })
    })
    if (ids.size === 0) return

    ids.forEach((id) => {
      apiClient
        .get(`/users/${id}`)
        .then((res) => {
          setResolvedUsers((prev) => ({ ...prev, [id]: res.data?.user ?? res.data ?? null }))
        })
        .catch((err) => {
          console.error(`Failed to fetch user ${id}`, err)
          setResolvedUsers((prev) => ({ ...prev, [id]: null }))
        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests])

  const getUserLabel = (user) => {
    if (!user) return 'Unknown user'
    if (typeof user === 'string') {
      const resolved = resolvedUsers[user]
      if (resolved === undefined) return 'Loading...'
      if (resolved === null) return 'Unknown user'
      return resolved.fullName || resolved.email || 'Unknown user'
    }
    return user.fullName || user.email || 'Unknown user'
  }

  // Backend returns status capitalized ("Pending", "Approved", "Rejected") —
  // normalize before comparing so tab/button logic doesn't silently fail.
  const normalizeStatus = (value) => (value || '').toLowerCase()

  const STATUS_STYLES = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    approved: 'bg-[var(--success,#16a34a)]/10 text-[var(--success,#16a34a)]',
    rejected: 'bg-[var(--danger)]/10 text-[var(--danger)]',
  }

  const StatusBadge = ({ value }) => (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        STATUS_STYLES[normalizeStatus(value)] || 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
      }`}
    >
      {value || 'unknown'}
    </span>
  )

  const handleApprove = async (request) => {
    setActingId(request._id)
    try {
      await apiClient.put(`${BASE}/${request._id}/approve`)
      toast.success('Request approved')
      fetchRequests()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not approve request')
    } finally {
      setActingId(null)
    }
  }

  // "system" scope deletes the account permanently — confirm before firing.
  // "club" scope just detaches them from the club, so it goes straight through.
  const onApproveClick = (request) => {
    if (request.scope === 'system') {
      setApproveTarget(request)
    } else {
      handleApprove(request)
    }
  }

  const confirmSystemApprove = async () => {
    if (!approveTarget) return
    await handleApprove(approveTarget)
    setApproveTarget(null)
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    setActingId(rejectTarget._id)
    try {
      await apiClient.put(`${BASE}/${rejectTarget._id}/reject`)
      toast.success('Request rejected')
      setRejectTarget(null)
      fetchRequests()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reject request')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Removal Requests</h3>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-[var(--border)] p-0.5">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key || 'all'}
                type="button"
                onClick={() => setStatus(tab.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  status === tab.key
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={fetchRequests}
            aria-label="Refresh"
            className="rounded-full p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            <MdRefresh className="text-lg" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No requests here</p>
          <p>There are no {status || ''} removal requests right now.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Member</th>
                <th className="py-2 pr-4 font-medium">Requested By</th>
                <th className="py-2 pr-4 font-medium">Reason</th>
                <th className="py-2 pr-4 font-medium">Scope</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                {(status === 'pending' || status === '') && <th className="py-2 font-medium" />}
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                    {getUserLabel(request.targetUser)}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">
                    {getUserLabel(request.requestedBy)}
                  </td>
                  <td className="py-3 pr-4 max-w-xs truncate text-[var(--text-secondary)]" title={request.reason}>
                    {request.reason}
                  </td>
                  <td className="py-3 pr-4">
                    {/* ⚠️ requires backend "scope" field on RemovalRequest — see
                        removal_request_service.js. Falls back to "club" (the
                        safer default) if the field isn't present yet. */}
                    {request.scope === 'system' ? (
                      <span className="inline-block rounded-full bg-[var(--danger)]/10 px-2.5 py-1 text-xs font-medium text-[var(--danger)]">
                        Full account
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-[var(--bg-hover)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                        Club only
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">
                    {request.createdAt ? formatDateTime(request.createdAt) : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge value={request.status} />
                      {/* ⚠️ unconfirmed field — reviewRequest(id, req.user._id, action) suggests
                          the request stores who reviewed it (e.g. `reviewedBy`), but the
                          field name/populate shape isn't documented. Adjust if different. */}
                      {normalizeStatus(request.status) !== 'pending' && request.reviewedBy && (
                        <span className="text-xs text-muted-foreground">
                          by {getUserLabel(request.reviewedBy)}
                        </span>
                      )}
                    </div>
                  </td>
                  {(status === 'pending' || status === '') && (
                    <td className="py-3 text-right">
                      {normalizeStatus(request.status) === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onApproveClick(request)}
                            disabled={actingId === request._id}
                            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--success,#16a34a)] transition-colors hover:bg-[var(--success,#16a34a)]/10 disabled:opacity-50"
                          >
                            <MdCheck className="text-sm" />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectTarget(request)}
                            disabled={actingId === request._id}
                            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10 disabled:opacity-50"
                          >
                            <MdClose className="text-sm" />
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={!!rejectTarget}
        title="Reject this request?"
        itemName={rejectTarget ? getUserLabel(rejectTarget.targetUser) : undefined}
        description="The member will stay in the club and the request will be marked as rejected."
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />

      <ConfirmDeleteDialog
        isOpen={!!approveTarget}
        title="Delete this account permanently?"
        itemName={approveTarget ? getUserLabel(approveTarget.targetUser) : undefined}
        description="This request asks for full account removal, not just a club removal. This cannot be undone."
        onClose={() => setApproveTarget(null)}
        onConfirm={confirmSystemApprove}
      />
    </div>
  )
}