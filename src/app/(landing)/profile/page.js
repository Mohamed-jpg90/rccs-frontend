"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import ProfileHeader from "@/components/userProfile/ProfileHeader";
import KpiSection from "@/components/userProfile/KpiSection";
import BadgesSection from "@/components/userProfile/BadgesSection";
import CertificatesSection from "@/components/userProfile/CertificatesSection";
import MyEventsSection from "@/components/userProfile/MyEventsSection";
import PointsHistory from "@/components/userProfile/PointsHistory";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { isTeamLeader, isAdmin  } from "@/lib/auth";
import LedClubsSection from "@/components/profile/LedClubsSection";
export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    user: null,
    kpi: null,
    badges: { earnedBadges: [], nextBadgeProgress: null },
    certificates: [],
    registrations: [],
    attendance: [],
    points: [],
  });

  useEffect(() => {
    // Route guard — don't even attempt the calls if there's no token
    if (!isAuthenticated()) {
      router.replace("/login?redirect=/profile");
      return;
    }

    const fetchAll = async () => {
      try {
        const [profileRes, kpiRes, badgesRes, certsRes, regsRes, attRes, ptsRes] =
          await Promise.all([
            apiClient.get("/me/profile"),
            apiClient.get("/me/kpi"),
            apiClient.get("/me/badges"),
            apiClient.get("/me/certificates"),
            apiClient.get("/me/registrations"),
            apiClient.get("/me/attendance"),
            apiClient.get("/me/points"),
          ]);

        setData({
          user: profileRes.data.user,
          kpi: kpiRes.data.kpi,
          badges: {
            earnedBadges: badgesRes.data.earnedBadges || [],
            nextBadgeProgress: badgesRes.data.nextBadgeProgress || null,
          },
          certificates: certsRes.data.certificates || [],
          registrations: regsRes.data.registrations || [],
          attendance: attRes.data.history || [],
          points: ptsRes.data.history || [],
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        if (error.response?.status === 401) {
          router.replace("/login?redirect=/profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="animate-pulse text-[var(--text-muted)]">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!data.user) return null;

  return (
    <main>
      <ProfileHeader user={data.user} />
      {!isTeamLeader() && !isAdmin() && <KpiSection kpi={data.kpi} />}
      {isTeamLeader() && <LedClubsSection />}
      <BadgesSection {...data.badges} />
      <MyEventsSection registrations={data.registrations} attendance={data.attendance} />
      <PointsHistory history={data.points} />
      <CertificatesSection certificates={data.certificates} />
      <Footer />
    </main>
  );
}