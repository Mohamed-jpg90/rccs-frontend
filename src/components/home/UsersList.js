'use client'

import React, { useState } from "react";
import UserAvatar from "./UserAvatar";
import UserDrawer from "./UserDrawer";

const ROLE_STYLES = {
  Admin: "text-[var(--primary)] bg-[var(--primary-light)]",
  "Team Lead": "text-[var(--info)] bg-[var(--info-bg)]",
  User: "text-[var(--text-secondary)] bg-[var(--bg-hover)]",
};

/**
 * users: [{ id, name, email, avatar, role, blocked }]
 * onRoleChange(id, role) / onStatusChange(id, blocked) / onDelete(id)
 * should update your users state (local state, or your API + refetch).
 */
export default function UsersList({ users, onRoleChange, onStatusChange, onDelete }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedUser = users.find((u) => u.id === selectedId) || null;

  return (
    <div className="rounded-[var(--radius-lg-value)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-sm-value)]">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Team members</h3>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {users.map((user) => (
          <li key={user.id}>
            <button
              type="button"
              onClick={() => setSelectedId(user.id)}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-[var(--bg-hover)]"
            >
              <UserAvatar name={user.name} imageSrc={user.avatar} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {user.name}
                </p>
                <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
              </div>
              <span
                className={`shrink-0 rounded-[var(--radius-full-value)] px-2.5 py-1 text-[11px] font-medium ${ROLE_STYLES[user.role]}`}
              >
                {user.role}
              </span>
              <span
                title={user.blocked ? "Blocked" : "Active"}
                className={`h-2 w-2 shrink-0 rounded-full ${
                  user.blocked ? "bg-[var(--danger)]" : "bg-[var(--success)]"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      <UserDrawer
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedId(null)}
        onRoleChange={onRoleChange}
        onStatusChange={onStatusChange}
        onDelete={(id) => {
          onDelete(id);
          setSelectedId(null);
        }}
      />
    </div>
  );
}