'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserAvatar from './UserAvatar'
import UserDrawer from './UserDrawer'

const ROLE_STYLES = {
  Admin: 'text-[var(--primary)] bg-[var(--primary-light)]',
  'Team Leader': 'text-[var(--info)] bg-[var(--info-bg)]',
  User: 'text-[var(--text-secondary)] bg-[var(--bg-hover)]',
}

export default function UsersTable({
  users,
  baseUrl = '',
  onRoleChange,
  onStatusChange,
  onDelete,
  page,
  totalPages,
  totalUsers,
  onPageChange,
}) {
  const router = useRouter()

  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')

  const selectedUser =
    users.find((u) => u._id === selectedId) || null

  /*
   * Client-side filtering for the users
   * already loaded on the current page.
   *
   * For true database-wide search,
   * move search into the API request.
   */
  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return users

    return users.filter((user) => {
      return (
        user.fullName?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.role?.toLowerCase().includes(value)
      )
    })
  }, [users, search])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Members
          </h3>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {totalUsers ?? users.length} members
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)]"
          />
        </div>
      </div>

      {/* Users */}
      {filteredUsers.length === 0 ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm text-[var(--text-muted)]">
            No members found.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              {/* User */}
              <button
                type="button"
                onClick={() =>
                  router.push(`profile/${user._id}`)
                }
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <UserAvatar
                  name={user.fullName}
                  imageSrc={user.profileImage}
                  baseUrl={baseUrl}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                    {user.fullName}
                  </p>

                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {user.email}
                  </p>
                </div>
              </button>

              {/* Points */}
              <span className="hidden shrink-0 text-xs text-[var(--text-muted)] sm:block">
                {user.totalPoints ?? 0} pts
              </span>

              {/* Role */}
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  ROLE_STYLES[user.role] ?? ROLE_STYLES.User
                }`}
              >
                {user.role}
              </span>

              {/* Status */}
              <span
                title={
                  user.status === 'Active'
                    ? 'Active'
                    : 'Inactive'
                }
                className={`h-2 w-2 shrink-0 rounded-full ${
                  user.status === 'Active'
                    ? 'bg-[var(--success)]'
                    : 'bg-[var(--danger)]'
                }`}
              />

              {/* Manage */}
              <button
                type="button"
                onClick={() => setSelectedId(user._id)}
                className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                Manage
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4">

          <p className="text-xs text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">

            {/* Previous */}
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                onPageChange(page - 1)
              }
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="hidden items-center gap-1 sm:flex">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .filter((pageNumber) => {
                  return (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - page) <= 1
                  )
                })
                .map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() =>
                      onPageChange(pageNumber)
                    }
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-medium transition ${
                      pageNumber === page
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
            </div>

            {/* Next */}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                onPageChange(page + 1)
              }
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        </div>
      )}

      {/* Drawer */}
      <UserDrawer
        user={selectedUser}
        isOpen={!!selectedUser}
        baseUrl={baseUrl}
        onClose={() => setSelectedId(null)}
        onRoleChange={onRoleChange}
        onStatusChange={onStatusChange}
        onDelete={(id) => {
          onDelete(id)
          setSelectedId(null)
        }}
      />
    </div>
  )
}