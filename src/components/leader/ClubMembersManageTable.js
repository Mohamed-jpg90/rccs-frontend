'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MdSearch, MdChevronLeft, MdChevronRight, MdPersonRemove } from 'react-icons/md'
import UserAvatar from '@/components/members/UserAvatar'
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog'
import { apiClient } from '@/lib/api'

const LIMIT = 20

export default function ClubMembersManageTable({ clubId, baseUrl = '' }) {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removing, setRemoving] = useState(null)

  const fetchUsers = useCallback(() => {
    setIsLoading(true)
    apiClient
      .get(`/clubs/${clubId}/users`, { params: { page, limit: LIMIT, ...(search.trim() ? { search: search.trim() } : {}) } })
      .then((res) => {
        setUsers(res.data?.users ?? [])
        setTotal(res.data?.total ?? 0)
      })
      .catch((err) => {
        console.error(err)
        setError('Could not load members.')
      })
      .finally(() => setIsLoading(false))
  }, [clubId, page, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const totalPages = Math.max(Math.ceil(total / LIMIT), 1)

  // Requesting removal, not deleting directly — matches the flow you
  // described (POST /users/:id/removal-request, admin approves later).
  const handleRequestRemoval = async () => {
    if (!removing) return
    await apiClient.post(`/users/${removing._id}/removal-request`)
    setRemoving(null)
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Members ({total})</h3>
        <div className="relative sm:w-64">
          <MdSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search members..."
            className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-main)] py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      ) : error ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--danger)]">{error}</p>
      ) : users.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">No members found.</p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {users.map((user) => (
            <li key={user._id} className="flex items-center gap-3 px-5 py-3.5">
              <button
                type="button"
                onClick={() => router.push(`/profile/${user._id}`)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <UserAvatar name={user.fullName} imageSrc={user.profileImage} baseUrl={baseUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{user.fullName}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
                </div>
              </button>
              <span className="hidden shrink-0 text-xs text-[var(--text-muted)] sm:block">
                {user.totalPoints ?? 0} pts
              </span>
              <button
                type="button"
                onClick={() => setRemoving(user)}
                className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
              >
                <MdPersonRemove className="text-sm" />
                Request Removal
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-40"
          >
            <MdChevronLeft className="text-sm" /> Prev
          </button>
          <span className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-40"
          >
            Next <MdChevronRight className="text-sm" />
          </button>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={!!removing}
        title="Request member removal?"
        itemName={removing?.fullName}
        description={removing ? `This sends a removal request for ${removing.fullName} to an admin for approval — they won't be removed immediately.` : undefined}
        onClose={() => setRemoving(null)}
        onConfirm={handleRequestRemoval}
      />
    </div>
  )
}