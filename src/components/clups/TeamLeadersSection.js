import { FaUserTie } from "react-icons/fa";
import { getFileUrl } from "@/lib/files";

export default function TeamLeadersSection({ leaders = [] }) {
  const assigned = leaders.filter((l) => l.teamLeader);

  if (assigned.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Leadership
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-8">
        Team Leaders
      </h2>

      <div className="flex flex-wrap gap-5">
        {assigned.map((entry) => {
          const leader = entry.teamLeader;
          const avatar = getFileUrl(leader.profileImage);
          return (
            <div
              key={entry._id}
              className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg-value)] px-5 py-4"
            >
              {avatar ? (
                <img src={avatar} alt={leader.fullName} className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <div className="h-11 w-11 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                  <FaUserTie className="text-[var(--primary)]" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{leader.fullName}</p>
                <p className="text-xs text-[var(--text-muted)]">{leader.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}