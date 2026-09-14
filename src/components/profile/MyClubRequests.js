'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

const STATUS_STYLES = {
  Pending: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  Approved: 'bg-[var(--success)]/10 text-[var(--success)]',
  Rejected: 'bg-[var(--danger)]/10 text-[var(--danger)]',
}

export default function MyClubRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get('/me/club-requests')
      .then((res) => setRequests(res.data?.requests ?? []))
      .catch((err) => console.error('Failed to load club requests', err))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return null
  if (requests.length === 0) return null

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <h3 className="mb-4 border-b border-[var(--border)] pb-4 text-lg font-semibold text-[var(--text-primary)]">
        My Club Requests
      </h3>
      <ul className="flex flex-col divide-y divide-[var(--border)]">
        {requests.map((req) => (
          <li key={req._id}>
            <button
              type="button"
              onClick={() => router.push(`/clubs/${req.club._id}`)}
              className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-[var(--bg-hover)]"
            >
              <span className="truncate text-sm font-medium text-[var(--text-primary)]">{req.club.clubName}</span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[req.status] ?? ''}`}>
                {req.status}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}