'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { MdSearch, MdCheck } from 'react-icons/md'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

export default function AssignBadgeModal({ isOpen, onClose, badge }) {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [assigningId, setAssigningId] = useState(null)
  const [assignedId, setAssignedId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    setSearch('')
    setError(null)
    setAssignedId(null)
    setIsLoading(true)
    apiClient
      .get('/users')
      .then((res) => setUsers(res.data?.users ?? res.data ?? []))
      .catch((err) => {
        console.error(err)
        setError('Could not load users.')
      })
      .finally(() => setIsLoading(false))
  }, [isOpen])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) => u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    )
  }, [users, search])

  const handleAssign = async (user) => {
    setAssigningId(user._id)
    setError(null)
    try {
      await apiClient.post(`/badges/${badge._id}/assign`, { userId: user._id })
      setAssignedId(user._id)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message ?? 'Could not assign the badge. Please try again.')
    } finally {
      setAssigningId(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign "${badge?.badgeName ?? ''}"`} maxWidth="max-w-lg">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <MdSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-main)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
          />
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
          {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading users...</p>}

          {!isLoading && filteredUsers.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No users found.</p>
          )}

          {!isLoading &&
            filteredUsers.map((user) => {
              const isAssigning = assigningId === user._id
              const wasJustAssigned = assignedId === user._id
              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--bg-hover)]"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-[var(--text-primary)]">
                      {user.fullName ?? 'Unknown'}
                    </span>
                    {user.email && (
                      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    )}
                  </div>

                  {wasJustAssigned ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--success)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--success)]">
                      <MdCheck className="text-sm" />
                      Assigned
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAssign(user)}
                      disabled={isAssigning}
                      className="shrink-0 rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isAssigning ? 'Assigning...' : 'Assign'}
                    </button>
                  )}
                </div>
              )
            })}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}