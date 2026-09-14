import React from "react";
import UserAvatar from "./UserAvatar";

/**
 * users: [{ id, name, role, avatar, attendance, kpi }]
 * attendance is 0-100, kpi is whatever score/label you track (e.g. "92" or "A").
 */
export default function UserKpiList({ users }) {
  return (
    <div className="rounded-[var(--radius-lg-value)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-sm-value)]">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Attendance & KPI</h3>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-4 px-5 py-3.5">
            <UserAvatar name={user.name} imageSrc={user.avatar} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {user.name}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">{user.role}</p>
            </div>

            <div className="hidden w-32 shrink-0 sm:block">
              <div className="mb-1 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>Attendance</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {user.attendance}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-[var(--radius-full-value)] bg-[var(--bg-hover)]">
                <div
                  className="h-full rounded-[var(--radius-full-value)] bg-[var(--success)] transition-all duration-500"
                  style={{ width: `${user.attendance}%` }}
                />
              </div>
            </div>

            <div className="shrink-0 rounded-[var(--radius-md-value)] bg-[var(--primary-light)] px-3 py-1.5 text-center">
              <p className="text-sm font-semibold text-[var(--primary)]">{user.kpi}</p>
              <p className="text-[10px] text-[var(--text-muted)]">KPI score</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}