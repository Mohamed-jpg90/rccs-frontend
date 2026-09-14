import React from 'react'
import UserAvatar from '@/components/members/UserAvatar'
import { MdEmojiEvents } from 'react-icons/md'

const MEDAL_COLORS = ['#facc15', '#94a3b8', '#b45309']

export default function Top3Leaderboard({ top3 = [], baseUrl = '' }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <h3 className="mb-4 border-b border-[var(--border)] pb-4 text-lg font-semibold text-[var(--text-primary)]">
        Top Members
      </h3>

      {top3.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No point activity yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {top3.map((member, idx) => (
            <li key={member._id} className="flex items-center gap-3">
              <MdEmojiEvents style={{ color: MEDAL_COLORS[idx] ?? '#94a3b8' }} className="text-xl" />
              <UserAvatar name={member.fullName} imageSrc={member.profileImage} baseUrl={baseUrl} size={36} />
              <span className="flex-1 truncate text-sm font-medium text-[var(--text-primary)]">{member.fullName}</span>
              <span className="text-sm font-semibold text-[var(--primary)]">{member.totalPoints} pts</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}