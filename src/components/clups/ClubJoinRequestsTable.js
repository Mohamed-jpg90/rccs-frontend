'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaTimes, FaUserClock } from 'react-icons/fa'
import { apiClient } from '@/lib/api'
import { formatDateTime } from '@/lib/Format'

const STATUS_STYLES = {
  Pending: 'bg-[var(--warning)]/10 text-[var(--warning)]',
  Approved: 'bg-[var(--success)]/10 text-[var(--success)]',
  Rejected: 'bg-[var(--danger)]/10 text-[var(--danger)]',
  Cancelled: 'bg-[var(--bg-hover)] text-[var(--text-muted)]',
}

/**
 * ClubJoinRequestsTable — self-fetches /clubs/:clubId/join-requests
 * (not part of /clubs/:clubId/overview) and lets an admin approve/reject
 * Pending ones.
 *
 * Props:
 * - clubId
 * - onChanged(): optional — called after a successful decision so the
 *   parent can refetch overview data too (member count changes on approve)
 */
export default function ClubJoinRequestsTable({ clubId, onChanged }) {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [actingId, setActingId] = useState(null)

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const res = await apiClient.get(`/clubs/${clubId}/join-requests`)
      setRequests(res.data?.requests ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!clubId) return
    fetchRequests()
  }, [clubId])

  const pendingCount = requests.filter((r) => r.status === 'Pending').length

  const handleDecision = async (requestId, action) => {
    setActingId(requestId)
    try {
      await apiClient.put(`/clubs/${clubId}/join-requests/${requestId}/${action}`)
      toast.success(action === 'approve' ? 'Request approved' : 'Request rejected')
      await fetchRequests()
      await onChanged?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update request')
    } finally {
      setActingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
        <div className="h-32 animate-pulse rounded-xl bg-[var(--bg-hover)]" />
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Join Requests{' '}
          {pendingCount > 0 && <span className="text-[var(--primary)]">({pendingCount} pending)</span>}
        </h3>
        <span className="text-sm text-muted-foreground">
          {requests.length} request{requests.length === 1 ? '' : 's'}
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <FaUserClock className="mb-1 text-xl text-[var(--text-disabled)]" />
          <p className="font-medium text-[var(--text-primary)]">No join requests yet</p>
          <p>Requests to join this club will show up here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Requested</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                  <td className="py-3 pr-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--text-primary)]">{req.user?.fullName ?? 'Unknown'}</span>
                      {req.user?.email && <span className="text-xs text-muted-foreground">{req.user.email}</span>}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatDateTime(req.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLES[req.status] ?? 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {req.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDecision(req._id, 'approve')}
                          disabled={actingId === req._id}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)] transition-transform hover:scale-105 disabled:opacity-50"
                          title="Approve"
                        >
                          <FaCheck className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(req._id, 'reject')}
                          disabled={actingId === req._id}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--danger)]/10 text-[var(--danger)] transition-transform hover:scale-105 disabled:opacity-50"
                          title="Reject"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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