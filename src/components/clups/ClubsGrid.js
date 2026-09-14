import { FaUsers } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";

export default function ClubsGrid({ clubs, loading, page, totalPages, onPageChange }) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 rounded-[var(--radius-xl-value)] bg-[var(--bg-hover)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-16 rounded-[var(--radius-xl-value)] border border-dashed border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">No clubs match your search.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {clubs.map((club) => {
          const spotsLeft = (club.maxMembers ?? 0) - (club.currentMembersCount ?? 0);
          return (
            <EntityCard
              key={club._id}
              href={`/clubs/${club._id}`}
              image={getFileUrl(club.coverImage)}
              imageAlt={club.clubName}
              title={club.clubName}
              description={club.description}
              progress={{
                value: club.currentMembersCount ?? 0,
                max: club.maxMembers ?? 0,
                label: "Members",
              }}
              meta={[
                { icon: FaUsers, text: spotsLeft > 0 ? `${spotsLeft} spots left` : "Full" },
              ]}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                page === i + 1
                  ? "bg-[var(--primary)] text-[var(--text-white)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}