import { FaUsers } from "react-icons/fa";
import { getFileUrl } from "@/lib/files";

export default function ClubBanner({ club }) {
  if (!club) return null;
  const spotsLeft = (club.maxMembers ?? 0) - (club.currentMembersCount ?? 0);
  const fillPercent = Math.min(100, ((club.currentMembersCount ?? 0) / (club.maxMembers ?? 1)) * 100);

  return (
    <section className="relative h-[340px] md:h-[400px] w-full overflow-hidden">
      <img
        src={getFileUrl(club.coverImage)}
        alt={club.clubName}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-10 text-white">
        <h1 className="font-display text-3xl md:text-5xl font-semibold mb-3 max-w-2xl">
          {club.clubName}
        </h1>
        <p className="text-white/80 max-w-xl mb-5 leading-relaxed">
          {club.description}
        </p>

        <div className="flex items-center gap-3 max-w-xs">
          <FaUsers className="text-white/80" />
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-white/80 whitespace-nowrap">
            {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
          </span>
        </div>
      </div>
    </section>
  );
}