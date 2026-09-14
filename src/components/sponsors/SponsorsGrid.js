"use client";

import SponsorCard from "./SponsorCard";
import { FaBuilding } from "react-icons/fa";

function SponsorSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] overflow-hidden animate-pulse">
      <div className="h-32 bg-[var(--bg-surface)]" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-16 bg-[var(--bg-surface)] rounded-full" />
        <div className="h-3.5 w-3/4 bg-[var(--bg-surface)] rounded-full" />
      </div>
    </div>
  );
}

export default function SponsorsGrid({ sponsors, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <SponsorSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4">
          <FaBuilding className="text-xl text-[var(--text-muted)]" />
        </div>
        <p className="text-[var(--text-secondary)] font-medium">No sponsors yet</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Add your first sponsor to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {sponsors.map((sponsor) => (
        <SponsorCard key={sponsor._id} sponsor={sponsor} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}