"use client";

import VolunteerCard from "./VolunteerCard";
import { FaUsers } from "react-icons/fa";

function VolunteerSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] p-5 text-center animate-pulse">
      <div className="h-24 w-24 mx-auto rounded-full bg-[var(--bg-surface)] mb-4" />
      <div className="h-3.5 w-2/3 mx-auto bg-[var(--bg-surface)] rounded-full mb-2" />
      <div className="h-2.5 w-1/2 mx-auto bg-[var(--bg-surface)] rounded-full" />
    </div>
  );
}

export default function VolunteersGrid({ volunteers, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <VolunteerSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (volunteers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4">
          <FaUsers className="text-xl text-[var(--text-muted)]" />
        </div>
        <p className="text-[var(--text-secondary)] font-medium">No volunteers yet</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Add your first volunteer to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {volunteers.map((volunteer) => (
        <VolunteerCard
          key={volunteer._id}
          volunteer={volunteer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}