"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function UserOverviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    user: null,
    kpi: null,
    badges: { earnedBadges: [], nextBadgeProgress: null },
    certificates: [],
    registrations: [],
    points: [],
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(`/login?redirect=/users/${id}`);
      return;
    }

    if (!id) return;

    const fetchUser = async () => {
      try {
        const [overviewRes, certsRes] = await Promise.all([
          apiClient.get(`/users/${id}/overview`),
          apiClient.get(`/users/${id}/certificates`),
        ]);

        // overviewRes.data => { user, club, eventRegistrations, kpi, points, badges, certificatesCount }
        setData({
          user: overviewRes.data.user,
          kpi: overviewRes.data.kpi,
          badges: {
            earnedBadges: overviewRes.data.badges?.earnedBadges || [],
            nextBadgeProgress: overviewRes.data.badges?.nextBadgeProgress || null,
          },
          registrations: overviewRes.data.eventRegistrations || [],
          points: overviewRes.data.points?.history || [],
          certificates: certsRes.data.certificates || [],
        });
      } catch (error) {
        console.error("Error loading user overview:", error);
        if (error.response?.status === 401) {
          router.replace("/login");
        } else if (error.response?.status === 403) {
          router.replace("/unauthorized"); // only Admin/Team Leader can view this
        } else if (error.response?.status === 404) {
          router.replace("/users"); // user not found
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

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
      <Navbar />
      <ProfileHeader user={data.user} />
      <KpiSection kpi={data.kpi} />
      <BadgesSection {...data.badges} />
      <MyEventsSection registrations={data.registrations} attendance={[]} />
      <PointsHistory history={data.points} />
      <CertificatesSection certificates={data.certificates} />
      <Footer />
    </main>
  );
}