// components/Profile/LedClubsSection.jsx
"use client";

import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { getFileUrl } from "@/lib/files";
import EntityCard from "@/components/UI/EntityCard";

export default function LedClubsSection() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/me/led-clubs").then((res) => setClubs(res.data.clubs || [])).finally(() => setLoading(false));
  }, []);

  if (loading || clubs.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">Leadership</span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">My Clubs</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <EntityCard
            key={club._id}
            href={`/team-leader/dashboard/clubs/${club._id}`}
            image={getFileUrl(club.coverImage)}
            imageAlt={club.clubName}
            title={club.clubName}
            description={club.description}
            meta={[{ icon: FaUsers, text: `${club.currentMembersCount ?? 0}/${club.maxMembers ?? 0} members` }]}
          />
        ))}
      </div>
    </section>
  );
}