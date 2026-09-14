import { FaUserCircle, FaUsers, FaCircle } from "react-icons/fa";
import { getFileUrl } from "@/lib/files";

const STATUS_COLORS = {
  Active: "var(--success)",
  Inactive: "var(--text-disabled)",
  Suspended: "var(--danger)",
};

export default function ProfileHeader({ user }) {
  if (!user) return null;

  const statusColor = STATUS_COLORS[user.status] || "var(--text-muted)";
  const avatarUrl = getFileUrl(user.profileImage);

  return (
    <section className="relative overflow-hidden bg-[var(--bg-main)]">
      <div
        className="absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-1)",
          opacity: "var(--Background-Circle-opacity-1)",
        }}
      />
      <div
        className="absolute top-0 -right-24 h-[320px] w-[320px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-2)",
          opacity: "var(--Background-Circle-opacity-2)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.fullName}
                className="h-28 w-28 rounded-full object-cover border-4 border-[var(--bg-card)] shadow-[var(--shadow-lg-value)]"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-[var(--primary-light)] flex items-center justify-center border-4 border-[var(--bg-card)] shadow-[var(--shadow-lg-value)]">
                <FaUserCircle className="text-[var(--primary)] text-6xl" />
              </div>
            )}
            <span
              className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[var(--bg-card)]"
              style={{ background: statusColor }}
              title={user.status}
            />
          </div>

          {/* Identity */}
          <div className="text-center md:text-left flex-1">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-2">
              {user.fullName}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5 bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full font-medium">
                {user.role}
              </span>
              {user.club && (
                <span className="inline-flex items-center gap-1.5">
                  <FaUsers className="text-[var(--primary)]" />
                  {user.club.clubName || "No club assigned"}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <FaCircle className="text-[6px]" style={{ color: statusColor }} />
                {user.status}
              </span>
            </div>
          </div>

          {/* Points highlight */}
          <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] px-8 py-5 text-center shadow-[var(--shadow-md-value)]">
            <div className="font-display text-3xl font-semibold text-[var(--primary)]">
              {user.totalPoints ?? 0}
            </div>
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mt-1">
              Total Points
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}