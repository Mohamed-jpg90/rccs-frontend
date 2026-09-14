"use client";

import { FaSearch, FaCalendarAlt } from "react-icons/fa";

const STATUS_FILTERS = ["All", "Upcoming", "Ongoing", "Finished"];

export default function EventsHero({
  stats,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface)] border-b border-[var(--border)]">
      {/* Ambient circles — asymmetric, unlike home hero's split layout */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--Background-Circle-color-2)", opacity: "var(--Background-Circle-opacity-2)" }}
      />
      <div
        className="absolute bottom-0 -left-20 h-[280px] w-[280px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--Background-Circle-color-3)", opacity: "var(--Background-Circle-opacity-3)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-14 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
          <FaCalendarAlt />
          Events Calendar
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-4">
          Every gathering, one place
        </h1>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto mb-10 leading-relaxed">
          Browse everything happening across our clubs — register in a tap,
          and we'll keep your spot ready at the door.
        </p>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-xl mx-auto mb-10">
          {[
            { label: "Total Events", value: stats.total },
            { label: "This Month", value: stats.thisMonth },
            { label: "Clubs Hosting", value: stats.clubs },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--radius-lg-value)] bg-[var(--bg-card)] border border-[var(--border)] py-4 px-3"
            >
              <div className="font-display text-2xl font-semibold text-[var(--primary)]">
                {s.value}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full p-1">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-[var(--primary)] text-[var(--text-white)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}