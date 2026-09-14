"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { isAdmin, isTeamLeader } from "@/lib/auth";
import ClubBanner from "@/components/clups/ClubBanner";
import JoinClubButton from "@/components/clups/JoinClubButton";
import JoinRequestsSection from "@/components/clups/JoinRequestsSection";
import TeamLeadersSection from "@/components/clups/TeamLeadersSection";
import ClubEventsSection from "@/components/clups/ClubEventsSection";
import ClubContentSection from "@/components/clups/ClubContentSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/clubs/${clubId}/overview`)
      .then((res) => setOverview(res.data))
      .catch((err) => console.error("Error fetching club overview:", err))
      .finally(() => setLoading(false));
  }, [clubId]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="animate-pulse text-[var(--text-muted)]">Loading club...</div>
      </div>
    );
  }

  if (!overview?.club) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Club not found.</p>
      </div>
    );
  }

  const isPrivileged = isAdmin() || isTeamLeader();

  return (
    <main>
      <ClubBanner club={overview.club} />

      {/* Regular users get a join button; Admins/Team Leaders manage requests instead */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        {isPrivileged ? null : <JoinClubButton clubId={clubId} />}
      </div>


      <TeamLeadersSection leaders={overview.teamLeaders} />
      <ClubEventsSection events={overview.events} />
      <ClubContentSection content={overview.content} />
      <Footer />
    </main>
  );
}