"use client";

import { useRouter } from "next/navigation";
import { MdChevronRight } from "react-icons/md";

const FILE_BASE_URL = 'https://rccs-backend-production.up.railway.app';

export default function TopMembersList({ members = [] }) {
  const router = useRouter();

  if (!members.length) {
    return (
      <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 text-center text-sm text-[var(--text-muted)]">
        No members with points yet.
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
          Top {members.length} Members
        </h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {members.map((member) => (
          <button
            key={member._id}
            type="button"
            onClick={() => router.push(`/dashboard/profile/${member._id}`)}
            className="w-full flex items-center gap-4 px-6 py-3 text-left transition-colors hover:bg-[var(--bg-hover)]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-xs font-semibold text-[var(--primary)]">
              {member.rank}
            </span>

            <img
              src={member.profileImage ? `${FILE_BASE_URL}${member.profileImage}` : "/default-avatar.png"}
              alt={member.fullName}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">{member.fullName}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{member.club?.clubName ?? "No club"}</p>
            </div>

            <span className="shrink-0 text-sm font-semibold text-[var(--primary)]">
              {member.totalPoints} pts
            </span>

            <MdChevronRight className="shrink-0 text-[var(--text-muted)]" />
          </button>
        ))}
      </div>
    </div>
  );
}