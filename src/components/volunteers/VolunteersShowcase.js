"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import VolunteerPublicCard from "./VolunteerPublicCard";
import { FaUsers } from "react-icons/fa";

function CardSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] overflow-hidden animate-pulse">
      <div className="h-52 bg-[var(--bg-surface)]" />
      <div className="p-5 space-y-2">
        <div className="h-4 w-2/3 bg-[var(--bg-surface)] rounded-full" />
        <div className="h-3 w-full bg-[var(--bg-surface)] rounded-full" />
        <div className="h-3 w-4/5 bg-[var(--bg-surface)] rounded-full" />
      </div>
    </div>
  );
}

export default function VolunteersShowcase() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/volunteers")
      .then((res) => setVolunteers(res.data.volunteers || []))
      .catch((err) => console.error("Error fetching volunteers:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="volunteers-list" className="relative bg-[var(--bg-surface)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
            The People
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            Meet Our Volunteers
          </h2>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && volunteers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4">
              <FaUsers className="text-xl text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-secondary)]">No volunteers listed yet.</p>
          </div>
        )}

        {!loading && volunteers.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {volunteers.map((volunteer) => (
              <VolunteerPublicCard key={volunteer._id} volunteer={volunteer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}