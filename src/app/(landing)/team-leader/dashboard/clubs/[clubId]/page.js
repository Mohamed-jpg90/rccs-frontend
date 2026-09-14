"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import ClubHero from "@/components/TeamLeader/ClubHero";
import StatsCards from "@/components/TeamLeader/StatsCards";
import AnalyticsCharts from "@/components/TeamLeader/AnalyticsCharts";
import Top3Leaderboard from "@/components/TeamLeader/Top3Leaderboard";
import EventsManager from "@/components/TeamLeader/EventsManager";
import MembersTable from "@/components/TeamLeader/MembersTable";
import MyClubRequestsSection from "@/components/profile/MyClubRequestsSection";
import { isTeamLeader, isAdmin } from "@/lib/auth";
import JoinClubButton from "@/components/clups/JoinClubButton";
import JoinRequestsSection from "@/components/clups/JoinRequestsSection";
import ClubContentSection from "@/components/clups/ClubContentSection";

export default function ClubManagementPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  const load = useCallback(async () => {
    try {
      const overviewRes = await apiClient.get(`/clubs/${clubId}/overview`);
      setClub(overviewRes.data.club);
      setEvents(overviewRes.data.events || []);
      setOverview(overviewRes.data);

      // ⚠️ unconfirmed endpoints — fetched independently so a 404 on any
      // one doesn't block the rest of the page from rendering
      const [statsRes, analyticsRes, top3Res] = await Promise.allSettled([
        apiClient.get(`/clubs/${clubId}/stats`),
        apiClient.get(`/clubs/${clubId}/analytics`),
        apiClient.get(`/clubs/${clubId}/top3`),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
      if (top3Res.status === "fulfilled") setTop3(top3Res.value.data.top3 || []);
    } catch (error) {
      console.error("Error loading club:", error);
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="animate-pulse text-[var(--text-muted)]">Loading club...</div>
      </div>
    );
  }

  if (!club) return <div className="h-[70vh] flex items-center justify-center text-[var(--text-muted)]">Club not found.</div>;
  const isPrivileged = isAdmin() || isTeamLeader();

  return (
    <>
      <ClubHero club={club} onUpdated={setClub} />
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        {isPrivileged ? null : <JoinClubButton clubId={clubId} />}
      </div>

      {isPrivileged && <JoinRequestsSection clubId={clubId} />}

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid lg: gap-6">
        <div className="flex flex-col gap-6">
          <StatsCards stats={stats} />
          <AnalyticsCharts analytics={analytics} />
        </div>
        <Top3Leaderboard top3={top3} />
      </section>

      <EventsManager clubId={clubId} events={events} />
      <MembersTable clubId={clubId} />
      <ClubContentSection clubId={clubId} content={overview?.content ?? []} onContentAdded={load} showAddButton={true} />

      {!isTeamLeader() && !isAdmin() && <JoinRequestsSection />}
    </>
  );
}