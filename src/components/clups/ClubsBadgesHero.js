"use client";

import { FaSearch, FaUsers, FaTrophy } from "react-icons/fa";

export default function ClubsBadgesHero({
  activeTab,
  onTabChange,
  stats,
  search,
  onSearchChange,
}) {
  const isClubsTab = activeTab === "clubs";

  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface)] border-b border-[var(--border)]">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--Background-Circle-color-1)", opacity: "var(--Background-Circle-opacity-1)" }}
      />
      <div
        className="absolute bottom-0 -right-20 h-[280px] w-[280px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--Background-Circle-color-3)", opacity: "var(--Background-Circle-opacity-3)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-14 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
          {isClubsTab ? <FaUsers /> : <FaTrophy />}
          {isClubsTab ? "Our Clubs" : "Recognition"}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-4">
          {isClubsTab ? "Find where you belong" : "Badges worth earning"}
        </h1>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto mb-8 leading-relaxed">
          {isClubsTab
            ? "Every club has its own rhythm — pick one, show up, and the rest follows."
            : "Every point you earn brings you closer to unlocking one of these."}
        </p>

        {/* Tab switcher */}
        <div className="inline-flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full p-1 mb-10">
          <button
            onClick={() => onTabChange("clubs")}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-colors ${
              isClubsTab
                ? "bg-[var(--primary)] text-[var(--text-white)]"
                : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
            }`}
          >
            <FaUsers className="text-xs" />
            Clubs
          </button>
          <button
            onClick={() => onTabChange("badges")}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-colors ${
              !isClubsTab
                ? "bg-[var(--primary)] text-[var(--text-white)]"
                : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
            }`}
          >
            <FaTrophy className="text-xs" />
            Badges
          </button>
        </div>

        {/* Stats — swap based on active tab */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-sm mx-auto mb-10">
          {isClubsTab ? (
            <>
              <div className="rounded-[var(--radius-lg-value)] bg-[var(--bg-card)] border border-[var(--border)] py-4 px-3">
                <div className="font-display text-2xl font-semibold text-[var(--primary)]">
                  {stats.clubsTotal}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Active Clubs</div>
              </div>
              <div className="rounded-[var(--radius-lg-value)] bg-[var(--bg-card)] border border-[var(--border)] py-4 px-3">
                <div className="font-display text-2xl font-semibold text-[var(--primary)]">
                  {stats.openSpots}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Open Spots</div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-[var(--radius-lg-value)] bg-[var(--bg-card)] border border-[var(--border)] py-4 px-3">
                <div className="font-display text-2xl font-semibold text-[var(--primary)]">
                  {stats.badgesTotal}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Total Badges</div>
              </div>
              <div className="rounded-[var(--radius-lg-value)] bg-[var(--bg-card)] border border-[var(--border)] py-4 px-3">
                <div className="font-display text-2xl font-semibold text-[var(--primary)]">
                  {stats.maxPoints}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Highest Requirement</div>
              </div>
            </>
          )}
        </div>

        <div className="relative max-w-xl mx-auto">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isClubsTab ? "Search clubs..." : "Search badges..."}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
          />
        </div>
      </div>
    </section>
  );
}