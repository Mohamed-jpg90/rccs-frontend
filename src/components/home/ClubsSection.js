import Link from "next/link";
import { FaUsers, FaArrowRight } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";

export default function ClubsSection({ clubs = [], loading }) {
  const preview = clubs.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
            Find Your Club
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            Clubs at RCS
          </h2>
        </div>

        <Link
          href="/clubs"
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:gap-3 transition-all"
        >
          Show more
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-[var(--radius-xl-value)] bg-[var(--bg-hover)] animate-pulse"
            />
          ))}
        </div>
      ) : preview.length === 0 ? (
        <p className="text-[var(--text-muted)] text-sm">
          No clubs available right now — check back soon.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {preview.map((club) => {
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
                  {
                    icon: FaUsers,
                    text:
                      spotsLeft > 0
                        ? `${spotsLeft} spots left`
                        : "Full",
                  },
                ]}
              />
            );
          })}
        </div>
      )}

      <Link
        href="/clubs"
        className="md:hidden mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)]"
      >
        Show more
        <FaArrowRight className="text-xs" />
      </Link>
    </section>
  );
}