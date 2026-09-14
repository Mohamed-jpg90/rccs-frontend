import { FaTrophy } from "react-icons/fa";
import { getFileUrl } from "@/lib/files";

const MEDAL_COLORS = ["#facc15", "#94a3b8", "#b45309"];

// ⚠️ unconfirmed shape — verify /clubs/:id/top3 against real API response
export default function Top3Leaderboard({ top3 = [] }) {
  if (top3.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6">
      <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
        <FaTrophy className="text-[var(--primary)]" /> Top Members
      </h3>
      <div className="flex flex-col gap-3">
        {top3.map((member, i) => {
          const avatar = getFileUrl(member.profileImage);
          return (
            <div key={member._id} className="flex items-center gap-3">
              <span className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: MEDAL_COLORS[i] }}>
                {i + 1}
              </span>
              {avatar ? (
                <img src={avatar} alt={member.fullName} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-[var(--primary-light)]" />
              )}
              <span className="text-sm font-medium text-[var(--text-primary)] flex-1">{member.fullName}</span>
              <span className="text-sm font-semibold text-[var(--primary)]">{member.totalPoints} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}