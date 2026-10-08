'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { MdSearch, MdCheck } from 'react-icons/md'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'
import useDebounce from '@/hooks/useDebounce'

/**
 * AssignTeamLeaderModal — searches users on the server (GET /users?search=)
 * and lets the admin assign any non-admin user as this club's Team Leader.
 * The backend promotes the user to the "Team Leader" role automatically.
 */
export default function AssignTeamLeaderModal({ isOpen, onClose, clubId, existingIds = [], onAssigned }) {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [assigningId, setAssigningId] = useState(null)
  const [error, setError] = useState(null)

  const debouncedSearch = useDebounce(search, 400)

  // Reset when the modal opens
  useEffect(() => {
    if (!isOpen) return
    setSearch('')
    setError(null)
  }, [isOpen])

  // Fetch from the server whenever the modal opens or the search changes
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false

    setIsLoading(true)
    apiClient
      .get('/users', { params: { search: debouncedSearch, page: 1, limit: 50 } })
      .then((res) => {
        if (cancelled) return
        const all = res.data?.users ?? []
        setUsers(all.filter((u) => u.role !== 'Admin')) // backend rejects Admins
      })
      .catch((err) => {
        if (cancelled) return
        console.error(err)
        setError('Could not load users.')
      })
      .finally(() => !cancelled && setIsLoading(false))

    return () => {
      cancelled = true
    }
  }, [isOpen, debouncedSearch])

  // Show current Team Leaders first, then regular users
  const sortedUsers = useMemo(
    () =>
      [...users].sort((a, b) => {
        if (a.role === b.role) return 0
        return a.role === 'Team Leader' ? -1 : 1
      }),
    [users]
  )

  const handleAssign = async (user) => {
    setAssigningId(user._id)
    setError(null)
    try {
      await apiClient.post(`/clubs/${clubId}/team-leaders`, { userId: user._id })
      // Reflect the auto-promotion locally
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: 'Team Leader' } : u)))
      onAssigned?.()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message ?? 'Could not assign this user. Please try again.')
    } finally {
      setAssigningId(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Team Leader" maxWidth="max-w-lg">
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

          {!isLoading && sortedUsers.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No users found.</p>
          )}

          {!isLoading &&
            sortedUsers.map((user) => {
              const isAssigned = existingIds.includes(user._id)
              const isAssigning = assigningId === user._id
              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--bg-hover)]"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-[var(--text-primary)]">
                      {user.fullName ?? 'Unknown'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email} · {user.role}
                    </span>
                  </div>

                  {isAssigned ? (
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