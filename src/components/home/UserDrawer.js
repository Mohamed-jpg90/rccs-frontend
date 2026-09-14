import React, { useState, useEffect } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import UserAvatar from "./UserAvatar";
import StatusToggle from "./StatusToggle";

const ROLES = ["Admin", "Team Lead", "User"];

export default function UserDrawer({
  user,
  isOpen,
  onClose,
  onRoleChange,
  onStatusChange,
  onDelete,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!isOpen) setConfirmingDelete(false);
  }, [isOpen, user]);

  if (!user) return null;

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
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg-value)] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">User details</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-[var(--radius-sm-value)] p-1.5 text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--bg-hover)]"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} imageSrc={user.avatar} size={52} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {user.name}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Role</label>
            <select
              value={user.role}
              onChange={(e) => onRoleChange(user.id, e.target.value)}
              className="mt-1.5 w-full rounded-[var(--radius-md-value)] border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors duration-200 focus:border-[var(--border-focus)]"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[var(--radius-md-value)] border border-[var(--border)] px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user.blocked ? "Blocked" : "Active"}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {user.blocked ? "This user can't sign in" : "This user can sign in"}
              </p>
            </div>
            <StatusToggle
              blocked={user.blocked}
              onChange={(blocked) => onStatusChange(user.id, blocked)}
            />
          </div>
        </div>

        <div className="border-t border-[var(--border)] px-5 py-4">
          {confirmingDelete ? (
            <div className="flex items-center gap-2">
              <p className="flex-1 text-xs text-[var(--text-secondary)]">Delete this user?</p>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-[var(--radius-md-value)] border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(user.id);
                  setConfirmingDelete(false);
                }}
                className="rounded-[var(--radius-md-value)] bg-[var(--danger)] px-3 py-1.5 text-xs font-medium text-white transition-opacity duration-200 hover:opacity-90"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md-value)] border border-[var(--danger)] px-3.5 py-2.5 text-sm font-medium text-[var(--danger)] transition-colors duration-200 hover:bg-[var(--danger-bg)]"
            >
              <FiTrash2 className="text-base" />
              Delete user
            </button>
          )}
        </div>
      </aside>
    </>
  );
}