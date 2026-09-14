"use client";

import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { getFileUrl } from "@/lib/files";
import EntityCard from "@/components/UI/EntityCard";

export default function TeamLeaderDashboardPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/me/led-clubs")
      .then((res) => setClubs(res.data.clubs || []))
      .catch((err) => console.error("Error fetching led clubs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Team Leader
      </span>
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">
        Your Clubs
      </h1>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-[var(--radius-xl-value)] bg-[var(--bg-hover)] animate-pulse" />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">You aren't leading any clubs yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const spotsLeft = (club.maxMembers ?? 0) - (club.currentMembersCount ?? 0);
            return (
              <EntityCard
                key={club._id}
                href={`/team-leader/dashboard/clubs/${club._id}`}
                image={getFileUrl(club.coverImage)}
                imageAlt={club.clubName}
                title={club.clubName}
                description={club.description}
                progress={{ value: club.currentMembersCount ?? 0, max: club.maxMembers ?? 0, label: "Members" }}
                meta={[{ icon: FaUsers, text: spotsLeft > 0 ? `${spotsLeft} spots left` : "Full" }]}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}