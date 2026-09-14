"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { apiClient } from "@/lib/api";
import ClubsBadgesHero from "@/components/clups/ClubsBadgesHero";
import ClubsGrid from "@/components/clups/ClubsGrid";
import BadgesGrid from "@/components/badges/BadgesGrid";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const LIMIT = 8;

export default function ClubsAndBadgesPage() {
  const [activeTab, setActiveTab] = useState("clubs");
  const [search, setSearch] = useState("");

  const [clubs, setClubs] = useState([]);
  const [clubsTotal, setClubsTotal] = useState(0);
  const [clubsPage, setClubsPage] = useState(1);
  const [loadingClubs, setLoadingClubs] = useState(true);

  const [badges, setBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  // Reset search when switching tabs so a club search term doesn't
  // silently filter out every badge
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
  };

  const fetchClubs = useCallback((pageNum) => {
    setLoadingClubs(true);
    apiClient
      .get("/clubs", { params: { page: pageNum, limit: LIMIT } })
      .then((res) => {
        setClubs(res.data.clubs || []);
        setClubsTotal(res.data.total || 0);
      })
      .catch((err) => console.error("Error fetching clubs:", err))
      .finally(() => setLoadingClubs(false));
  }, []);

  useEffect(() => {
    fetchClubs(clubsPage);
  }, [clubsPage, fetchClubs]);

  useEffect(() => {
    apiClient
      .get("/badges")
      .then((res) => setBadges(res.data.badges || []))
      .catch((err) => console.error("Error fetching badges:", err))
      .finally(() => setLoadingBadges(false));
  }, []);

  const filteredClubs = useMemo(
    () => clubs.filter((c) => c.clubName.toLowerCase().includes(search.toLowerCase())),
    [clubs, search]
  );

  const filteredBadges = useMemo(
    () => badges.filter((b) => b.badgeName.toLowerCase().includes(search.toLowerCase())),
    [badges, search]
  );

  const stats = useMemo(() => {
    const openSpots = clubs.reduce(
      (sum, c) => sum + Math.max(0, (c.maxMembers ?? 0) - (c.currentMembersCount ?? 0)),
      0
    );
    const maxPoints = badges.reduce((max, b) => Math.max(max, b.pointsRequired ?? 0), 0);
    return {
      clubsTotal,
      openSpots,
      badgesTotal: badges.length,
      maxPoints,
    };
  }, [clubs, clubsTotal, badges]);

  const totalClubPages = Math.ceil(clubsTotal / LIMIT);

  return (
    <main>
      <ClubsBadgesHero
        activeTab={activeTab}
        onTabChange={handleTabChange}
        stats={stats}
        search={search}
        onSearchChange={setSearch}
      />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {activeTab === "clubs" ? (
          <ClubsGrid
            clubs={filteredClubs}
            loading={loadingClubs}
            page={clubsPage}
            totalPages={totalClubPages}
            onPageChange={setClubsPage}
          />
        ) : (
          <BadgesGrid badges={filteredBadges} loading={loadingBadges} />
        )}
      </section>

      <Footer />
    </main>
  );
}