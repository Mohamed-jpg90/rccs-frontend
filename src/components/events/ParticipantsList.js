import React from "react";
import { FaUserCircle } from "react-icons/fa";

/**
 * ParticipantsList — shows who's registered for the event.
 *
 * NOTE: the /participants endpoint currently returns an empty array in
 * every sample response seen so far, so the exact participant object
 * shape is unconfirmed. This reads common field names defensively
 * (fullName/name, email) and falls back gracefully if a field is missing.
 */
export default function ParticipantsList({ participants = [], total }) {
  const count = total ?? participants.length;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Participants</h3>
        <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
          {count}
        </span>
      </div>

      {participants.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No one has registered yet</p>
          <p>Registered participants will appear here.</p>
        </div>
      ) : (
        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {participants.map((p) => (
            <li
              key={p._id ?? p.email}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--bg-hover)]"
            >
              <FaUserCircle className="text-2xl text-[var(--text-muted)]" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {p.user.fullName ?? p.name ?? "Unnamed participant"}
                </span>
                {p.user.email && (
                  <span className="truncate text-xs text-muted-foreground">{p.user.email}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}