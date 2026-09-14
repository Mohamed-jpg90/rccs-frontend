'use client'

import React, { useState, useEffect } from 'react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import UserAvatar from './UserAvatar'
import StatusToggle from './StatusToggle'

const ROLES = ['Admin', 'Team Leader', 'User']

export default function UserDrawer({
  user,
  isOpen,
  onClose,
  baseUrl = '',
  onRoleChange,
  onStatusChange,
  onDelete,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    if (!isOpen) setConfirmingDelete(false)
  }, [isOpen, user])

  if (!user) return null

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-[var(--border)] bg-[var(--bg-card)] shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">User details</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3">
            <UserAvatar name={user.fullName} imageSrc={user.profileImage} baseUrl={baseUrl} size={52} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user.fullName}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
              {user.phoneNumber && (
                <p className="truncate text-xs text-[var(--text-muted)]">{user.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Role</label>
            <select
              value={user.role}
              onChange={(e) => onRoleChange(user._id, e.target.value)}
              className="mt-1.5 w-full rounded-md border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-md border border-[var(--border)] px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user.status === 'Active' ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {user.status === 'Active' ? 'This user can sign in' : "This user can't sign in"}
              </p>
            </div>
            <StatusToggle
              active={user.status === 'Active'}
              onChange={(active) => onStatusChange(user._id, active ? 'Active' : 'Inactive')}
            />
          </div>

          {user.totalPoints != null && (
            <div className="mt-5 rounded-md border border-[var(--border)] px-3.5 py-3">
              <p className="text-xs text-[var(--text-muted)]">Total Points</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{user.totalPoints}</p>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--border)] px-5 py-4">
          {confirmingDelete ? (
            <div className="flex items-center gap-2">
              <p className="flex-1 text-xs text-[var(--text-secondary)]">Delete this user?</p>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(user._id)
                  setConfirmingDelete(false)
                }}
                className="rounded-md bg-[var(--danger)] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--danger)] px-3.5 py-2.5 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
            >
              <FiTrash2 className="text-base" />
              Delete user
            </button>
          )}
        </div>
      </aside>
    </>
  )
}