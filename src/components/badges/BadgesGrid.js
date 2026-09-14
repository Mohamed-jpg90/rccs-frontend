import { FaStar } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";

export default function BadgesGrid({ badges, loading }) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 rounded-[var(--radius-xl-value)] bg-[var(--bg-hover)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-16 rounded-[var(--radius-xl-value)] border border-dashed border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">No badges match your search.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {badges.map((badge) => (
        <EntityCard
          key={badge._id}
          image={getFileUrl(badge.badgeImage)}
          imageAlt={badge.badgeName}
          title={badge.badgeName}
          description={badge.description}
          meta={[{ icon: FaStar, text: `${badge.pointsRequired} pts required` }]}
          footer={
            <span className="block text-center text-xs font-medium bg-[var(--primary-light)] text-[var(--primary)] py-2.5 rounded-full">
              +{badge.points} pts on award
            </span>
          }
        />
      ))}
    </div>
  );
}