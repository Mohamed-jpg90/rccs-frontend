import React from "react";
import CircularProgress from "./CircularProgress";

/**
 * roles: [{ title, count, candidates, percent, color }]
 * Pass onSeeAll for a router navigate() call, or leave it out and
 * it falls back to a plain <a href={seeAllHref}>.
 */
export default function HiringNeedsCard({ roles, onSeeAll, seeAllHref = "/analysis" }) {
  return (
    <div className="rounded-[var(--radius-lg-value)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm-value)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">You need to hire</h3>
        {onSeeAll ? (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
          >
            see all
          </button>
        ) : (
          <a
            href={seeAllHref}
            className="text-xs font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
          >
            see all
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.title}
            className="rounded-[var(--radius-lg-value)] border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-sm-value)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="" >
 <p className="text-2xl font-bold text-[var(--text-primary)]">{role.count}</p>
              </div>
              <div className="min-w-0">
               
                <p className="mt-0.5 truncate text-sm font-medium text-[var(--text-primary)]">
                  {role.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {role.candidates} candidates
                </p>
              </div>
              <CircularProgress value={role.percent} color={role.color || "var(--primary)"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}