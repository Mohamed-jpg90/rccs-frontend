import { FaTrophy } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";

export default function BadgesSection({ earnedBadges = [], nextBadgeProgress }) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Achievements
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">
        Badges
      </h2>

      {/* Next badge progress */}
      {nextBadgeProgress?.badge && (
        <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 mb-8 flex items-center gap-5 flex-wrap">
          <img
            src={getFileUrl(nextBadgeProgress.badge.badgeImage)}
            alt={nextBadgeProgress.badge.badgeName}
            loading="lazy"
            className="h-16 w-16 rounded-full object-cover bg-[var(--bg-hover)] opacity-60 grayscale"
          />
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-[var(--text-primary)]">
                {nextBadgeProgress.badge.badgeName}
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                {nextBadgeProgress.currentPoints} / {nextBadgeProgress.badge.pointsRequired} pts
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg-hover)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                style={{ width: `${nextBadgeProgress.percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {nextBadgeProgress.pointsNeeded} points to go —{" "}
              {nextBadgeProgress.badge.description}
            </p>
          </div>
        </div>
      )}

      {/* Earned badges */}
      {earnedBadges.length === 0 ? (
        <div className="text-center py-12 rounded-[var(--radius-xl-value)] border border-dashed border-[var(--border)]">
          <FaTrophy className="text-3xl text-[var(--text-disabled)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">
            No badges earned yet — keep participating to unlock your first one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {earnedBadges.map((ub) => (
            <EntityCard
              key={ub._id}
              image={getFileUrl(ub.badge?.badgeImage)}
              imageAlt={ub.badge?.badgeName}
              tag="Earned"
              title={ub.badge?.badgeName}
              description={ub.badge?.description}
            />
          ))}
        </div>
      )}
    </section>
  );
}