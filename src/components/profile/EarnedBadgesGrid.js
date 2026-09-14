import React from 'react'
import BadgeCard from '@/components/badges/BadgeCard'

export default function EarnedBadgesGrid({ earnedBadges = [], baseUrl = '' }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Badges Earned</h3>
        <span className="text-sm text-muted-foreground">
          {earnedBadges.length} badge{earnedBadges.length === 1 ? '' : 's'}
        </span>
      </div>

      {earnedBadges.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No badges earned yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {earnedBadges.map((entry) => (
            <BadgeCard key={entry._id} badge={entry.badge} baseUrl={baseUrl} />
          ))}
        </div>
      )}
    </div>
  )
}